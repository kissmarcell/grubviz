type Globals = {
  title_text?: string;
  title_font?: string;
  title_color?: string;
  /** unused */
  message_font?: string;
  /** unused */
  message_color?: string;
  /** unused */
  message_bg_color?: string;
  desktop_image?: string;
  desktop_image_scale_method?:
    | "stretch"
    | "crop"
    | "padding"
    | "fitwidth"
    | "fitheight";
  desktop_image_h_align?: "left" | "center" | "right";
  desktop_image_v_align?: "top" | "center" | "bottom";
  desktop_color?: string;
  terminal_box?: string;
  terminal_border?: string;
  terminal_left?: number;
  terminal_top?: number;
  terminal_width?: number;
  terminal_height?: number;
};

type CommonParams = {
  left?: number | string;
  top?: number | string;
  width?: number;
  height?: number;
  screenSize: { width: number; height: number };
  id: string;
};

type Font = {
  family: string;
  style: string;
  weight: string;
  size: number;
};

type ThemeArray = {
  globals: Globals;
  components: ComponentHolder[];
};

type ComponentHolder = {
  type: string;
  order: number;
  properties: { [key: string]: string };
};

export {
  type CommonParams,
  type Font,
  type ComponentHolder,
  type ThemeArray,
  type Globals,
};
