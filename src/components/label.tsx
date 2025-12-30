import { type CommonParams } from "@/types.js";
import { resolvePosition, parseGrubFont } from "@/helper.js";
import { useEffect, useState } from "react";

export default function Label(
  props: CommonParams & {
    text?: string;
    font?: string;
    color?: string;
    align?: string;
    visible?: string;
  },
) {
  const font = parseGrubFont(props.font);
  const [text, setText] = useState(props.text ?? "");

  useEffect(() => {
    if (props.id === "__timeout__" && props.text && props.text.includes("%d")) {
      let i = 10;
      const update = () => {
        setText(props.text?.replace("%d", i.toString()) ?? "");
        i--;
        if (i < 0) i = 10;
      };

      update();
      const intervalId = setInterval(update, 1000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <div
      id={props.id}
      style={{
        position: "absolute",
        left: resolvePosition(props.left ?? 0, props.screenSize.width),
        top: resolvePosition(props.top ?? 0, props.screenSize.height),
        fontSize: font?.size,
        fontStyle: font?.style,
        fontWeight: font?.weight,
        fontFamily: font?.family,
        color: props.color,
        textAlign: props.align,
        display: props.visible !== "false" ? "block" : "none",
      }}
    >
      {text}
    </div>
  );
}
