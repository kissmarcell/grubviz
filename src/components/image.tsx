import { resolvePosition } from "../helper.js";
import { type CommonParams } from "../types.js";

export default function Image(props: CommonParams & { file?: string }) {
  return (
    <img
      id={props.id}
      src={props.file}
      style={{
        width: props.width,
        height: props.height,
        position: "absolute",
        left: resolvePosition(props.left ?? 0, props.screenSize.width),
        top: resolvePosition(props.top ?? 0, props.screenSize.height),
      }}
    />
  );
}
