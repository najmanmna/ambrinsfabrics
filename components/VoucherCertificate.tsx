"use client";

import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";

interface VoucherCertificateProps {
  voucher: {
    code: string;
    createdAt: string | Date;
    productName?: string;
    price?: number;
    fromName?: string;
    toName?: string;
    isGift?: boolean;
    expiry?: string;
  };
}

const VoucherCertificate: React.FC<VoucherCertificateProps> = ({ voucher }) => {
  const voucherRef = useRef<HTMLDivElement>(null);

  const issuedDate = new Date(voucher.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadPDF = async () => {
    if (!voucherRef.current) return;

    const downloadButton = document.getElementById("download-pdf-button");
    if (downloadButton) downloadButton.style.display = "none";

    try {
      const voucherElement = voucherRef.current;

      // Capture original size
      const elementWidth = voucherElement.offsetWidth;
      const elementHeight = voucherElement.offsetHeight;

      // Higher scale = sharper PDF (but slower)
      const scale = 5;

      const canvas = await html2canvas(voucherElement, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#EEE8DD",
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");

      // Create A4 portrait PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a3",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate scaled dimensions
      const aspectRatio = elementWidth / elementHeight;
      let renderWidth = pdfWidth - 60; // left-right margin 30 each
      let renderHeight = renderWidth / aspectRatio;

      // If still taller than page, fit to height instead
      if (renderHeight > pdfHeight - 60) {
        renderHeight = pdfHeight - 60;
        renderWidth = renderHeight * aspectRatio;
      }

      // Center on page
      const xOffset = (pdfWidth - renderWidth) / 2;
      const yOffset = (pdfHeight - renderHeight) / 2;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, renderWidth, renderHeight, undefined, "FAST");
      pdf.save(`gift-certificate-${voucher.code}.pdf`);

      toast.success("Voucher PDF downloaded!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF");
    } finally {
      if (downloadButton) downloadButton.style.display = "flex";
    }
  };

  return (
    <div style={{ backgroundColor: "#F9F6F2" }} className="py-12 flex justify-center min-h-screen">
      <div className="flex flex-col items-center">
        {/* Voucher */}
        <div
          ref={voucherRef}
          style={{
            width: "350px",
            height: "700px",
            backgroundColor: "#EEE8DD",
            fontFamily: "serif",
            color: "#2C3E50",
            position: "relative",
            padding: "40px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Top Leaf */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "10px",
              width: "100px",
              opacity: "0.8",
            }}
          >
            <img src="/leaf2.png" alt="Leaf" style={{ width: "100%", transform: "scaleX(-1)" }} />
          </div>
          {/* Bottom Leaf */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              width: "100px",
              opacity: "0.8",
            }}
          >
            <img src="/leaf1.png" alt="Leaf" style={{ width: "100%" }} />
          </div>

          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "5px" }}>
              SINCE 1999
            </p>
            <img src="/ambrinslogo.png" alt="Logo" style={{ width: "80px", margin: "0 auto 5px" }} />
            <img src="/LogoBlack.png" alt="Logo" style={{ width: "180px", margin: "0 auto 5px" }} />
         
          </div>

          {/* Body */}
          <div style={{ width: "100%", flexGrow: 1, marginTop: "3px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "normal",
                marginBottom: "20px",
                textAlign: "center",
                color: "#2C3E50",
              }}
            >
              Gift Certificate
            </h2>

            {[
              { label: "To", value: voucher.toName },
              { label: "From", value: voucher.fromName },
              { label: "Date", value: issuedDate },
              { label: "Amount", value: voucher.price ? `Rs. ${voucher.price.toLocaleString()}` : undefined },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  marginBottom: "10px",
                  borderBottom: "1px dotted #6B625C",
                  paddingBottom: "3px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "15px",
                }}
              >
                <span style={{ color: "#2C3E50" }}>{label}:</span>
                <span style={{ color: "#6B625C" }}>
                  {value || "................................................."}
                </span>
              </div>
            ))}

            <div style={{ marginTop: "5px", textAlign: "center", backgroundColor: "rgba(255,255,255,0.5)", padding: "5px" }}>
              <span style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#2C3E50" }}>
                Voucher Code:
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#A67B5B",
                  fontWeight: "bold",
                  marginLeft: "10px",
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                }}
              >
                {voucher.code}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", width: "100%", marginTop: "auto" }}>
            <p style={{ fontSize: "13px", lineHeight: "1.5", marginBottom: "15px" }}>
              ORCHARD SHOPPING COMPLEX<br />
              (GROUND FLOOR)<br />
              7/5 GALLE ROAD, COLOMBO 06
            </p>
            <p style={{ fontSize: "14px", marginBottom: "15px", fontWeight: "bold" }}>
              011 2 553 633 | 0777 367 403
            </p>
            <p style={{ fontSize: "12px", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Follow us on our socials
            </p>
            <p style={{ fontSize: "13px", marginBottom: "25px", color: "#A67B5B" }}>elda.lk</p>
            <p style={{ fontSize: "10px", color: "#6B625C", lineHeight: "1.4" }}>
              Valid for one year from date of purchase<br />
              T&C Apply
            </p>
          </div>
        </div>

        {/* Download Button */}
        <button
          id="download-pdf-button"
          onClick={handleDownloadPDF}
          style={{ backgroundColor: "#2C3E50", color: "#FFFFFF" }}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md transition-all hover:bg-opacity-90"
        >
          <Download className="w-4 h-4" />
          Download Voucher
        </button>
      </div>
    </div>
  );
};

export default VoucherCertificate;
