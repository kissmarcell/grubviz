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
  terminal_left?: string;
  terminal_top?: string;
  terminal_width?: string;
  terminal_height?: string;
};

type CommonParams = {
  /** raw GRUB values: "480", "30%", "50%-80" */
  left?: number | string;
  top?: number | string;
  width?: number | string;
  height?: number | string;
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
  warnings: string[];
};

type ComponentHolder = {
  type: string;
  order: number;
  properties: { [key: string]: string };
  children: ComponentHolder[];
};

export {
  type CommonParams,
  type Font,
  type ComponentHolder,
  type ThemeArray,
  type Globals,
};
