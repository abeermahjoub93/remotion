import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { AR, Background, C, EN, EN_HEAD, Logo } from "../brand";

const Option: React.FC<{
  readonly title: string;
  readonly note: string;
  readonly en: string;
  readonly icon: React.ReactNode;
}> = ({ title, note, en, icon }) => (
  <div
    style={{
      width: 330,
      background: C.white,
      borderRadius: 32,
      padding: "34px 26px 30px",
      boxShadow: "0 18px 44px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      direction: "rtl",
    }}
  >
    <div style={{ width: 96, height: 96, borderRadius: 26, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
    </div>
    <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 52, color: C.ink }}>{title}</div>
    <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 32, color: C.green }}>{note}</div>
    <div style={{ fontFamily: EN_HEAD, fontWeight: 600, fontSize: 24, letterSpacing: "0.1em", color: C.slate }}>{en}</div>
  </div>
);

// Social post (1080×1350) teasing the blog article "CISO داخلي وخارجي"
export const CisoPost: React.FC = () => (
  <AbsoluteFill>
    <Background />

    {/* label + gold rule */}
    <div style={{ position: "absolute", top: 90, right: 90, display: "flex", alignItems: "center", gap: 18, direction: "rtl" }}>
      <div style={{ background: C.green, color: C.white, borderRadius: 999, padding: "10px 26px", fontFamily: AR, fontWeight: 800, fontSize: 30 }}>
        مقال جديد
      </div>
      <div style={{ width: 90, height: 4, borderRadius: 2, background: C.gold }} />
      <div style={{ fontFamily: EN_HEAD, fontWeight: 600, fontSize: 26, letterSpacing: "0.12em", color: C.slate }}>NEW ARTICLE</div>
    </div>

    {/* headline */}
    <div style={{ position: "absolute", top: 190, left: 80, right: 80, textAlign: "center", direction: "rtl" }}>
      <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 92, lineHeight: 1.35, color: C.ink }}>
        <span style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 104 }}>CISO</span> داخلي أو خارجي؟
      </div>
      <div style={{ marginTop: 10, display: "inline-block", background: C.green, color: C.white, borderRadius: 18, padding: "6px 30px 14px", fontFamily: AR, fontWeight: 800, fontSize: 66 }}>
        أيهما يناسب منشأتك؟
      </div>
      <div style={{ marginTop: 18, fontFamily: EN, fontWeight: 500, fontSize: 32, color: C.slate, direction: "ltr" }}>
        In-house or external CISO: which fits your organization?
      </div>
    </div>

    {/* the two options, with the character weighing them up */}
    <div style={{ position: "absolute", top: 590, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 0, direction: "rtl" }}>
      <Option
        title="داخلي"
        note="حضور يومي"
        en="IN-HOUSE"
        icon={
          <>
            <path d="M4 21V5l8-3 8 3v16" />
            <path d="M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2" />
          </>
        }
      />
      <div style={{ width: 300, height: 420, position: "relative" }}>
        <Img src={staticFile("mascot/thinking.png")} style={{ position: "absolute", left: "50%", bottom: -10, translate: "-50% 0px", height: 380, width: "auto" }} />
      </div>
      <Option
        title="خارجي"
        note="خبرة مرنة"
        en="EXTERNAL"
        icon={
          <>
            <circle cx={12} cy={12} r={9} />
            <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
          </>
        }
      />
    </div>

    {/* footer: read more + logo */}
    <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Logo width={260} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.ink, color: C.white, borderRadius: 999, padding: "16px 32px", direction: "rtl" }}>
        <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 32 }}>اقرأ المقال كامل</span>
        <span style={{ fontFamily: EN, fontWeight: 600, fontSize: 30, color: C.gold }}>sx.sa</span>
      </div>
    </div>
  </AbsoluteFill>
);
