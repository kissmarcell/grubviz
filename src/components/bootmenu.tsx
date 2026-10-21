import { type CommonParams, type Font } from "@/types.js";
import { parseGrubFont, parseNumber, resolvePosition } from "@/helper.js";
import { useAssetResolver } from "@/asset_context.js";
import { useEffect, useState, type ReactNode } from "react";

const SLICE_ROWS = [
  ["nw", "n", "ne"],
  ["w", "c", "e"],
  ["sw", "s", "se"],
] as const;

type Size = { width: number; height: number };

/** Natural size of an image, undefined until it has loaded. */
function useImageSize(url: string | undefined): Size | undefined {
  const [size, setSize] = useState<{ url: string; size: Size }>();
  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.onload = () =>
      setSize({
        url,
        size: { width: img.naturalWidth, height: img.naturalHeight },
      });
    img.src = url;
  }, [url]);
  return size && size.url === url ? size.size : undefined;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export default function BootMenu(
  props: CommonParams & {
    elements: string[];
    item_font?: string;
    selected_item_font?: string;
    item_color?: string;
    selected_item_color?: string;
    icon_width?: string;
    icon_height?: string;
    item_height?: string;
    item_padding?: string;
    item_icon_space?: string;
    item_spacing?: string;
    menu_pixmap_style?: string;
    item_pixmap_style?: string;
    selected_item_pixmap_style?: string;
    scrollbar?: string;
    scrollbar_frame?: string;
    scrollbar_thumb?: string;
    scrollbar_thumb_overlay?: string;
    scrollbar_slice?: string;
    scrollbar_left_pad?: string;
    scrollbar_right_pad?: string;
    scrollbar_top_pad?: string;
    scrollbar_bottom_pad?: string;
    visible?: string;
  },
) {
  const font = parseGrubFont(props.item_font);
  const selectedFont = parseGrubFont(
    props.selected_item_font ?? props.item_font,
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const count = props.elements.length;
  // keep the selection valid when the entry list shrinks
  const activeIndex = count > 0 ? Math.min(selectedIndex, count - 1) : 0;

  useEffect(() => {
    if (count === 0) return;
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "ArrowDown") {
        setSelectedIndex((i) => (Math.min(i, count - 1) + 1) % count);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((i) => (Math.min(i, count - 1) - 1 + count) % count);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [count]);

  const itemHeight = parseNumber(props.item_height);
  const itemPadding = parseNumber(props.item_padding);
  const itemSpacing = parseNumber(props.item_spacing) ?? 0;
  // GRUB starts the text after the icon column: the icon itself (when icons
  // are enabled by a non-zero icon size) plus item_icon_space
  const iconWidth = parseNumber(props.icon_width) ?? 0;
  const iconHeight = parseNumber(props.icon_height) ?? 0;
  const textOffset =
    (iconWidth > 0 && iconHeight > 0 ? iconWidth : 0) +
    (parseNumber(props.item_icon_space) ?? 0);

  return (
    <div
      id={props.id}
      style={{
        position: "absolute",
        left: resolvePosition(props.left ?? 0, props.screenSize.width),
        top: resolvePosition(props.top ?? 0, props.screenSize.height),
        width: resolvePosition(props.width, props.screenSize.width),
        height: resolvePosition(props.height, props.screenSize.height),
        display: props.visible !== "false" ? "block" : "none",
      }}
    >
      {props.elements.map((itemText, index) => {
        const selected = index === activeIndex;
        return (
          <BootMenuItem
            key={index}
            color={selected ? props.selected_item_color : props.item_color}
            height={itemHeight}
            padding={itemPadding}
            spacing={itemSpacing}
            textOffset={textOffset}
            font={selected ? selectedFont : font}
            pixmapStyle={
              selected
                ? props.selected_item_pixmap_style
                : props.item_pixmap_style
            }
          >
            {itemText}
          </BootMenuItem>
        );
      })}
    </div>
  );
}

type Insets = { left: number; top: number; right: number; bottom: number };

/** Border sizes of a pixmap style, taken from its edge images like in GRUB. */
function usePixmapInsets(pixmapStyle: string | undefined): Insets {
  const resolveAsset = useAssetResolver();
  const url = (position: string) =>
    pixmapStyle ? resolveAsset(pixmapStyle.replace("*", position)) : undefined;
  const w = useImageSize(url("w"));
  const n = useImageSize(url("n"));
  const e = useImageSize(url("e"));
  const s = useImageSize(url("s"));
  return {
    left: w?.width ?? 0,
    top: n?.height ?? 0,
    right: e?.width ?? 0,
    bottom: s?.height ?? 0,
  };
}

function BootMenuItem(props: {
  children: ReactNode;
  color?: string;
  height?: number;
  padding?: number;
  spacing: number;
  textOffset: number;
  font?: Font;
  pixmapStyle?: string;
}) {
  const insets = usePixmapInsets(props.pixmapStyle);
  const contentHeight = props.height ?? 0;
  // like GRUB: the pixmap borders are added around the item content, rows
  // are still item_height + item_spacing apart
  const frameHeight = contentHeight + insets.top + insets.bottom;
  return (
    <div
      style={{
        position: "relative",
        height: contentHeight + props.spacing,
        color: props.color,
        fontSize: props.font?.size,
        fontStyle: props.font?.style,
        fontWeight: props.font?.weight,
        fontFamily: props.font?.family,
      }}
    >
      {props.pixmapStyle && (
        <BootMenuItemFrame
          pixmapStyle={props.pixmapStyle}
          insets={insets}
          height={frameHeight}
        />
      )}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          left: insets.left + props.textOffset,
          top: insets.top,
          right: insets.right,
          height: contentHeight,
          boxSizing: "border-box",
          padding: props.padding,
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

/** 3x3 frame built from the "*"-templated slice images (nw, n, ne, ...). */
function BootMenuItemFrame(props: {
  pixmapStyle: string;
  insets: Insets;
  height: number;
}) {
  const resolveAsset = useAssetResolver();
  const url = (position: string) =>
    resolveAsset(props.pixmapStyle.replace("*", position));
  const { left, top, right, bottom } = props.insets;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        height: props.height,
        display: "grid",
        gridTemplateColumns: `${left}px 1fr ${right}px`,
        gridTemplateRows: `${top}px 1fr ${bottom}px`,
        zIndex: 0,
      }}
    >
      {SLICE_ROWS.flat().map((position) => (
        <div
          key={position}
          style={{
            backgroundImage: `url(${url(position)})`,
            backgroundSize: "100% 100%",
          }}
        />
      ))}
    </div>
  );
}
