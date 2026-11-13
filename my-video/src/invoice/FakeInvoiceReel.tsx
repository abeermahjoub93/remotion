import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AR, Background, C, EN, EN_HEAD, clamp } from "../brand";
import { Sfx } from "../Sfx";
import { FIELDS, INVOICE_H, INVOICE_W, Invoice } from "./Invoice";

// Highlight colour for the reveal boxes ("Frapp" in the brief). Brand gold until confirmed.
const HIGHLIGHT = C.gold;

// Timeline (30 fps, 28 s)
const SIDE = 90; // invoices side by side
const COUNT = 180; // 3-2-1
const REVEAL = 270; // "B is the fake"
const SENDER = 330;
const BANK = 420;
const PRESSURE = 510;
const RULE = 600;
const END = 720;

const ease = Easing.out(Easing.cubic);

// Slide in along a 45° diagonal (300–500 ms, ease-out). dir: where it comes from.
const diag = (frame: number, start: number, dir: "tl" | "tr" | "bl" | "br", dist = 140, dur = 12) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: ease });
  const sx = dir === "tl" || dir === "bl" ? -1 : 1;
  const sy = dir === "tl" || dir === "tr" ? -1 : 1;
  return { opacity: p, translate: `${sx * dist * (1 - p)}px ${sy * dist * (1 - p)}px` };
};

const CAPTIONS: { from: number; en: string; ar: string }[] = [
  { from: 0, en: "One of these invoices is fake. Can you spot it?", ar: "واحدة من هاتين الفاتورتين مزيّفة. هل تكتشفها؟" },
  { from: SIDE, en: "Pause and look closely.", ar: "أوقف المقطع ودقّق." },
  { from: REVEAL, en: "B is the fake. Here’s how to tell.", ar: "الفاتورة ب هي المزيّفة. وهذه العلامات." },
  { from: SENDER, en: "1 · The sender: a capital i in place of a lowercase L", ar: "1 · المرسل: نطاق شبيه بالأصلي، بحرف واحد مختلف." },
  { from: BANK, en: "2 · The bank details: “Please note our bank account has changed.” New IBAN.", ar: "2 · بيانات الحساب: «نرجو ملاحظة تغيّر حسابنا البنكي». رقم آيبان جديد." },
  { from: PRESSURE, en: "3 · The pressure: “URGENT: pay today to avoid suspension.”", ar: "3 · الضغط: «عاجل: يُرجى السداد اليوم لتجنّب إيقاف الخدمة»." },
  { from: RULE, en: "The rule: New bank details? Call the supplier on a number you already have before you pay.", ar: "القاعدة: بيانات بنكية جديدة؟ اتصل بالمورد على رقم مسجّل لديك مسبقًا قبل أن تدفع." },
  { from: END, en: "Security you can strengthen. Compliance you can prove.", ar: "أمن تقدر تقوّيه، والتزام تقدر تثبته." },
];

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const i = CAPTIONS.reduce((acc, c, k) => (frame >= c.from ? k : acc), 0);
  const c = CAPTIONS[i];
  const m = diag(frame, c.from, "bl", 40, 10);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 270, display: "flex", justifyContent: "center", ...m }}>
      <div style={{ background: "rgba(0,0,0,0.38)", borderRadius: 26, padding: "22px 34px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: C.white }}>{c.en}</div>
        <div style={{ marginTop: 10, direction: "rtl", fontFamily: AR, fontWeight: 700, fontSize: 40, lineHeight: 1.45, color: "#E3EDE6" }}>{c.ar}</div>
      </div>
    </div>
  );
};

const Box: React.FC<{ readonly f: { x: number; y: number; w: number; h: number }; readonly n: string; readonly at: number; readonly active: boolean }> = ({ f, n, at, active }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const m = diag(frame, at, "tl", 24, 10);
  return (
    <div style={{ position: "absolute", left: f.x, top: f.y, width: f.w, height: f.h, borderRadius: 10, border: `${active ? 4 : 2}px solid ${HIGHLIGHT}`, background: active ? "rgba(204,181,139,0.20)" : "transparent", opacity: m.opacity * (active ? 1 : 0.6), translate: m.translate }}>
      <div style={{ position: "absolute", left: -15, top: -15, width: 30, height: 30, borderRadius: 99, background: HIGHLIGHT, color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN_HEAD, fontWeight: 700, fontSize: 18 }}>{n}</div>
    </div>
  );
};

const Tag: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 18, background: C.white, color: C.deepGreen, fontFamily: EN_HEAD, fontWeight: 700, fontSize: 40 }}>{children}</div>
);

export const FakeInvoiceReel: React.FC = () => {
  const frame = useCurrentFrame();

  // invoice positions: side by side, then B comes to the centre for the reveal
  const toCentre = interpolate(frame, [REVEAL, REVEAL + 15], [0, 1], { ...clamp, easing: ease });
  const bScale = interpolate(toCentre, [0, 1], [0.98, 1.5]);
  const bLeft = interpolate(toCentre, [0, 1], [560, 540 - (INVOICE_W * 1.5) / 2]);
  const bTop = interpolate(toCentre, [0, 1], [400, 245]);
  const bOut = interpolate(frame, [RULE, RULE + 12], [0, 1], { ...clamp, easing: ease });
  const aOut = interpolate(frame, [REVEAL, REVEAL + 12], [0, 1], { ...clamp, easing: ease });
  const aIn = diag(frame, SIDE, "bl");
  const bIn = diag(frame, SIDE + 4, "br");
  const count = frame >= COUNT && frame < REVEAL ? 3 - Math.floor((frame - COUNT) / 30) : null;
  const countP = count === null ? 0 : interpolate((frame - COUNT) % 30, [0, 9], [0, 1], { ...clamp, easing: ease });

  const open = frame < SIDE;
  const end = frame >= END;

  return (
    <AbsoluteFill>
      <Background dark />

      {/* opening title (0–3 s) */}
      {open ? (
        <AbsoluteFill style={{ opacity: interpolate(frame, [SIDE - 10, SIDE], [1, 0], clamp) }}>
          <div style={{ position: "absolute", top: 460, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", ...diag(frame, 4, "tl", 180) }}>
            <div style={{ width: 150, height: 150, borderRadius: 18, background: C.green, border: `3px solid rgba(255,255,255,0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile("img/sx-white.png")} style={{ width: 104 }} />
            </div>
          </div>
          <div style={{ position: "absolute", top: 680, left: 60, right: 60, textAlign: "center", ...diag(frame, 12, "br", 180) }}>
            <div style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 108, lineHeight: 1, letterSpacing: "0.02em", color: C.white }}>SPOT THE FAKE INVOICE</div>
            <div style={{ margin: "26px auto", width: 160, height: 5, borderRadius: 3, background: HIGHLIGHT }} />
            <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 72, color: C.white }}>اكتشف الفاتورة المزيّفة</div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* invoices */}
      {frame >= SIDE && frame < RULE + 14 ? (
        <>
          <div style={{ position: "absolute", left: 60, top: 400, ...aIn, opacity: aIn.opacity * (1 - aOut), translate: aOut > 0 ? `${-220 * aOut}px ${220 * aOut}px` : aIn.translate }}>
            <div style={{ position: "absolute", top: -96, left: 0, right: 0, display: "flex", justifyContent: "center" }}><Tag>A</Tag></div>
            <div style={{ scale: "0.98", transformOrigin: "0 0" }}>
              <Invoice fake={false} />
            </div>
          </div>
          <div style={{ position: "absolute", left: bLeft, top: bTop, ...bIn, opacity: bIn.opacity * (1 - bOut), translate: bOut > 0 ? `${220 * bOut}px ${220 * bOut}px` : bIn.translate }}>
            <div style={{ position: "absolute", top: -96, left: 0, width: INVOICE_W * bScale, display: "flex", justifyContent: "center", opacity: 1 - toCentre }}><Tag>B</Tag></div>
            <div style={{ width: INVOICE_W, height: INVOICE_H, scale: `${bScale}`, transformOrigin: "0 0", position: "relative" }}>
              <Invoice fake />
              {/* the reveal */}
              {frame >= REVEAL + 8 ? (
                <div style={{ position: "absolute", inset: 0, borderRadius: 18, border: `3px solid ${HIGHLIGHT}`, opacity: interpolate(frame, [REVEAL + 8, REVEAL + 18], [0, 1], clamp) }} />
              ) : null}
              <Box f={FIELDS.sender} n="1" at={SENDER} active={frame < BANK} />
              <Box f={FIELDS.bank} n="2" at={BANK} active={frame >= BANK && frame < PRESSURE} />
              <Box f={FIELDS.pressure} n="3" at={PRESSURE} active={frame >= PRESSURE} />
            </div>
          </div>
        </>
      ) : null}

      {/* "B is the fake" label */}
      {frame >= REVEAL + 10 && frame < SENDER ? (
        <div style={{ position: "absolute", top: 160, left: 0, right: 0, display: "flex", justifyContent: "center", ...diag(frame, REVEAL + 10, "tr", 80) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: HIGHLIGHT, color: C.ink, borderRadius: 999, padding: "10px 30px" }}>
            <span style={{ fontFamily: EN_HEAD, fontWeight: 700, fontSize: 40, letterSpacing: "0.06em" }}>B = FAKE</span>
            <span style={{ fontFamily: AR, fontWeight: 800, fontSize: 36 }}>ب مزيّفة</span>
          </div>
        </div>
      ) : null}

      {/* sender comparison: capital I vs lowercase l */}
      {frame >= SENDER + 10 && frame < BANK ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 760, ...diag(frame, SENDER + 10, "br", 80) }}>
          <div style={{ background: C.ink, borderRadius: 26, padding: "26px 30px", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
            {[
              { ok: true, pre: "billing@alfajr-supp", ch: "l", post: "ies.sa", note: "lowercase L" },
              { ok: false, pre: "billing@alfajr-supp", ch: "I", post: "ies.sa", note: "capital i" },
            ].map((r) => (
              <div key={r.note} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0" }}>
                <div style={{ width: 44, height: 44, borderRadius: 99, background: r.ok ? C.compliant : "transparent", border: r.ok ? "none" : `3px solid ${HIGHLIGHT}`, display: "flex", alignItems: "center", justifyContent: "center", color: r.ok ? C.white : HIGHLIGHT, fontFamily: EN, fontWeight: 700, fontSize: 26 }}>
                  {r.ok ? "✓" : "✕"}
                </div>
                <div style={{ flex: 1, fontFamily: EN, fontWeight: 500, fontSize: 36, color: C.white }}>
                  {r.pre}
                  <span style={{ fontFamily: "Georgia, 'DejaVu Serif', serif", fontWeight: 700, fontSize: 48, lineHeight: 1, color: C.ink, background: HIGHLIGHT, borderRadius: 6, padding: "0 8px", margin: "0 2px" }}>{r.ch}</span>
                  {r.post}
                </div>
                <div style={{ fontFamily: EN, fontSize: 22, color: "#b9c2bb" }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* countdown */}
      {count !== null ? (
        <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 150, height: 150, borderRadius: 999, border: `6px solid ${HIGHLIGHT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EN_HEAD, fontWeight: 700, fontSize: 96, color: C.white, opacity: countP, translate: `${-30 * (1 - countP)}px ${-30 * (1 - countP)}px` }}>
            {count}
          </div>
        </div>
      ) : null}

      {/* the rule */}
      {frame >= RULE + 6 && frame < END ? (
        <div style={{ position: "absolute", top: 360, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
          <div style={{ ...diag(frame, RULE + 6, "tl", 160), fontFamily: EN_HEAD, fontWeight: 700, fontSize: 64, letterSpacing: "0.14em", color: HIGHLIGHT }}>THE RULE · القاعدة</div>
          <div style={{ ...diag(frame, RULE + 12, "tr", 160), display: "flex", alignItems: "center", gap: 26, background: C.white, borderRadius: 30, padding: "30px 36px", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
            <svg width={120} height={120} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
            <div>
              <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 58, color: C.ink }}>New bank details?</div>
              <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 800, fontSize: 56, color: C.green }}>بيانات بنكية جديدة؟</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 10 }}>
            {[
              { en: "Saved number", ar: "رقم مسجّل", at: RULE + 26, d: "M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2zM8 8h6M8 12h6M18 8h2M18 12h2" },
              { en: "Call first", ar: "اتصل أولاً", at: RULE + 36, d: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" },
              { en: "Then pay", ar: "ثم ادفع", at: RULE + 46, d: "M5 12.5l4.5 4.5L19 7" },
            ].map((s, k) => (
              <div key={s.en} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                {k > 0 ? <div style={{ ...diag(frame, s.at - 4, "bl", 40), width: 24, height: 4, borderRadius: 2, background: HIGHLIGHT }} /> : null}
                <div style={{ ...diag(frame, s.at, "bl", 120), width: 270, padding: "30px 0", borderRadius: 24, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <svg width={76} height={76} viewBox="0 0 24 24" fill="none" stroke={HIGHLIGHT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={s.d} /></svg>
                  <div style={{ fontFamily: EN, fontWeight: 600, fontSize: 36, color: C.white }}>{s.en}</div>
                  <div style={{ direction: "rtl", fontFamily: AR, fontWeight: 700, fontSize: 36, color: "#E3EDE6" }}>{s.ar}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* end card (24–28 s) */}
      {end ? (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ ...diag(frame, END + 2, "tl", 160), width: 170, height: 170, borderRadius: 20, background: C.green, border: "3px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile("img/sx-white.png")} style={{ width: 118 }} />
            </div>
            <div style={{ ...diag(frame, END + 8, "br", 160), marginTop: 50 }}>
              <Img src={staticFile("img/logo-white.png")} style={{ width: 760 }} />
            </div>
            <div style={{ ...diag(frame, END + 14, "bl", 120), marginTop: 40, width: 140, height: 5, borderRadius: 3, background: HIGHLIGHT }} />
            <div style={{ ...diag(frame, END + 18, "tr", 120), marginTop: 50, display: "flex", alignItems: "center", gap: 16, border: `3px solid ${HIGHLIGHT}`, borderRadius: 999, padding: "18px 46px", fontFamily: EN, fontWeight: 600, fontSize: 50, color: C.white }}>
              www.sx.sa
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* logo top-right, solid white (hidden on the end card, which shows it large) */}
      {!end ? (
        <Img src={staticFile("img/logo-white.png")} style={{ position: "absolute", top: 90, right: 64, width: 250, opacity: interpolate(frame, [END - 8, END], [1, 0], clamp) }} />
      ) : null}

      <Captions />

      <Sfx name="whoosh" at={2} volume={0.5} />
      <Sfx name="swish" at={12} volume={0.45} />
      <Sfx name="whoosh" at={SIDE} volume={0.45} />
      <Sfx name="swish" at={SIDE + 4} volume={0.4} />
      <Sfx name="tick" at={COUNT} />
      <Sfx name="tick" at={COUNT + 30} />
      <Sfx name="tock" at={COUNT + 60} />
      <Sfx name="ding" at={REVEAL + 8} volume={0.5} />
      <Sfx name="swish" at={REVEAL} volume={0.4} />
      <Sfx name="scan" at={SENDER} volume={0.5} />
      <Sfx name="pop" at={SENDER + 10} volume={0.4} />
      <Sfx name="scan" at={BANK} volume={0.5} />
      <Sfx name="scan" at={PRESSURE} volume={0.5} />
      <Sfx name="alert" at={PRESSURE + 6} volume={0.25} />
      <Sfx name="whoosh" at={RULE} volume={0.45} />
      <Sfx name="click" at={RULE + 26} volume={0.4} />
      <Sfx name="click" at={RULE + 36} volume={0.4} />
      <Sfx name="success" at={RULE + 46} volume={0.5} />
      <Sfx name="whoosh" at={END} volume={0.5} />
      <Sfx name="ding" at={END + 18} volume={0.5} />
    </AbsoluteFill>
  );
};
