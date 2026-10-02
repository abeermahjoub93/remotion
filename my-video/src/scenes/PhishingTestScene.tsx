import type React from "react";
import { AbsoluteFill, useVideoConfig, interpolate, useCurrentFrame } from "remotion";
import {
  AR,
  Background,
  C,
  Caption,
  Cursor,
  EN,
  EN_HEAD,
  FlagIcon,
  Header,
  clamp,
  easeOut,
  enterAt,
  useEnter,
} from "../brand";
import { Sfx } from "../Sfx";

// Timeline (frames, 30fps)
const COUNT_START = 40; // 5-second countdown
const COUNT_END = COUNT_START + 150;
const CLUE = [210, 315, 420]; // sender/domain, urgency, context/link
const CLUE_LEN = 105;
const STAMP = 525;

const LINK_BLUE = "#1a56b3";

// Red outline that draws around a focused part of the email
const Outline: React.FC<{ readonly p: number; readonly radius?: number }> = ({
  p,
  radius = 22,
}) => (
  <div
    style={{
      position: "absolute",
      inset: -14,
      borderRadius: radius,
      border: `5px solid ${C.critical}`,
      opacity: p,
      scale: `${1.08 - 0.08 * p}`,
      boxShadow: `0 0 0 ${p * 10}px rgba(180,35,24,0.12)`,
      pointerEvents: "none",
    }}
  />
);

const InlineFlag: React.FC<{
  readonly children: React.ReactNode;
  readonly p: number;
}> = ({ children, p }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{
        position: "absolute",
        inset: "0.05em -0.12em 0.02em -0.12em",
        background: "rgba(180,35,24,0.16)",
        borderBottom: `4px solid ${C.critical}`,
        borderRadius: 8,
        scale: `${p} 1`,
        transformOrigin: "right center",
      }}
    />
    <span style={{ position: "relative", color: p > 0.4 ? C.critical : "inherit" }}>
      {children}
    </span>
  </span>
);

export const PhishingTestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = useEnter(4, 16);
  const tracker = useEnter(18);

  // which clue is in focus: -1 none, 0..2 clue, 3 stamp
  const focus =
    frame >= STAMP ? 3 : CLUE.reduce((acc, s, i) => (frame >= s ? i : acc), -1);
  const dimFor = (i: number) =>
    focus === -1 || focus === 3 ? 1 : focus === i ? 1 : 0.3;
  const draw = (i: number) =>
    interpolate(frame, [CLUE[i], CLUE[i] + 12], [0, 1], {
      ...clamp,
      easing: easeOut,
    });
  const found = (i: number) => frame >= CLUE[i] + 10;

  // countdown
  const remaining = Math.max(
    0,
    Math.ceil((COUNT_END - frame) / 30 - 0.0001),
  );
  const ringP = interpolate(frame, [COUNT_START, COUNT_END], [1, 0], clamp);
  const countIn = useEnter(COUNT_START - 10);
  const countOut = interpolate(frame, [COUNT_END + 4, COUNT_END + 16], [1, 0], clamp);
  const beat = interpolate(
    (frame - COUNT_START) % 30,
    [0, 8],
    [1.12, 1],
    clamp,
  );
  const urgent = remaining <= 2;

  // clue 3: cursor travels to the button, tooltip reveals the real destination
  const c3 = frame - CLUE[2];
  const tip = interpolate(c3, [22, 32], [0, 1], { ...clamp, easing: easeOut });

  // final stamp
  const st = frame - STAMP;
  const stampScale = interpolate(st, [0, 7], [2.4, 1], {
    ...clamp,
    easing: easeOut,
  });
  const shake = st > 6 && st < 18 ? Math.sin(st * 3) * (18 - st) * 0.8 : 0;

  return (
    <AbsoluteFill>
      <Background />
      <Header />

      {/* Red-flag tracker */}
      <div
        style={{
          position: "absolute",
          top: 196,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          opacity: tracker,
          translate: `0px ${(1 - tracker) * -20}px`,
          direction: "rtl",
        }}
      >
        {[
          { ar: "المرسل", en: "Sender" },
          { ar: "الاستعجال", en: "Urgency" },
          { ar: "الرابط", en: "Link" },
        ].map((f, i) => {
          const on = found(i);
          const s = enterAt(frame, fps, CLUE[i] + 10, 9);
          return (
            <div
              key={f.en}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 24px",
                borderRadius: 999,
                background: on ? C.critical : C.white,
                border: on ? "none" : `3px dashed #c9c9c9`,
                color: on ? C.white : C.slate,
                fontFamily: AR,
                fontWeight: 700,
                fontSize: 32,
                scale: on ? `${0.8 + 0.2 * s}` : "1",
                boxShadow: on ? "0 10px 24px rgba(180,35,24,0.28)" : "none",
              }}
            >
              <FlagIcon size={34} color={on ? C.white : "#b9b9b9"} />
              {on ? f.ar : "؟"}
            </div>
          );
        })}
      </div>

      {/* The phishing email */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 80,
          width: 920,
          background: C.white,
          borderRadius: 40,
          boxShadow: "0 30px 80px rgba(0,0,0,0.14)",
          padding: "0 44px 40px",
          direction: "rtl",
          fontFamily: AR,
          color: C.ink,
          opacity: card,
          translate: `0px ${(1 - card) * 260}px`,
          scale: `${0.92 + 0.08 * card}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 96,
            borderBottom: `2px solid ${C.mist}`,
            fontSize: 30,
            color: C.slate,
            opacity: focus === -1 || focus === 3 ? 1 : 0.3,
          }}
        >
          <span style={{ fontWeight: 700 }}>البريد الوارد</span>
          <span style={{ fontFamily: EN }}>9:41 AM</span>
        </div>

        {/* Sender — clue 1 */}
        <div
          style={{
            position: "relative",
            marginTop: 34,
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: dimFor(0),
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              background: "#e8eef9",
              color: LINK_BLUE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: EN,
              fontWeight: 600,
              fontSize: 36,
              flexShrink: 0,
            }}
          >
            IT
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 40 }}>
              الدعم الفني | IT Support
            </div>
            <div
              style={{
                direction: "ltr",
                textAlign: "right",
                fontFamily: EN,
                fontSize: 31,
                marginTop: 6,
                color: C.slate,
              }}
            >
              it-support@
              <span
                style={{
                  color: draw(0) > 0.5 ? C.critical : C.slate,
                  fontWeight: draw(0) > 0.5 ? 600 : 400,
                }}
              >
                company-sa-support.com
              </span>
            </div>
          </div>
          {frame >= CLUE[0] && frame < CLUE[0] + CLUE_LEN ? (
            <Outline p={draw(0)} />
          ) : null}
        </div>

        {/* Subject + body — clue 2 */}
        <div style={{ opacity: dimFor(1) }}>
          <div
            style={{
              marginTop: 40,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1.4,
            }}
          >
            <InlineFlag p={draw(1)}>عاجل:</InlineFlag> سيتم إيقاف حسابك
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 37,
              lineHeight: 1.7,
              color: "#333",
            }}
          >
            عزيزي الموظف،
            <br />
            رصدنا محاولة دخول غير معتادة على حسابك. لتجنّب إيقاف الحساب، أكّد
            بياناتك{" "}
            <InlineFlag
              p={interpolate(frame, [CLUE[1] + 8, CLUE[1] + 20], [0, 1], {
                ...clamp,
                easing: easeOut,
              })}
            >
              خلال 30 دقيقة
            </InlineFlag>
            .
          </div>
        </div>

        {/* Button — clue 3 */}
        <div
          style={{
            position: "relative",
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
            opacity: dimFor(2),
          }}
        >
          <div
            style={{
              position: "relative",
              background: LINK_BLUE,
              color: C.white,
              borderRadius: 18,
              padding: "26px 70px",
              fontWeight: 800,
              fontSize: 40,
            }}
          >
            تأكيد الحساب
            {frame >= CLUE[2] && frame < CLUE[2] + CLUE_LEN ? (
              <Outline p={draw(2)} radius={26} />
            ) : null}
            {/* hover tooltip with the real destination */}
            <div
              style={{
                position: "absolute",
                top: -118,
                left: "50%",
                translate: `-50% ${(1 - tip) * 16}px`,
                opacity: frame < CLUE[2] + CLUE_LEN ? tip : 0,
                background: C.ink,
                color: C.white,
                borderRadius: 14,
                padding: "16px 24px",
                whiteSpace: "nowrap",
                direction: "ltr",
                fontFamily: EN,
                fontWeight: 500,
                fontSize: 30,
                boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              }}
            >
              http://
              <span style={{ color: "#ff8a80", fontWeight: 600 }}>
                company-sa.verify-login.co
              </span>
              /auth
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 27,
            color: C.slate,
            textAlign: "center",
            opacity: focus === -1 || focus === 3 ? 1 : 0.3,
          }}
        >
          فريق تقنية المعلومات
        </div>

        {/* cursor for clue 3 */}
        {c3 >= 0 && c3 < CLUE_LEN ? (
          <div
            style={{
              position: "absolute",
              left: interpolate(c3, [0, 20], [700, 470], {
                ...clamp,
                easing: easeOut,
              }),
              top: interpolate(c3, [0, 20], [900, 640], {
                ...clamp,
                easing: easeOut,
              }),
              opacity: interpolate(c3, [0, 6], [0, 1], clamp),
            }}
          >
            <Cursor size={76} />
          </div>
        ) : null}

        {/* stamp */}
        {st >= 0 ? (
          <AbsoluteFill
            style={{
              borderRadius: 40,
              background: `rgba(247,247,245,${interpolate(st, [0, 6], [0, 0.55], clamp)})`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                border: `10px solid ${C.critical}`,
                borderRadius: 26,
                padding: "10px 50px 20px",
                color: C.critical,
                textAlign: "center",
                rotate: "-9deg",
                scale: `${stampScale}`,
                translate: `${shake}px 0px`,
                opacity: interpolate(st, [0, 3], [0, 1], clamp),
                background: "rgba(255,255,255,0.85)",
              }}
            >
              <div style={{ fontFamily: AR, fontWeight: 800, fontSize: 150 }}>
                احتيال!
              </div>
              <div
                style={{
                  fontFamily: EN_HEAD,
                  fontWeight: 700,
                  fontSize: 64,
                  letterSpacing: "0.3em",
                  marginTop: -18,
                }}
              >
                PHISHING
              </div>
            </div>
          </AbsoluteFill>
        ) : null}
      </div>

      {/* Countdown */}
      <div
        style={{
          position: "absolute",
          top: 1236,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: Math.min(countIn, countOut),
          scale: `${0.8 + 0.2 * countIn}`,
        }}
      >
        <div style={{ position: "relative", width: 230, height: 230 }}>
          <svg width={230} height={230} viewBox="0 0 230 230">
            <circle cx={115} cy={115} r={100} stroke={C.mist} strokeWidth={16} fill={C.white} />
            <circle
              cx={115}
              cy={115}
              r={100}
              stroke={urgent ? C.critical : C.green}
              strokeWidth={16}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * (1 - ringP)}
              transform="rotate(-90 115 115)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: EN_HEAD,
              fontWeight: 700,
              fontSize: 130,
              color: urgent ? C.critical : C.green,
              scale: frame >= COUNT_START ? `${beat}` : "1",
            }}
          >
            {frame < COUNT_START ? 5 : remaining}
          </div>
        </div>
        <div
          style={{
            marginTop: 26,
            direction: "rtl",
            fontFamily: AR,
            fontWeight: 800,
            fontSize: 48,
            color: C.ink,
          }}
        >
          دقّق في المرسل، الاستعجال، والرابط
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: EN,
            fontWeight: 500,
            fontSize: 32,
            color: C.slate,
          }}
        >
          Check the sender, the urgency and the link
        </div>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 999,
            border: `2px solid ${C.green}`,
            color: C.green,
            fontFamily: AR,
            fontWeight: 700,
            fontSize: 28,
            direction: "rtl",
          }}
        >
          <svg width={26} height={26} viewBox="0 0 24 24">
            <rect x={6} y={4} width={4} height={16} rx={1} fill={C.green} />
            <rect x={14} y={4} width={4} height={16} rx={1} fill={C.green} />
          </svg>
          وقّف الفيديو لو تبي وقت أكثر
          <span style={{ fontFamily: EN, fontWeight: 500, color: C.slate }}>
            · Pause for more time
          </span>
        </div>
      </div>

      {/* Clue captions */}
      <Caption
        start={CLUE[0] + 8}
        end={CLUE[0] + CLUE_LEN}
        top={1250}
        arSize={52}
        ar={
          <>
            <span style={{ color: C.critical }}>01 </span>المرسل والنطاق: الاسم
            رسمي… بس النطاق مو نطاق جهتك
          </>
        }
        en="Sender & domain: the name looks official, the domain isn't."
      />
      <Caption
        start={CLUE[1] + 8}
        end={CLUE[1] + CLUE_LEN}
        top={1250}
        arSize={52}
        ar={
          <>
            <span style={{ color: C.critical }}>02 </span>الاستعجال: «عاجل» و«خلال
            30 دقيقة» عشان ما تلحق تفكر
          </>
        }
        en="Urgency: designed to rush you past thinking."
      />
      <Caption
        start={CLUE[2] + 8}
        end={CLUE[2] + CLUE_LEN}
        top={1250}
        arSize={52}
        ar={
          <>
            <span style={{ color: C.critical }}>03 </span>السياق والرابط: طلب ما
            توقعته، ورابط يوديك لمكان ثاني
          </>
        }
        en="Context & destination: an unexpected request, a link that goes elsewhere."
      />
      <Caption
        start={STAMP + 14}
        top={1290}
        arSize={60}
        ar={
          <>
            <span style={{ color: C.critical }}>3 / 3</span> علامات… رسالة تصيّد
          </>
        }
        en="Three red flags. It's a phishing message."
      />

      {/* sound */}
      <Sfx name="whoosh" at={2} volume={0.5} />
      <Sfx name="notify" at={14} volume={0.7} />
      <Sfx name="pop" at={20} volume={0.4} />
      <Sfx name="tick" at={COUNT_START} />
      <Sfx name="tick" at={COUNT_START + 30} />
      <Sfx name="tick" at={COUNT_START + 60} />
      <Sfx name="tick" at={COUNT_START + 90} volume={1} />
      <Sfx name="tick" at={COUNT_START + 120} volume={1} />
      <Sfx name="alert" at={COUNT_END} volume={0.7} />
      <Sfx name="scan" at={CLUE[0]} />
      <Sfx name="pop" at={CLUE[0] + 10} volume={0.6} />
      <Sfx name="scan" at={CLUE[1]} />
      <Sfx name="pop" at={CLUE[1] + 10} volume={0.6} />
      <Sfx name="swish" at={CLUE[2]} volume={0.4} />
      <Sfx name="scan" at={CLUE[2] + 18} />
      <Sfx name="pop" at={CLUE[2] + 10} volume={0.6} />
      <Sfx name="stamp" at={STAMP + 5} />
      <Sfx name="success" at={STAMP + 16} volume={0.6} />
    </AbsoluteFill>
  );
};
