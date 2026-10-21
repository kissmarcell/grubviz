import { type CommonParams } from "@/types.js";
import { resolvePosition, parseGrubFont } from "@/helper.js";
import { useEffect, useState } from "react";

const COUNTDOWN_START = 10;

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
  const text = props.text ?? "";
  const isCountdown = props.id === "__timeout__" && text.includes("%d");
  const [seconds, setSeconds] = useState(COUNTDOWN_START);

  useEffect(() => {
    if (!isCountdown) return;
    const intervalId = setInterval(
      () => setSeconds((s) => (s <= 0 ? COUNTDOWN_START : s - 1)),
      1000,
    );
    return () => clearInterval(intervalId);
  }, [isCountdown]);

  return (
    <div
      id={props.id}
      style={{
        position: "absolute",
        left: resolvePosition(props.left ?? 0, props.screenSize.width),
        top: resolvePosition(props.top ?? 0, props.screenSize.height),
        width: resolvePosition(props.width, props.screenSize.width),
        height: resolvePosition(props.height, props.screenSize.height),
        fontSize: font?.size,
        fontStyle: font?.style,
        fontWeight: font?.weight,
        fontFamily: font?.family,
        color: props.color,
        textAlign: props.align as "left" | "center" | "right" | undefined,
        display: props.visible !== "false" ? "block" : "none",
      }}
    >
      {isCountdown ? text.replace("%d", seconds.toString()) : text}
    </div>
  );
}
