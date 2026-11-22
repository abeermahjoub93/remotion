import { loadFont as loadLocal } from "@remotion/fonts";
import { loadFont as loadAlmarai } from "@remotion/google-fonts/Almarai";
import { loadFont as loadBarlowCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { staticFile } from "remotion";

// Brand v3 fonts: Almarai (Arabic), Barlow Condensed 700 for the big numbers.
// Normally loaded with @remotion/google-fonts. REMOTION_LOCAL_FONTS=1 loads the same
// Google font files from public/fonts instead, for sandboxes whose browser cannot
// reach fonts.gstatic.com.
const local = process.env.REMOTION_LOCAL_FONTS === "1";

export const AR = "Almarai";
export const NUM = "Barlow Condensed";

const loading: Promise<unknown>[] = local
  ? [
      ...["400", "700", "800"].map((w) => loadLocal({ family: AR, url: staticFile(`fonts/Almarai-${w}.ttf`), weight: w })),
      loadLocal({ family: NUM, url: staticFile("fonts/BarlowCondensed-700.ttf"), weight: "700" }),
    ]
  : [
      loadAlmarai("normal", { weights: ["400", "700", "800"], subsets: ["arabic", "latin"] }).waitUntilDone(),
      loadBarlowCondensed("normal", { weights: ["700"], subsets: ["latin"] }).waitUntilDone(),
    ];

export const fontsReady = () => Promise.all(loading);
