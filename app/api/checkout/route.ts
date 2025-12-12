// /app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidv4 } from "uuid";
import { sendSubscribeEmail } from "@/lib/sendSubscribeEmail";

// --- Types ---

interface VoucherItemForEmail {
  code: string;
  toName: string;
}

interface IncomingCartVoucher {
  productId: string;
  isGift: boolean;
  fromName?: string;
  toName?: string;
  price: number;
}

interface ProcessedVoucherForSanity {
  _id: string;
  _type: "voucher";
  code: string;
  isGift: boolean;
  fromName?: string;
  toName?: string;
  product: { _type: "reference"; _ref: string };
  price: number;
  orderNumber?: string;
  redeemed: boolean;
  createdAt: string;
}

export const runtime = "nodejs";

// ------------------ MAIN HANDLER ------------------ //
export async function POST(req: Request) {
  try {
    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        { error: "Missing SANITY_API_TOKEN" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { form, items, total, shippingCost } = body;

    // --- Validation Logic ---
    const normalItems = items.filter(
      (it: any) => !it.type || it.type !== "voucher"
    );
    const hasPhysicalProducts = normalItems.length > 0;

    // ✅ Generate _id for each voucher document NOW
    const processedVouchers: ProcessedVoucherForSanity[] = items
      .filter((it: any) => it.type === "voucher")
      .flatMap((it: { vouchers: IncomingCartVoucher[] }) =>
        it.vouchers.map((v: IncomingCartVoucher) => {
          const voucherDocId = uuidv4();
          return {
            _id: voucherDocId,
            _type: "voucher",
            code: `VCHR-${uuidv4().split("-")[0].toUpperCase()}`,
            isGift: v.isGift,
            fromName: v.fromName || "",
            toName: v.toName || "",
            product: { _type: "reference", _ref: v.productId },
            price: v.price,
            redeemed: false,
            createdAt: new Date().toISOString(),
          };
        })
      );

    // --- Basic Field Validation ---
    if (
      !form?.firstName ||
      !form?.lastName ||
      !form?.phone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required customer details or empty cart" },
        { status: 400 }
      );
    }

    if (
      hasPhysicalProducts &&
      (!form?.address || !form?.district || !form?.city)
    ) {
      return NextResponse.json(
        { error: "Missing required shipping fields for physical items" },
        { status: 400 }
      );
    }

    // ✅ Fetch fresh product data (Stock Check)
    const productIds = normalItems.map((it: any) => it.product._id);
    const freshProducts = await backendClient.fetch(
      `*[_type == "product" && _id in $ids]{
        _id, _rev, name, price,
        variants[] {
          _key, variantName, openingStock, stockOut,
          "availableStock": openingStock - coalesce(stockOut, 0),
          images
        }
      }`,
      { ids: productIds }
    );

    // ✅ Validate stock & Prepare Official Items
    const officialOrderItems = normalItems.map((it: any) => {
      const fresh = freshProducts.find((p: any) => p._id === it.product._id);
      
      if (!fresh) throw new Error(`Product not found: ${it.product?._id}`);

      const matchedVariant = fresh.variants?.find(
        (v: any) => v._key === it.variant?._key
      );

      if (!matchedVariant) throw new Error(`Variant missing for ${fresh.name}`);

      if (matchedVariant.availableStock < it.quantity) {
        throw new Error(`Insufficient stock for ${fresh.name} (${matchedVariant.variantName})`);
      }

      // Sync revision ID for optimistic locking
      it.product._rev = fresh._rev;

      // Construct the cleaned item object here
      return {
        _type: "orderItem",
        _key: uuidv4(),
        product: { _type: "reference", _ref: it.product._id },
        // 🔒 Store the name directly on the order item so it persists even if product changes later
        productName: fresh.name, 
        variant: {
          variantKey: matchedVariant._key,
          // 🔒 FIX: Use the name from Sanity, fallback to "Standard"
          variantName: matchedVariant.variantName || "Standard",
        },
        quantity: it.quantity,
        price: it.product.finalPrice ?? it.product.price ?? 0,
        productImage: matchedVariant.images?.[0]
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: matchedVariant.images[0].asset._ref,
              },
            }
          : undefined,
      };
    });

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // ✅ Duplicate check
    const recentOrder = await backendClient.fetch(
      `*[_type == "order" && phone == $phone && total == $total && orderDate > $recent][0]`,
      {
        phone: form.phone,
        total,
        recent: new Date(Date.now() - 30 * 1000).toISOString(),
      }
    );
    if (recentOrder) {
      return NextResponse.json(
        { error: "Duplicate order detected" },
        { status: 429 }
      );
    }

    // --- Order Status ---
    let orderStatus = "pending";
    if (form.payment === "CARD") {
      orderStatus = "processing";
    }

    // ✅ Construct Order Document
    const orderDoc = {
      _type: "order",
      orderNumber: orderId,
      status: orderStatus,
      orderDate: new Date().toISOString(),
      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email || "",
      address: hasPhysicalProducts
        ? {
            district: form.district,
            city: form.city,
            line1: form.address,
            notes: form.notes || "",
          }
        : undefined,
      paymentMethod: form.payment,
      items: officialOrderItems, // 🔒 Use the sanitized items list
      purchasedVouchers: processedVouchers.map((v) => ({
        _type: "reference",
        _ref: v._id,
        _key: uuidv4(),
      })),
      subtotal: items.reduce((acc: number, it: any) => {
        if (it.type === "voucher") {
          return (
            acc +
            it.vouchers.reduce((vAcc: number, v: any) => vAcc + v.price, 0)
          );
        }
        return (
          acc +
          (it.product.finalPrice ?? it.product.price ?? 0) * it.quantity
        );
      }, 0),
      shippingCost: shippingCost ?? 0,
      total,
      stockRestored: false,
    };

    // ✅ TRANSACTION
    const tx = backendClient.transaction();
    tx.create(orderDoc);

    normalItems.forEach((it: any) => {
      const variantKey = it.variant?._key;
      tx.patch(it.product._id, (p) =>
        p
          .setIfMissing({ [`variants[_key=="${variantKey}"].stockOut`]: 0 })
          .inc({ [`variants[_key=="${variantKey}"].stockOut`]: it.quantity })
          .ifRevisionId(it.product._rev)
      );
    });

    processedVouchers.forEach((v: ProcessedVoucherForSanity) => {
      tx.create({ ...v, orderNumber: orderId });
    });

    await tx.commit();

    // 📧 SEND EMAILS (Using officialOrderItems)
    const emailPromises = [];

    if (form.email) {
      const customerHtml = generateCustomerEmailHtml({
        orderId,
        customerName: `${form.firstName} ${form.lastName}`,
        items: officialOrderItems, // 🔒 Safe items
        vouchers: processedVouchers,
        total,
        shippingCost,
        shippingAddress: hasPhysicalProducts
          ? `${form.address}, ${form.city}, ${form.district}`
          : null,
      });

      emailPromises.push(
        sendSubscribeEmail({
          to: form.email,
          subject: `Order Confirmed: ${orderId}`,
          html: customerHtml,
        })
      );
    }

    const adminHtml = generateAdminEmailHtml({
      orderId,
      customerName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email,
      items: officialOrderItems, // 🔒 Safe items
      vouchers: processedVouchers,
      total,
      paymentMethod: form.payment,
      address: hasPhysicalProducts
        ? `${form.address}, ${form.city}, ${form.district}`
        : "Vouchers Only",
      notes: form.notes,
    });

    emailPromises.push(
      sendSubscribeEmail({
        to: "orders@elda.lk",
        subject: `[New Order] ${orderId} - ${form.payment}`,
        html: adminHtml,
      })
    );

    await Promise.allSettled(emailPromises);

    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderId,
        vouchers: processedVouchers,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Checkout API Error:", err);
    // Handle error elegantly
    const errorMessage = err instanceof Error ? err.message : "Server error";
    // Check for known errors to return correct status
    const status = errorMessage.includes("Insufficient stock") ? 409 : 500;
    
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

// ==========================================
// 🎨 HTML EMAIL GENERATORS
// ==========================================

function generateCustomerEmailHtml(data: any) {
  const { orderId, customerName, items, vouchers, total, shippingCost, shippingAddress } = data;
  const brandColor = "#A67B5B";
  const darkColor = "#2C3E50";
  const bgLight = "#FDFBF6";

  const voucherSection =
    vouchers.length > 0
      ? `
      <div style="margin: 30px 0;">
        <h3 style="color: ${brandColor}; font-family: serif; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Your Digital Vouchers</h3>
        ${vouchers
          .map(
            (v: any) => `
          <div style="border: 2px dashed ${brandColor}; background: #fff; padding: 20px; margin-bottom: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Gift Voucher</p>
            <h2 style="margin: 10px 0; color: ${darkColor}; font-size: 24px; letter-spacing: 2px;">${v.code}</h2>
            <p style="margin: 0; font-size: 16px; color: ${darkColor}; font-weight: bold;">Value: LKR ${v.price.toLocaleString()}</p>
            ${
              v.isGift
                ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 14px; font-style: italic;">From: ${v.fromName} &rarr; To: ${v.toName}</p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
      : "";

  const itemsRows = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px 0; color: ${darkColor}; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br/>
        <span style="font-size: 13px; color: #777;">${item.variant?.variantName || "Standard"}</span>
      </td>
      <td style="padding: 12px 0; text-align: right; color: ${darkColor}; border-bottom: 1px solid #eee;">x${item.quantity}</td>
      <td style="padding: 12px 0; text-align: right; color: ${darkColor}; border-bottom: 1px solid #eee;">
        LKR ${item.price.toLocaleString()}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: ${bgLight}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5;">
        <div style="background-color: ${darkColor}; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-family: serif; font-weight: 400; letter-spacing: 1px;">ELDA</h1>
          <p style="color: #cccccc; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px;">HOUSE OF BLOCK PRINTS</p>
        </div>

        <div style="padding: 40px 30px;">
          <h2 style="color: ${brandColor}; margin-top: 0; font-family: serif;">Order Confirmed</h2>
          <p style="color: #555; line-height: 1.6;">
            Hello ${customerName},<br/><br/>
            Thank you for shopping with ELDA. Your order <strong>#${orderId}</strong> has been received successfully.
          </p>

          ${voucherSection}

          ${
            items.length > 0
              ? `
            <div style="margin-top: 30px;">
              <h3 style="color: ${brandColor}; font-family: serif; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsRows}
              </table>
            </div>`
              : ""
          }

          <div style="margin-top: 20px; text-align: right;">
            ${
              shippingCost > 0
                ? `<p style="margin: 5px 0; color: #777;">Shipping: LKR ${shippingCost.toLocaleString()}</p>`
                : ""
            }
            <p style="margin: 10px 0; color: ${darkColor}; font-size: 18px; font-weight: bold;">
              Total: LKR ${total.toLocaleString()}
            </p>
          </div>

          ${
            shippingAddress
              ? `
            <div style="margin-top: 30px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0; color: ${darkColor};">Shipping Address</h4>
              <p style="margin: 0; color: #555; font-size: 14px;">${shippingAddress}</p>
            </div>`
              : ""
          }
        </div>

        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #888; font-size: 12px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} ELDA. All rights reserved.</p>
        
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAdminEmailHtml(data: any) {
  const { orderId, customerName, phone, email, items, vouchers, total, paymentMethod, address, notes } = data;

  const statusColor = paymentMethod === "CARD" ? "#27ae60" : "#e67e22";

  // 🔒 FIX: Added fallback "Standard" so it never says undefined
  const allItems = [
    ...items.map((i: any) => `<li>[ITEM] ${i.productName} (${i.variant?.variantName || "Standard"}) x${i.quantity}</li>`),
    ...vouchers.map((v: any) => `<li>[VOUCHER] ${v.code} - LKR ${v.price}</li>`),
  ].join("");

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="padding: 20px; border: 1px solid #ddd;">
        <h2 style="margin-top:0;">New Order: <span style="color: #0070f3;">#${orderId}</span></h2>
        
        <div style="background: #f5f5f5; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerName}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email || "N/A"}</p>
          <p style="margin: 5px 0;"><strong>Payment:</strong> <span style="color: ${statusColor}; font-weight:bold;">${paymentMethod}</span></p>
          <p style="margin: 5px 0;"><strong>Total:</strong> LKR ${total.toLocaleString()}</p>
        </div>

        <h3>Order Items:</h3>
        <ul>${allItems}</ul>

        <h3>Delivery Details:</h3>
        <p>${address}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}

        <br/>
        
      </div>
    </body>
    </html>
  `;
}