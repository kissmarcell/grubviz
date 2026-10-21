import { type ThemeArray } from "@/types.js";
import Label from "@/components/label.js";
import Image from "@/components/image.js";
import BootMenu from "@/components/bootmenu.js";
import type { CSSProperties } from "react";
import { useAssetResolver } from "@/asset_context.js";
import { parseGrubFont } from "@/helper.js";

const BACKGROUND_SIZES: Record<string, string> = {
  stretch: "100% 100%",
  crop: "cover",
  padding: "contain",
  fitwidth: "100% auto",
  fitheight: "auto 100%",
};
const H_ALIGN: Record<string, string> = {
  left: "left",
  center: "center",
  right: "right",
};
const V_ALIGN: Record<string, string> = {
  top: "top",
  center: "center",
  bottom: "bottom",
};

export default function GrubScreen(props: {
  theme: ThemeArray;
  osEntries: string[];
  screenSize: { width: number; height: number };
}) {
  const resolveAsset = useAssetResolver();
  const {
    desktop_image_scale_method: scaleMethod = "stretch",
    desktop_image_h_align: hAlign = "center",
    desktop_image_v_align: vAlign = "center",
  } = props.theme.globals;

  function getScreenStyle(): CSSProperties {
    const style: CSSProperties = {};
    style.position = "relative";
    style.width = props.screenSize.width;
    style.height = props.screenSize.height;
    style.minWidth = style.width;
    style.minHeight = style.height;
    style.overflow = "hidden";
    const { desktop_image: image, desktop_color: color } = props.theme.globals;
    style.backgroundColor = color || "#222";
    if (
      image &&
      (/^(https?:\/\/|\/|\.|data:)/i.test(image) ||
        /\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(image))
    ) {
      style.backgroundImage = `url(${resolveAsset(image)})`;
      style.backgroundRepeat = "no-repeat";
      style.backgroundSize = BACKGROUND_SIZES[scaleMethod] ?? "100% 100%";
      style.backgroundPositionX = H_ALIGN[hAlign] ?? "center";
      style.backgroundPositionY = V_ALIGN[vAlign] ?? "center";
    }
    return style;
  }
  return (
    <div style={getScreenStyle()}>
      <InnerScreen
        theme={props.theme}
        osEntries={props.osEntries}
        screenSize={props.screenSize}
      />
    </div>
  );
}

function InnerScreen(props: {
  theme: ThemeArray;
  osEntries: string[];
  screenSize: { width: number; height: number };
}) {
  return (
    <>
      {props.theme.globals.title_text && (
        <Title
          text={props.theme.globals.title_text}
          font={props.theme.globals.title_font}
          color={props.theme.globals.title_color}
        />
      )}
      {props.theme.components.map((component) => {
        const id = component.properties.id ?? `comp${component.order}`;
        switch (component.type.toLowerCase()) {
          case "label":
            return (
              <Label
                key={component.order}
                id={id}
                screenSize={props.screenSize}
                {...component.properties}
              />
            );
          case "image":
            return (
              <Image
                key={component.order}
                id={id}
                screenSize={props.screenSize}
                {...component.properties}
              />
            );
          case "boot_menu":
            return (
              <BootMenu
                key={component.order}
                id={id}
                elements={props.osEntries}
                screenSize={props.screenSize}
                {...component.properties}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

function Title(props: { text?: string; font?: string; color?: string }) {
  const font = parseGrubFont(props.font);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        textAlign: "center",
        color: props.color,
        fontSize: font?.size,
        fontStyle: font?.style,
        fontWeight: font?.weight,
        fontFamily: font?.family,
      }}
    >
      {props.text}
    </div>
  );
}
