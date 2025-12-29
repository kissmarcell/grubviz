class BootMenu2 {
  elements: string[];
  selected_index: number = 0;
  children: HTMLElement[] = [];
  item_font: Font;
  selected_item_font: Font;
  item_color: string;
  selected_item_color: string;
  icon_width: number;
  icon_height: number;
  item_height: number;
  item_padding: number;
  item_icon_space: number;
  item_spacing: number;
  menu_pixmap_style: string;
  item_pixmap_style: string;
  selected_item_pixmap_style: string;
  scrollbar: string;
  scrollbar_frame: string;
  scrollbar_thumb: string;
  scrollbar_thumb_overlay: string;
  scrollbar_slice: number;
  scrollbar_left_pad: number;
  scrollbar_right_pad: number;
  scrollbar_top_pad: number;
  scrollbar_bottom_pad: number;
  visible: boolean;

  constructor(
    props: CommonParams & {
      elements: string[];
      item_font: string;
      selected_item_font: string;
      item_color: string;
      selected_item_color: string;
      icon_width: number;
      icon_height: number;
      item_height: number;
      item_padding: number;
      item_icon_space: number;
      item_spacing: number;
      menu_pixmap_style: string;
      item_pixmap_style: string;
      selected_item_pixmap_style: string;
      scrollbar: string;
      scrollbar_frame: string;
      scrollbar_thumb: string;
      scrollbar_thumb_overlay: string;
      scrollbar_slice: number;
      scrollbar_left_pad: number;
      scrollbar_right_pad: number;
      scrollbar_top_pad: number;
      scrollbar_bottom_pad: number;
      visible: string;
    },
  ) {
    this.elements = props.elements;
    this.item_font = props.item_font
      ? parseGrubFont(props.item_font)
      : DefaultFont;
    this.selected_item_font = props.selected_item_font
      ? parseGrubFont(props.selected_item_font)
      : DefaultFont;
    this.item_color = props.item_color;
    this.selected_item_color = props.selected_item_color;
    this.icon_width = props.icon_width;
    this.icon_height = props.icon_height;
    this.item_height = props.item_height;
    this.item_padding = props.item_padding;
    this.item_icon_space = props.item_icon_space;
    this.item_spacing = props.item_spacing;
    this.menu_pixmap_style = props.menu_pixmap_style;
    this.item_pixmap_style = props.item_pixmap_style;
    this.selected_item_pixmap_style = props.selected_item_pixmap_style;
    this.scrollbar = props.scrollbar;
    this.scrollbar_frame = props.scrollbar_frame;
    this.scrollbar_thumb = props.scrollbar_thumb;
    this.scrollbar_thumb_overlay = props.scrollbar_thumb_overlay;
    this.scrollbar_slice = props.scrollbar_slice;
    this.scrollbar_left_pad = props.scrollbar_left_pad;
    this.scrollbar_right_pad = props.scrollbar_right_pad;
    this.scrollbar_top_pad = props.scrollbar_top_pad;
    this.scrollbar_bottom_pad = props.scrollbar_bottom_pad;
    this.visible = props.visible !== "false";
  }

  createRow() {
    var row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    row.style.zIndex = "0";
    return row;
  }

  getNumberOfChildren() {
    return this.children.length;
  }

  setSelectedIndex(index: number) {
    this.selected_index = index;
    this.children.forEach((it, i) => {
      if (i === this.selected_index) {
        it.style.color = this.selected_item_color;
        it.style.fontSize = this.selected_item_font.size + "px";
        it.style.fontStyle = this.selected_item_font.style;
        it.style.fontWeight = this.selected_item_font.weight;
      } else {
        it.style.color = this.item_color;
        it.style.fontSize = this.item_font.size + "px";
        it.style.fontStyle = this.item_font.style;
        it.style.fontWeight = this.item_font.weight;
      }
    });
  }

  createSlice(
    parent: HTMLElement,
    position: string,
    width: number,
    height: number,
  ) {
    const src = this.item_pixmap_style.replace("*", position);
    const div = document.createElement("div");
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.backgroundImage = `url(${src})`;
    div.style.backgroundSize = "100% 100%";
    parent.appendChild(div);
    return div;
  }

  render(parent: HTMLElement): void {
    var div = document.createElement("div");
    div.id = this.id;
    div.style.left = resolvePosition(this.left, parent.offsetWidth) + "px";
    div.style.top = resolvePosition(this.top, parent.offsetHeight) + "px";
    div.style.width = this.width + "px";
    div.style.height = this.height + "px";
    div.style.position = "absolute";
    div.style.display = this.visible ? "block" : "none";

    this.elements.forEach((itemText, index) => {
      var itemDiv = document.createElement("div");
      itemDiv.style.color = this.item_color;
      itemDiv.style.height = this.item_height + "px";
      itemDiv.style.padding = this.item_padding + "px";
      itemDiv.style.boxSizing = "border-box";
      itemDiv.style.position = "relative";

      if (this.item_pixmap_style) {
        const cornerSize = 16;
        const edgeWidth = 16;
        const edgeHeight = 16;

        const w = this.width;
        const h = this.item_height;

        var top = this.createRow();
        var mid = this.createRow();
        var bottom = this.createRow();
        var text = document.createElement("div");
        text.style.position = "absolute";
        text.style.left = edgeHeight + "px";
        text.style.top = 0 + "px";
        text.style.fontSize = this.item_font.size + "px";
        text.style.fontStyle = this.item_font.style;
        text.style.fontWeight = this.item_font.weight;
        text.style.zIndex = "1";
        text.textContent = itemText;

        this.createSlice(top, "nw", cornerSize, cornerSize);
        this.createSlice(top, "n", w - 2 * cornerSize, edgeHeight);
        this.createSlice(top, "ne", cornerSize, cornerSize);

        this.createSlice(mid, "w", edgeWidth, h - 2 * cornerSize);
        this.createSlice(mid, "c", w - 2 * cornerSize, h - 2 * edgeHeight);
        this.createSlice(mid, "e", edgeWidth, h - 2 * cornerSize);

        this.createSlice(bottom, "sw", cornerSize, cornerSize);
        this.createSlice(bottom, "s", w - 2 * cornerSize, edgeHeight);
        this.createSlice(bottom, "se", cornerSize, cornerSize);

        itemDiv.appendChild(top);
        itemDiv.appendChild(mid);
        itemDiv.appendChild(bottom);
        itemDiv.appendChild(text);
      } else {
        itemDiv.style.fontSize = this.item_font.size + "px";
        itemDiv.style.fontStyle = this.item_font.style;
        itemDiv.style.fontWeight = this.item_font.weight;
        itemDiv.textContent = itemText;
        itemDiv.style.zIndex = "1";
      }

      div.appendChild(itemDiv);
      this.children.push(itemDiv);
    });
    parent.appendChild(div);
  }
}

import { type CommonParams, type Font } from "@/types.js";
import { parseGrubFont, resolvePosition } from "@/helper.js";
import { DefaultFont } from "@/default.js";
import { useEffect, useState, type ReactNode } from "react";

export default function BootMenu(
  props: CommonParams & {
    elements: string[];
    item_font?: string;
    selected_item_font?: string;
    item_color?: string;
    selected_item_color?: string;
    icon_width?: number;
    icon_height?: number;
    item_height?: number;
    item_padding?: number;
    item_icon_space?: number;
    item_spacing?: number;
    menu_pixmap_style?: string;
    item_pixmap_style?: string;
    selected_item_pixmap_style?: string;
    scrollbar?: string;
    scrollbar_frame?: string;
    scrollbar_thumb?: string;
    scrollbar_thumb_overlay?: string;
    scrollbar_slice?: number;
    scrollbar_left_pad?: number;
    scrollbar_right_pad?: number;
    scrollbar_top_pad?: number;
    scrollbar_bottom_pad?: number;
    visible?: string;
  },
) {
  const font = props.item_font ? parseGrubFont(props.item_font) : DefaultFont;
  const selectedFont = props.selected_item_font
    ? parseGrubFont(props.selected_item_font)
    : DefaultFont;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % props.elements.length);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSelectedIndex(
          (i) => (i - 1 + props.elements.length) % props.elements.length,
        );
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [props.elements.length]);

  return (
    <div
      id={props.id}
      style={{
        position: "absolute",
        left: resolvePosition(props.left ?? 0, props.screenSize.width),
        top: resolvePosition(props.top ?? 0, props.screenSize.height),
        width: props.width,
        height: props.height,
        display: props.visible !== "false" ? "block" : "none",
      }}
    >
      {props.elements.map((itemText, index) => {
        return (
          <BootMenuItem
            key={index}
            color={props.item_color}
            height={props.item_height}
            padding={props.item_padding}
            font={index === selectedIndex ? selectedFont : font}
            pixmapStyle={
              index === selectedIndex
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

function BootMenuItem(props: {
  children: ReactNode;
  color?: string;
  height?: number;
  padding?: number;
  font?: Font;
  pixmapStyle?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        boxSizing: "border-box",
        color: props.color,
        height: props.height,
        padding: props.padding,
        fontSize: props.font?.size,
        fontStyle: props.font?.style,
        fontWeight: props.font?.weight,
      }}
    >
      {props.pixmapStyle ? (
        <>
          <BootMenuItemRow position="top" pixmapStyle={props.pixmapStyle} />
          <BootMenuItemRow position="middle" pixmapStyle={props.pixmapStyle} />
          <BootMenuItemRow position="bottom" pixmapStyle={props.pixmapStyle} />
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 0,
              zIndex: "1",
              fontSize: props.font?.size,
              fontStyle: props.font?.style,
              fontWeight: props.font?.weight,
            }}
          >
            {props.children}
          </div>
        </>
      ) : (
        props.children
      )}
    </div>
  );
}

function BootMenuItemRow(props: { position: string; pixmapStyle: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        zIndex: "0",
      }}
    >
      <BootMenuItemSlice
        position={props.position}
        width={16}
        height={16}
        src={props.pixmapStyle!}
      />
      <BootMenuItemSlice
        position={props.position}
        width={props.width - 32}
        height={16}
        src={props.pixmapStyle!}
      />
      <BootMenuItemSlice
        position={props.position}
        width={16}
        height={16}
        src={props.pixmapStyle!}
      />
    </div>
  );
}

function BootMenuItemSlice(props: {
  position: string;
  width: number;
  height: number;
  src: string;
}) {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        backgroundImage: `url(${props.src.replace("*", props.position)})`,
        backgroundSize: "100% 100%",
      }}
    ></div>
  );
}
