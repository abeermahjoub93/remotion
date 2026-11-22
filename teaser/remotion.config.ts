import { Config } from "@remotion/cli/config";

// brand assets live in /assets (used as the public folder)
Config.setPublicDir("./assets");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Cloud container: use the pre-installed headless shell instead of downloading one
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
