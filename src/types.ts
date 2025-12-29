import { Global } from "./components.js";
import Image from "./components/image.js";
import Label from "./components/label.js";

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
  globals: { [key: string]: any };
  components: ComponentHolder[];
};

type ComponentHolder = {
  type: string;
  order: number;
  properties: { [key: string]: string };
};

type Theme = {
  globals: Global;
  components: Component[];
};

type Component = typeof Label | typeof Image;

export {
  type CommonParams,
  type Font,
  type Theme,
  type ComponentHolder,
  type Component,
  type ThemeArray,
};
