import { resolvePosition } from "@/helper.js";
import { type CommonParams } from "@/types.js";
import { useAssetResolver } from "@/asset_context.js";

export default function Image(props: CommonParams & { file?: string }) {
  const resolveAsset = useAssetResolver();
  return (
    <img
      id={props.id}
      src={resolveAsset(props.file)}
      alt=""
      style={{
        width: resolvePosition(props.width, props.screenSize.width),
        height: resolvePosition(props.height, props.screenSize.height),
        position: "absolute",
        left: resolvePosition(props.left ?? 0, props.screenSize.width),
        top: resolvePosition(props.top ?? 0, props.screenSize.height),
      }}
    />
  );
}
