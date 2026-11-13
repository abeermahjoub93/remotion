import type React from "react";
import { AR, EN, EN_HEAD } from "../brand";

// Mock invoice from a made-up supplier, "Al-Fajr Supplies". Not a real company;
// every email and IBAN here is invented. Laid out on a fixed 470 × 700 grid so the
// reel can draw highlight boxes over known field positions (see FIELDS).
export const INVOICE_W = 470;
export const INVOICE_H = 700;

export const FIELDS = {
  pressure: { x: 16, y: 94, w: 438, h: 52 },
  sender: { x: 16, y: 150, w: 438, h: 36 },
  bank: { x: 16, y: 512, w: 438, h: 126 },
} as const;

const SunMark: React.FC = () => (
  <svg width={54} height={54} viewBox="0 0 54 54">
    <rect width={54} height={54} rx={12} fill="#1F3A5F" />
    <circle cx={27} cy={34} r={11} fill="#F2A541" />
    <rect x={8} y={34} width={38} height={12} fill="#1F3A5F" />
    {[-60, -30, 0, 30, 60].map((a) => (
      <rect key={a} x={26} y={12} width={2.4} height={7} rx={1} fill="#F2A541" transform={`rotate(${a} 27 34)`} />
    ))}
    <rect x={8} y={36} width={38} height={2.5} rx={1} fill="#F2A541" />
  </svg>
);

const Row: React.FC<{ readonly top: number; readonly children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", left: 24, right: 24, top, display: "flex", justifyContent: "space-between", alignItems: "center" }}>{children}</div>
);

const label = { fontFamily: EN, fontWeight: 500, fontSize: 13, color: "#7a8088", letterSpacing: "0.04em" } as const;
const value = { fontFamily: EN, fontWeight: 600, fontSize: 16, color: "#1f2328" } as const;

export const Invoice: React.FC<{ readonly fake: boolean }> = ({ fake }) => (
  <div
    style={{
      position: "relative",
      width: INVOICE_W,
      height: INVOICE_H,
      background: "#ffffff",
      borderRadius: 18,
      boxShadow: "0 24px 60px rgba(0,0,0,0.30)",
      overflow: "hidden",
    }}
  >
    {/* header */}
    <Row top={24}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <SunMark />
        <div>
          <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 22, color: "#1F3A5F", lineHeight: 1.1 }}>Al-Fajr Supplies</div>
          <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 14, color: "#5d6b7c" }}>الفجر للتوريدات</div>
        </div>
      </div>
      <div style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 20, letterSpacing: "0.12em", color: "#9aa3ad" }}>TAX INVOICE</div>
    </Row>

    {/* notice bar: payment terms on the real one, pressure on the fake */}
    <div
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        top: 100,
        height: 40,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        background: fake ? "#FFF1D6" : "#F2F4F6",
        fontFamily: EN,
        fontWeight: fake ? 700 : 500,
        fontSize: 15,
        color: fake ? "#8a4b00" : "#5a6470",
      }}
    >
      {fake ? "URGENT: pay today to avoid suspension." : "Payment terms: 30 days from invoice date."}
    </div>

    <Row top={156}>
      <span style={label}>FROM</span>
      <span style={{ ...value, fontSize: 17 }}>{fake ? "billing@alfajr-suppIies.sa" : "billing@alfajr-supplies.sa"}</span>
    </Row>
    <Row top={194}>
      <span style={label}>INVOICE NO.</span>
      <span style={value}>INV-2026-1147</span>
    </Row>
    <Row top={222}>
      <span style={label}>DATE</span>
      <span style={value}>15 Nov 2026</span>
    </Row>
    <Row top={250}>
      <span style={label}>BILL TO</span>
      <span style={value}>Accounts Payable</span>
    </Row>

    {/* items */}
    <div style={{ position: "absolute", left: 24, right: 24, top: 296, borderTop: "2px solid #E6E9EC", borderBottom: "2px solid #E6E9EC", padding: "8px 0" }}>
      {[
        ["Office furniture (12 units)", "31,200"],
        ["Printer consumables", "9,800"],
        ["Delivery & installation", "7,500"],
      ].map(([d, a]) => (
        <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", fontFamily: EN, fontSize: 15, color: "#2c333a" }}>
          <span>{d}</span>
          <span style={{ fontWeight: 600 }}>{a}</span>
        </div>
      ))}
    </div>

    <Row top={456}>
      <span style={{ ...label, fontSize: 15 }}>TOTAL DUE</span>
      <span style={{ fontFamily: EN, fontWeight: 600, fontSize: 30, color: "#1F3A5F" }}>SAR 48,500</span>
    </Row>

    {/* bank details */}
    <div style={{ position: "absolute", left: 24, right: 24, top: 518, height: 112, borderRadius: 10, background: "#F7F8FA", padding: "12px 14px" }}>
      <div style={label}>BANK DETAILS</div>
      {fake ? (
        <>
          <div style={{ marginTop: 6, fontFamily: EN, fontWeight: 600, fontSize: 15, color: "#2c333a" }}>Please note our bank account has changed.</div>
          <div style={{ marginTop: 6, fontFamily: EN, fontWeight: 600, fontSize: 16, color: "#1f2328" }}>New IBAN: SA71 4500 0000 0912 3456 7802</div>
        </>
      ) : (
        <>
          <div style={{ marginTop: 6, fontFamily: EN, fontSize: 15, color: "#2c333a" }}>Account name: Al-Fajr Supplies</div>
          <div style={{ marginTop: 6, fontFamily: EN, fontWeight: 600, fontSize: 16, color: "#1f2328" }}>IBAN: SA03 8000 0000 6080 1016 7519</div>
        </>
      )}
    </div>

    <div style={{ position: "absolute", left: 24, bottom: 22, fontFamily: EN, fontSize: 12, color: "#9aa3ad" }}>
      VAT No. 300000000000003 · Riyadh
    </div>

    {/* small SAMPLE watermark */}
    <div
      style={{
        position: "absolute",
        right: 18,
        bottom: 16,
        rotate: "-8deg",
        border: "2px solid rgba(90,95,102,0.35)",
        borderRadius: 6,
        padding: "2px 10px",
        fontFamily: EN_HEAD,
        fontWeight: 700,
        fontSize: 16,
        letterSpacing: "0.2em",
        color: "rgba(90,95,102,0.45)",
      }}
    >
      SAMPLE
    </div>
  </div>
);

