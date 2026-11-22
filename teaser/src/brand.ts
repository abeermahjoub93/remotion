import { loadFont as loadLocal } from "@remotion/fonts";
import { loadFont as loadAlmarai } from "@remotion/google-fonts/Almarai";
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { staticFile } from "remotion";

// SecureLogX Brand v3 — the only colours this teaser may use
export const COLORS = {
  charcoal: "#262626", // background
  green: "#087D40", // St. Patrick's Green
  royal: "#06572D", // Royal Green
  frapp: "#CCB58B", // small tags and thin rules only
  white: "#FFFFFF",
  grey: "#D9D9D9", // Sweet Grey
} as const;

export const FONTS = { ar: "Almarai", en: "Barlow" } as const;

// Fonts load via @remotion/google-fonts. REMOTION_LOCAL_FONTS=1 loads the same Google
// font files from assets/fonts instead (for sandboxes whose browser can't reach Google).
const local = process.env.REMOTION_LOCAL_FONTS === "1";

const loading: Promise<unknown>[] = local
  ? [
      ...["400", "700", "800"].map((w) => loadLocal({ family: FONTS.ar, url: staticFile(`fonts/Almarai-${w}.ttf`), weight: w })),
      ...["500", "700"].map((w) => loadLocal({ family: FONTS.en, url: staticFile(`fonts/Barlow-${w}.ttf`), weight: w })),
    ]
  : [
      loadAlmarai("normal", { weights: ["400", "700", "800"], subsets: ["arabic", "latin"] }).waitUntilDone(),
      loadBarlow("normal", { weights: ["500", "700"], subsets: ["latin"] }).waitUntilDone(),
    ];

export const fontsReady = () => Promise.all(loading);

// Logo: wordmark ratio 8.5 : 1, minimum 120 px wide
export const WORDMARK = { file: "securelogx-wordmark-white.png", ratio: 2225 / 262, minWidth: 120 } as const;
