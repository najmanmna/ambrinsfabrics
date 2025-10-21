import React, { useEffect, useState } from "react";
import { urlFor } from "../lib/image";
import { SanityDocument, useClient } from "sanity";
import { UserIcon, PackageIcon, TagIcon } from '@sanity/icons'

// --- TYPE DEFINITIONS ---
interface OrderDocument extends SanityDocument {
  orderNumber?: string;
  status?: string;
  orderDate?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  address?: {
    line1?: string;
    city?: string;
    district?: string;
    notes?: string;
  };
  paymentMethod?: string;
  items?: Array<{
    _key: string;
    productName?: string;
    productImage?: any;
    variant?: { variantName?: string };
    quantity: number;
    price: number;
  }>;
  purchasedVouchers?: Array<{
    _ref: string;
    _key: string;
  }>;
  subtotal?: number;
  shippingCost?: number;
  total?: number;
}

interface FetchedVoucher {
    _id: string;
    code: string;
    price: number;
    isGift?: boolean;
    fromName?: string;
    toName?: string;
}

// --- HELPER COMPONENT: STATUS BADGE ---
const StatusBadge = ({ status }: { status?: string }) => {
  const statusStyles: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#FEF3C7', text: '#92400E' },
    processing: { bg: '#DBEAFE', text: '#1E40AF' },
    shipped: { bg: '#D1FAE5', text: '#065F46' },
    delivered: { bg: '#A7F3D0', text: '#047857' },
    cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  };

  const style = statusStyles[status || ''] || { bg: '#E5E7EB', text: '#4B5563' };

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
    >
      {status || 'Unknown'}
    </span>
  );
};


// --- MAIN COMPONENT: ORDER SUMMARY VIEW ---
export function OrderSummaryView(props: { document: { displayed: OrderDocument } }) {
  const data = props?.document?.displayed;
  const client = useClient({apiVersion: '2024-01-01'});
  const [fetchedVouchers, setFetchedVouchers] = useState<FetchedVoucher[] | null>(null);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState<boolean>(true);

  useEffect(() => {
    if (!data?.purchasedVouchers || data.purchasedVouchers.length === 0) {
      setFetchedVouchers([]);
      setIsLoadingVouchers(false);
      return;
    }
    const voucherRefs = data.purchasedVouchers.map(v => v._ref);
    client.fetch<FetchedVoucher[]>(
      `*[_id in $voucherRefs]{_id, code, price, isGift, fromName, toName}`,
      { voucherRefs }
    )
    .then(vouchers => {
      setFetchedVouchers(vouchers);
      setIsLoadingVouchers(false);
    })
    .catch(error => {
      console.error("Failed to fetch voucher details:", error);
      setFetchedVouchers([]);
      setIsLoadingVouchers(false);
    });
  }, [data?.purchasedVouchers, client]);

  if (!data) {
    return <p style={{ padding: "1rem" }}>No order data available</p>;
  }
  
  const hasPhysicalItems = data.items && data.items.length > 0;

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        lineHeight: 1.6,
        backgroundColor: '#f8f9fa' // Light gray background for the whole view
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            Order #{data.orderNumber}
          </h1>
          <p style={{ color: '#6c757d', margin: '4px 0 0' }}>
            {data.orderDate ? new Date(data.orderDate).toLocaleString() : "—"}
          </p>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Customer Card */}
        <div style={cardStyle}>
          <h2 style={cardHeaderStyle}>
            <UserIcon style={{width: '20px', height: '20px', marginRight: '8px'}}/>
            Customer Details
          </h2>
          <div style={cardContentStyle}>
            <p><strong>Name:</strong> {data.customerName}</p>
            <p><strong>Phone:</strong> {data.phone}</p>
            <p><strong>Email:</strong> {data.email || "—"}</p>
            {data.address?.line1 && (
              <p style={{marginTop: '12px'}}>
                <strong>Address:</strong><br/>
                {data.address.line1}<br/>
                {data.address.city}, {data.address.district}
              </p>
            )}
            {data.address?.notes && (
              <p style={{ marginTop: '12px', fontStyle: "italic", color: "#6c757d", borderTop: '1px solid #e9ecef', paddingTop: '8px' }}>
                <strong>Notes:</strong> {data.address.notes}
              </p>
            )}
          </div>
        </div>

        {/* Totals & Payment Card */}
        <div style={cardStyle}>
            <h2 style={cardHeaderStyle}>Payment Summary</h2>
            <div style={{...cardContentStyle, textAlign: 'right'}}>
                <div style={totalRowStyle}><span>Subtotal:</span> <span>Rs. {data.subtotal?.toFixed(2) ?? "0.00"}</span></div>
                {(hasPhysicalItems || (data.shippingCost ?? 0) > 0) && (
                    <div style={totalRowStyle}><span>Shipping:</span> <span>Rs. {data.shippingCost?.toFixed(2) ?? "0.00"}</span></div>
                )}
                 <div style={{...totalRowStyle, fontSize: '1.2em', fontWeight: 'bold', borderTop: '2px solid #dee2e6', marginTop: '12px', paddingTop: '12px'}}>
                    <span>Total:</span> <span>Rs. {data.total?.toFixed(2) ?? "0.00"}</span>
                </div>
                 <p style={{ marginTop: "16px", color: '#495057' }}>
                    <strong>Method:</strong> {data.paymentMethod || "—"}
                </p>
            </div>
        </div>

      </div>

      {/* Physical Items Table */}
      {hasPhysicalItems && (
        <div style={{...cardStyle, marginTop: '20px'}}>
           <h2 style={cardHeaderStyle}><PackageIcon style={{width: '20px', height: '20px', marginRight: '8px'}}/>Ordered Items</h2>
           <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Product</th><th style={thStyle}>Qty</th><th style={{...thStyle, textAlign: 'right'}}>Unit Price</th><th style={{...thStyle, textAlign: 'right'}}>Total</th></tr></thead>
            <tbody>
              {data.items?.map((item) => (
                <tr key={item._key} style={{ borderBottom: "1px solid #e9ecef" }}>
                  <td style={{...tdStyle, display: 'flex', alignItems: 'center', gap: '12px'}}>
                    {item.productImage && <img src={urlFor(item.productImage).width(80).height(80).url()} alt={item.productName} style={{width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px"}}/>}
                    <div>
                      <strong>{item.productName || "Product"}</strong>
                      {item.variant?.variantName && <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>{item.variant.variantName}</div>}
                    </div>
                  </td>
                  <td style={{...tdStyle, textAlign: 'center'}}>{item.quantity}</td>
                  <td style={{...tdStyle, textAlign: 'right'}}>Rs. {item.price?.toFixed(2)}</td>
                  <td style={{...tdStyle, textAlign: 'right'}}>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchased Vouchers Table */}
      { (data.purchasedVouchers && data.purchasedVouchers.length > 0) && (
        <div style={{...cardStyle, marginTop: '20px'}}>
           <h2 style={cardHeaderStyle}><TagIcon style={{width: '20px', height: '20px', marginRight: '8px'}}/>Vouchers Purchased</h2>
           {isLoadingVouchers ? (
             <p style={{padding: '16px', fontStyle: 'italic', color: '#6c757d'}}>Loading voucher details...</p>
           ) : (
            <table style={tableStyle}>
                <thead><tr><th style={thStyle}>Voucher Code</th><th style={thStyle}>Details</th><th style={{...thStyle, textAlign: 'right'}}>Value</th></tr></thead>
                <tbody>
                    {fetchedVouchers?.map((voucher) => (
                    <tr key={voucher._id} style={{ borderBottom: "1px solid #e9ecef" }}>
                        <td style={tdStyle}><strong>{voucher.code}</strong></td>
                        <td style={{...tdStyle, fontSize: "0.85rem", color: "#6c757d" }}>
                        {voucher.isGift ? (
                            <>From: {voucher.fromName || "N/A"}<br/>To: {voucher.toName || "N/A"}</>
                        ) : "Personal Voucher"}
                        </td>
                        <td style={{...tdStyle, textAlign: 'right'}}>Rs. {voucher.price?.toFixed(2)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
           )}
        </div>
      )}
    </div>
  );
}

// --- SHARED STYLES ---
const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};
const cardHeaderStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: 600,
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    color: '#343a40',
};
const cardContentStyle: React.CSSProperties = {
    padding: '16px',
    fontSize: '14px',
    color: '#495057',
};
const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
};
const thStyle: React.CSSProperties = {
    padding: "12px",
    background: "#f8f9fa",
    textAlign: "left",
    color: '#6c757d',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '12px',
};
const tdStyle: React.CSSProperties = {
    padding: "12px",
    verticalAlign: "middle",
};
const totalRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
};
