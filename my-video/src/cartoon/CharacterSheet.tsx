import { AbsoluteFill } from "remotion";
import { Background } from "../brand";
import { Character, REST } from "./Character";

// Preview of the rig's expressions and props
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Character rig={REST} x={200} y={640} scale={0.55} />
    <Character rig={{ ...REST, mouth: 0.8, armR: 150, mood: "happy" }} x={540} y={640} scale={0.55} />
    <Character rig={{ ...REST, mood: "worried", armL: 40 }} x={880} y={640} scale={0.55} />
    <Character rig={{ ...REST, hold: "phone", armR: 70, lookY: -1 }} x={200} y={1220} scale={0.55} />
    <Character rig={{ ...REST, hold: "magnifier", armR: 60, mood: "surprised" }} x={540} y={1220} scale={0.55} />
    <Character rig={{ ...REST, hold: "shield", armR: 40, mood: "happy", armL: 160 }} x={880} y={1220} scale={0.55} />
    <Character rig={{ ...REST, legL: 22, legR: -22, armL: 30, armR: 30, blink: 1 }} x={540} y={1820} scale={0.55} />
  </AbsoluteFill>
);
