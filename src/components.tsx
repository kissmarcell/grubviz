class Global {
  title_text: string;
  title_font: string;
  title_color: string;
  /** unused */
  message_font: string;
  /** unused */
  message_color: string;
  /** unused */
  message_bg_color: string;
  desktop_image: string;
  desktop_image_scale_method:
    | "stretch"
    | "crop"
    | "padding"
    | "fitwidth"
    | "fitheight";
  desktop_image_h_align: "left" | "center" | "right";
  desktop_image_v_align: "top" | "center" | "bottom";
  desktop_color: string;
  terminal_box: string;
  terminal_border: string;
  terminal_left: number;
  terminal_top: number;
  terminal_width: number;
  terminal_height: number;
  constructor(props: {
    title_text: string;
    title_font: string;
    title_color: string;
    message_font: string;
    message_color: string;
    message_bg_color: string;
    desktop_image: string;
    desktop_image_scale_method:
      | "stretch"
      | "crop"
      | "padding"
      | "fitwidth"
      | "fitheight";
    desktop_image_h_align: "left" | "center" | "right";
    desktop_image_v_align: "top" | "center" | "bottom";
    desktop_color: string;
    terminal_box: string;
    terminal_border: string;
    terminal_left: number;
    terminal_top: number;
    terminal_width: number;
    terminal_height: number;
  }) {
    this.title_text = props.title_text;
    this.title_font = props.title_font;
    this.title_color = props.title_color;
    this.message_font = props.message_font;
    this.message_color = props.message_color;
    this.message_bg_color = props.message_bg_color;
    this.desktop_image = props.desktop_image;
    this.desktop_image_scale_method = props.desktop_image_scale_method;
    this.desktop_image_h_align = props.desktop_image_h_align;
    this.desktop_image_v_align = props.desktop_image_v_align;
    this.desktop_color = props.desktop_color;
    this.terminal_box = props.terminal_box;
    this.terminal_border = props.terminal_border;
    this.terminal_left = props.terminal_left;
    this.terminal_top = props.terminal_top;
    this.terminal_width = props.terminal_width;
    this.terminal_height = props.terminal_height;
  }
}

export { Global };
