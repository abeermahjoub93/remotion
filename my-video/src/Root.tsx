import { Composition, Folder, Still } from "remotion";
import { OtpVideo } from "./OtpVideo";
import { LogoIntroScene } from "./qr/LogoIntroScene";
import { QrAskScene } from "./qr/QrAskScene";
import { QrCtaScene } from "./qr/QrCtaScene";
import { QrHookScene } from "./qr/QrHookScene";
import { QrRehookScene } from "./qr/QrRehookScene";
import { QrRouteScene } from "./qr/QrRouteScene";
import { CartoonQrVideo } from "./CartoonQrVideo";
import { CisoPost } from "./posts/CisoPost";
import { FakeInvoiceReel } from "./invoice/FakeInvoiceReel";
import { CharacterSheet } from "./cartoon/CharacterSheet";
import { CtAskScene } from "./cartoon/CtAskScene";
import { CtCtaScene } from "./cartoon/CtCtaScene";
import { CtDoorScene } from "./cartoon/CtDoorScene";
import { CtHelloScene } from "./cartoon/CtHelloScene";
import { CtHookScene } from "./cartoon/CtHookScene";
import { CtRouteScene } from "./cartoon/CtRouteScene";
import { QrMascotVideo } from "./QrMascotVideo";
import { QrVideo } from "./QrVideo";
import { OtpCtaScene } from "./otp/OtpCtaScene";
import { OtpDoScene } from "./otp/OtpDoScene";
import { OtpDontScene } from "./otp/OtpDontScene";
import { OtpHookScene } from "./otp/OtpHookScene";
import { OtpRehookScene } from "./otp/OtpRehookScene";
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
      <Composition
        id="UnexpectedOtp"
        component={OtpVideo}
        durationInFrames={1268}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QrCodeDoorway"
        component={QrVideo}
        durationInFrames={1190}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="QrCodeDoorwayMascot"
        component={QrMascotVideo}
        durationInFrames={1190}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FakeInvoiceReel"
        component={FakeInvoiceReel}
        durationInFrames={840}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Posts">
        <Still id="CisoPost" component={CisoPost} width={1080} height={1350} />
      </Folder>
      <Composition
        id="QrCartoon"
        component={CartoonQrVideo}
        durationInFrames={1532}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Cartoon-scenes">
        <Composition id="CtHello" component={CtHelloScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="CtHook" component={CtHookScene} durationInFrames={190} fps={30} width={1080} height={1920} />
        <Composition id="CtRoute" component={CtRouteScene} durationInFrames={220} fps={30} width={1080} height={1920} />
        <Composition id="CtAsk" component={CtAskScene} durationInFrames={400} fps={30} width={1080} height={1920} />
        <Composition id="CtDoor" component={CtDoorScene} durationInFrames={196} fps={30} width={1080} height={1920} />
        <Composition id="CtCta" component={CtCtaScene} durationInFrames={220} fps={30} width={1080} height={1920} />
      </Folder>
      <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Folder name="Qr-scenes">
        <Composition id="LogoIntro" component={LogoIntroScene} durationInFrames={100} fps={30} width={1080} height={1920} />
        <Composition id="QrHook" component={QrHookScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="QrRoute" component={QrRouteScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="QrAsk" component={QrAskScene} durationInFrames={330} fps={30} width={1080} height={1920} defaultProps={{ signLeft: 210 }} />
        <Composition id="QrRehook" component={QrRehookScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="QrCta" component={QrCtaScene} durationInFrames={180} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="Otp-scenes">
        <Composition id="OtpHook" component={OtpHookScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="OtpDont" component={OtpDontScene} durationInFrames={300} fps={30} width={1080} height={1920} />
        <Composition id="OtpRehook" component={OtpRehookScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="OtpDo" component={OtpDoScene} durationInFrames={270} fps={30} width={1080} height={1920} />
        <Composition id="OtpCta" component={OtpCtaScene} durationInFrames={180} fps={30} width={1080} height={1920} />
      </Folder>
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
        <Composition id="Outro" component={OutroScene} durationInFrames={140} fps={30} width={1080} height={1920} defaultProps={{ mark: "shield" as const }} />
      </Folder>
    </>
  );
};
