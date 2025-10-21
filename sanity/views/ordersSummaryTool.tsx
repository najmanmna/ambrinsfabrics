import React, { useEffect, useState, useMemo } from "react";
import { definePlugin } from "sanity";
import { useClient } from "sanity";
import { LinkIcon } from '@sanity/icons'; // For linking to the product

export const ordersSummaryTool = definePlugin({
  name: "orders-summary",
  tools: [
    {
      name: "orders-summary",
      title: "Orders Summary",
      component: OrdersSummary,
    },
  ],
});

// --- TYPE DEFINITIONS ---
interface OrderItem {
  productName: string;
  variant?: { variantName?: string };
  quantity?: number;
  price?: number;
}

interface PurchasedVoucher {
  _id: string;
  code: string;
  price: number;
  isGift?: boolean;
  fromName?: string;
  toName?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  status?: string;
  total?: number;
  orderDate?: string;
  items?: OrderItem[];
  purchasedVouchers?: PurchasedVoucher[];
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
    <span style={{
      backgroundColor: style.bg, color: style.text,
      padding: '4px 10px', borderRadius: '9999px',
      fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
    }}>
      {status || 'Unknown'}
    </span>
  );
};

// --- MAIN COMPONENT: ORDERS SUMMARY ---
function OrdersSummary() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    client
      .fetch(
        `*[_type == "order"]{
          _id, orderNumber, customerName, status, total, orderDate,
          items[]{ productName, quantity, price, variant },
          purchasedVouchers[]->{ _id, code, price, isGift, fromName, toName }
        } | order(orderDate desc)`
      )
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
        setIsLoading(false);
      });
  }, [client]);

  const filteredOrders = useMemo(() => {
    const searchLower = search.toLowerCase();
    return orders
      .filter((o) =>
        o.customerName.toLowerCase().includes(searchLower) ||
        o.orderNumber.toLowerCase().includes(searchLower)
      )
      .filter((o) => !filterStatus || o.status === filterStatus);
  }, [orders, search, filterStatus]);
  
  if (isLoading) return <div style={styles.container}>Loading orders...</div>;
  if (error) return <div style={{...styles.container, color: 'red'}}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeader}>📝 Orders Summary</h1>

      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by order # or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.select}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div style={styles.cardGrid}>
        {filteredOrders.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#666' }}>No orders match the current filters.</p>
        ) : (
          filteredOrders.map((o) => (
            <div key={o._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>Order #{o.orderNumber}</h2>
                  <p style={styles.cardSubtitle}>{o.customerName}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div style={styles.cardContent}>
                {o.items && o.items.length > 0 && (
                  <div style={{ marginBottom: o.purchasedVouchers?.length ? '1rem' : '0' }}>
                    <strong>Products:</strong>
                    <ul style={styles.itemList}>
                      {o.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity} × {item.productName}{" "}
                          {item.variant?.variantName ? `(${item.variant.variantName})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {o.purchasedVouchers && o.purchasedVouchers.length > 0 && (
                  <div>
                    <strong>Vouchers:</strong>
                    <ul style={styles.itemList}>
                      {o.purchasedVouchers.map((voucher, idx) => (
                        <li key={idx}>
                          {voucher.code} (Rs. {voucher.price?.toFixed(2)})
                          {voucher.isGift ? ` (To: ${voucher.toName || "N/A"})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div style={styles.cardFooter}>
                <div>
                  <p style={styles.totalLabel}>Total</p>
                  <p style={styles.totalValue}>Rs. {o.total?.toFixed(2) ?? "0.00"}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                   <p style={styles.dateText}>
                    {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—"}
                  </p>
                  <a href={`/admin/studio/structure/orders;allOrders;${o._id}`} style={styles.editLink}>
                    View Details <LinkIcon style={{ marginLeft: '4px', width: '1em', height: '1em' }} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- STYLES OBJECT ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: "24px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    mainHeader: {
        fontSize: "24px",
        fontWeight: 700,
        marginBottom: "24px",
    },
    filterBar: {
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
    },
    input: {
        padding: '10px 12px',
        flex: '1 1 300px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
    },
    select: {
        padding: '10px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
        backgroundColor: 'white',
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '16px',
        borderBottom: '1px solid #e9ecef',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 600,
        margin: 0,
    },
    cardSubtitle: {
        fontSize: '14px',
        color: '#6c757d',
        margin: '4px 0 0',
    },
    cardContent: {
        padding: '16px',
        fontSize: '14px',
        flexGrow: 1,
    },
    itemList: {
        margin: '4px 0 0',
        paddingLeft: '1.2em',
        fontSize: '13px',
        color: '#495057'
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
    },
    totalLabel: {
        fontSize: '12px',
        color: '#6c757d',
        margin: 0,
    },
    totalValue: {
        fontSize: '18px',
        fontWeight: 700,
        margin: 0,
    },
    dateText: {
        fontSize: '12px',
        color: '#6c757d',
        marginBottom: '8px'
    },
    editLink: {
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#007bff',
        fontSize: '14px',
        fontWeight: 500,
    }
};
