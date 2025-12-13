// src/sanity/tools/stockReportTool.tsx
import React, { useEffect, useState, useMemo } from "react";
import { definePlugin } from "sanity";
import { useClient } from "sanity";
import { LinkIcon } from "@sanity/icons"; // For linking to the product
import { IntentLink } from "sanity/router";

export const stockReportTool = definePlugin({
  name: "stock-report",
  tools: [
    {
      name: "stock-report",
      title: "Stock Report",
      component: StockReport,
    },
  ],
});

// Interfaces
interface Variant {
  _key: string;
  colorName?: string;
  openingStock?: number;
  stockOut?: number;
  availableStock: number;
}

interface Product {
  _id: string;
  name: string;
  category?: { _id: string; name: string };
  variants?: Variant[];
}

interface GroupedProducts {
  [categoryName: string]: Product[];
}

interface CategoryTotals {
  openingStock: number;
  stockOut: number;
  available: number;
  availableMeters?: number; // Specifically for fabrics
  availableUnits?: number; // For non-fabrics
}

// Type for the calculated summaries
interface StockSummaries {
  categoryTotals: Record<string, CategoryTotals>;
  overallTotals: CategoryTotals;
}

function StockReport() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOutOfStock, setFilterOutOfStock] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    client
      .fetch<Product[]>(
        `*[_type == "product"]{
          _id,
          name,
          category->{_id, name},
          variants[]{
            _key,
            variantName,
            openingStock,
            stockOut,
            "availableStock": coalesce(openingStock, 0) - coalesce(stockOut, 0)
          }
        }`
      )
      .then((data) => {
        setProducts(data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stock report:", err);
        setError("Failed to load stock data.");
        setIsLoading(false);
      });
  }, [client]);

  // Process, filter, group, and calculate totals
  const processedData = useMemo<
    StockSummaries & { groupedProducts: GroupedProducts }
  >(() => {
    const searchLower = search.toLowerCase();
    const groupedProducts: GroupedProducts = {};
    const categoryTotals: Record<string, CategoryTotals> = {};
    const overallTotals: CategoryTotals = {
      openingStock: 0,
      stockOut: 0,
      available: 0,
      availableMeters: 0,
      availableUnits: 0,
    };

    products
      .filter((p) => p.name.toLowerCase().includes(searchLower)) // Filter by search
      .forEach((product) => {
        const categoryName = product.category?.name || "Uncategorized";
        const isFabric = categoryName.toLowerCase() === "fabrics";

        // Filter variants based on the checkbox *before* processing
        const relevantVariants =
          product.variants?.filter(
            (v) => !filterOutOfStock || v.availableStock <= 0
          ) || [];

        // Only process if there are relevant variants
        if (relevantVariants.length > 0) {
          // Add to groupedProducts for detailed view
          if (!groupedProducts[categoryName]) {
            groupedProducts[categoryName] = [];
          }
          groupedProducts[categoryName].push({
            ...product,
            variants: relevantVariants,
          });

          // Initialize category totals if needed
          if (!categoryTotals[categoryName]) {
            categoryTotals[categoryName] = {
              openingStock: 0,
              stockOut: 0,
              available: 0,
              availableMeters: 0,
              availableUnits: 0,
            };
          }

          // Calculate totals for relevant variants
          relevantVariants.forEach((v) => {
            const opening = v.openingStock || 0;
            const out = v.stockOut || 0;
            const available = v.availableStock; // Use pre-calculated value

            // Update category totals
            categoryTotals[categoryName].openingStock += opening;
            categoryTotals[categoryName].stockOut += out;
            categoryTotals[categoryName].available += available;
            if (isFabric) {
              categoryTotals[categoryName].availableMeters =
                (categoryTotals[categoryName].availableMeters || 0) + available;
            } else {
              categoryTotals[categoryName].availableUnits =
                (categoryTotals[categoryName].availableUnits || 0) + available;
            }

            // Update overall totals
            overallTotals.openingStock += opening;
            overallTotals.stockOut += out;
            overallTotals.available += available;
            if (isFabric) {
              overallTotals.availableMeters =
                (overallTotals.availableMeters || 0) + available;
            } else {
              overallTotals.availableUnits =
                (overallTotals.availableUnits || 0) + available;
            }
          });
        }
      });

    return { groupedProducts, categoryTotals, overallTotals };
  }, [products, search, filterOutOfStock]);

  const { groupedProducts, categoryTotals, overallTotals } = processedData;
  const categoryNames = Object.keys(groupedProducts).sort();

  // --- RENDER LOGIC ---

  if (isLoading) {
    return <div style={{ padding: "20px" }}>Loading stock report...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>
        📦 Stock Report by Category
      </h1>

      {/* Filters */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            flexGrow: 1,
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "200px",
          }}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={filterOutOfStock}
            onChange={(e) => setFilterOutOfStock(e.target.checked)}
          />
          Show only out-of-stock items
        </label>
      </div>

      {/* Check if any products remain after filtering */}
      {categoryNames.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "#666", marginTop: "20px" }}>
          No products match the current filters.
        </p>
      ) : (
        <>
          {/* --- Detailed Stock List by Category --- */}
          {categoryNames.map((categoryName) => {
            const categoryProducts = groupedProducts[categoryName];
            return (
              <div key={categoryName} style={{ marginBottom: "30px" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    marginBottom: "10px",
                    borderBottom: "2px solid #A67B5B",
                    paddingBottom: "5px",
                    color: "#A67B5B",
                  }}
                >
                  {categoryName}
                </h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Product</th>
                      <th style={thStyle}>Variant</th>
                      <th style={thStyle}>Opening Stock</th>
                      <th style={thStyle}>Stock Out</th>
                      <th style={thStyle}>Available</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryProducts.map((p) =>
                      p.variants?.map((v) => (
                        <tr
                          key={v._key}
                          style={{
                            background:
                              v.availableStock <= 0 ? "#EF9A9A" : "transparent",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <td style={tdStyle}>{p.name}</td>
                          <td style={tdStyle}>{v.variantName || "-"}</td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {v.openingStock || 0}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {v.stockOut || 0}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>
                            {v.availableStock}
                          </td>
                          <td style={tdStyle}>
                            <IntentLink
                              intent="edit"
                              params={{ id: p._id, type: "product" }} // "type" is required for the intent
                              title="Edit Product"
                              style={{
                                textDecoration: "none",
                                color: "#007bff",
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.9em",
                              }}
                            >
                              Edit{" "}
                              <LinkIcon
                                style={{
                                  marginLeft: "4px",
                                  width: "1em",
                                  height: "1em",
                                }}
                              />
                            </IntentLink>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {/* REMOVED Category Totals Footer from here */}
                </table>
              </div>
            );
          })}

          {/* --- Category Summary Table (NEW) --- */}
          <div
            style={{
              marginTop: "30px",
              paddingTop: "15px",
              borderTop: "2px solid #ccc",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
              Category Totals (Filtered)
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Category</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>
                    Opening Stock
                  </th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Stock Out</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>
                    Available (Total)
                  </th>
                  <th style={{ ...thStyle, textAlign: "right" }}>
                    Available (Meters)
                  </th>
                  <th style={{ ...thStyle, textAlign: "right" }}>
                    Available (Units)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryTotals)
                  .sort(([catA], [catB]) => catA.localeCompare(catB))
                  .map(([catName, totals]) => (
                    <tr
                      key={catName}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={tdStyle}>{catName}</td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {totals.openingStock}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {totals.stockOut}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {totals.available}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {catName.toLowerCase() === "fabrics"
                          ? totals.availableMeters
                          : "-"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        {catName.toLowerCase() !== "fabrics"
                          ? totals.availableUnits
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* --- Overall Summary (NEW) --- */}
          <div
            style={{
              marginTop: "30px",
              paddingTop: "15px",
              borderTop: "3px double #333",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
              Overall Summary (Filtered)
            </h2>
            <table style={{ width: "auto", borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ fontWeight: "bold" }}>
                  <td
                    style={{
                      ...tdStyle,
                      background: "#f3f3f3",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Grand Total Opening Stock:
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {overallTotals.openingStock}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td
                    style={{
                      ...tdStyle,
                      background: "#f3f3f3",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Grand Total Stock Out:
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {overallTotals.stockOut}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td
                    style={{
                      ...tdStyle,
                      background: "#f3f3f3",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Grand Total Available Stock:
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {overallTotals.available}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td
                    style={{
                      ...tdStyle,
                      background: "#f3f3f3",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total Available Fabric Meters:
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {overallTotals.availableMeters || 0} m
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td
                    style={{
                      ...tdStyle,
                      background: "#f3f3f3",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total Available Other Units:
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    {overallTotals.availableUnits || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// Shared Styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "10px 8px",
  background: "#f0f0f0",
  textAlign: "left" as const,
  fontSize: "0.9em",
  fontWeight: 600,
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  verticalAlign: "top" as const,
  fontSize: "0.9em",
};
