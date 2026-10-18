import { type ThemeArray } from "@/types.js";
import Label from "@/components/label.js";
import Image from "@/components/image.js";
import BootMenu from "@/components/bootmenu.js";
import type { CSSProperties } from "react";
import { parseGrubFont } from "@/helper.js";

export default function GrubScreen(props: {
  theme: ThemeArray;
  osEntries: string[];
  screenSize: { width: number; height: number };
}) {
  function getScreenStyle(): CSSProperties {
    const style: CSSProperties = {};
    style.position = "relative";
    style.width = props.screenSize.width;
    style.height = props.screenSize.height;
    style.minWidth = style.width;
    style.minHeight = style.height;
    if (
      props.theme.globals.desktop_image &&
      (/^(https?:\/\/|\/|\.|data:)/i.test(props.theme.globals.desktop_image) ||
        props.theme.globals.desktop_image.match(
          /\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i,
        ))
    ) {
      style.backgroundImage = `url(${props.theme.globals.desktop_image})`;
      style.backgroundColor = "";
      if (props.theme.globals.desktop_image_scale_method === "stretch") {
        style.backgroundPosition = "center center";
        style.backgroundSize = "100%";
        style.backgroundRepeat = "no-repeat";
      } else {
        switch (props.theme.globals.desktop_image_h_align) {
          case "left":
            style.backgroundPositionX = "left";
            break;
          case "right":
            style.backgroundPositionX = "right";
            break;
          default:
            style.backgroundPositionX = "center";
            break;
        }
        switch (props.theme.globals.desktop_image_v_align) {
          case "top":
            style.backgroundPositionY = "top";
            break;
          case "bottom":
            style.backgroundPositionY = "bottom";
            break;
          default:
            style.backgroundPositionY = "center";
            break;
        }
      }
    } else if (props.theme.globals.desktop_color) {
      {
        style.backgroundImage = "";
        style.backgroundColor = props.theme.globals.desktop_color;
      }
    } else {
      style.backgroundImage = "";
      style.backgroundColor = "#222";
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
                key={id}
                id={id}
                screenSize={props.screenSize}
                {...component.properties}
              />
            );
          case "image":
            return (
              <Image
                key={id}
                id={id}
                screenSize={props.screenSize}
                {...component.properties}
              />
            );
          case "boot_menu":
            return (
              <BootMenu
                key={id}
                id={id}
                elements={props.osEntries}
                screenSize={props.screenSize}
                {...component.properties}
              />
            );
          default:
            return <></>;
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
