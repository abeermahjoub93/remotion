import { Composition, Folder } from "remotion";
import { PasswordVideo } from "./PasswordVideo";
import { PwChallengeScene } from "./password/PwChallengeScene";
import { PwCtaScene } from "./password/PwCtaScene";
import { PwFixScene } from "./password/PwFixScene";
import { PwHookScene } from "./password/PwHookScene";
import { PwRehookScene } from "./password/PwRehookScene";
import { PwReuseScene } from "./password/PwReuseScene";
import { PhishingVideo } from "./PhishingVideo";
import { CoreMessageScene } from "./scenes/CoreMessageScene";
import { CtaScene } from "./scenes/CtaScene";
import { EngageScene } from "./scenes/EngageScene";
import { HookScene } from "./scenes/HookScene";
import { OutroScene } from "./scenes/OutroScene";
import { PhishingTestScene } from "./scenes/PhishingTestScene";
import { RehookScene } from "./scenes/RehookScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhishingRedFlags"
        component={PhishingVideo}
        durationInFrames={1599}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PasswordReuse"
        component={PasswordVideo}
        durationInFrames={1584}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Password-scenes">
        <Composition id="PwHook" component={PwHookScene} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="PwReuse" component={PwReuseScene} durationInFrames={390} fps={30} width={1080} height={1920} />
        <Composition id="PwRehook" component={PwRehookScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="PwFix" component={PwFixScene} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="PwCta" component={PwCtaScene} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="PwChallenge" component={PwChallengeScene} durationInFrames={240} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="Scenes">
        <Composition id="Hook" component={HookScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="PhishingTest" component={PhishingTestScene} durationInFrames={585} fps={30} width={1080} height={1920} />
        <Composition id="Rehook" component={RehookScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="CoreMessage" component={CoreMessageScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Cta" component={CtaScene} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Engage" component={EngageScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Outro" component={OutroScene} durationInFrames={140} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
