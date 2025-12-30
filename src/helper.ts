import { type Font, type ThemeArray, type ComponentHolder } from "@/types.js";

function resolvePosition(
  value: string | number,
  containerSize: number,
): number {
  if (typeof value === "number") return value;

  const v = value.trim();

  // pixels only
  if (/^\d+$/.test(v)) {
    return parseInt(v, 10);
  }

  // percentage or percentage ± pixels
  const match = v.match(/^(\d+(?:\.\d+)?)%(?:([+-])(\d+))?$/);
  if (!match || !match[1]) {
    throw new Error(`Invalid GRUB position value: ${value}`);
  }

  const percent = parseFloat(match[1]) / 100;
  const sign = match[2];
  const offset = match[3] ? parseInt(match[3], 10) : 0;

  let result = containerSize * percent;

  if (sign === "+") result += offset;
  if (sign === "-") result -= offset;

  return result;
}

function parseGrubFont(font: string): Font {
  const parts = font.split(" ");
  const size = parseInt(parts.pop()!, 10);
  const style = /italic/i.test(font) ? "italic" : "normal";
  const weight = /bold/i.test(font) ? "bold" : "normal";
  const family = parts.filter((p) => !/Bold|Italic|Regular/i.test(p)).join(" ");

  return { family, style, weight, size };
}

function parseGrubTheme(text: string): ThemeArray {
  const lines = text.split("\n");
  const theme: ThemeArray = {
    globals: {},
    components: [],
  };
  let currentComponent: ComponentHolder | null = null;
  let counter = 0;

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue; // skip empty lines and comments

    if (line.startsWith("+")) {
      // Start of a component block
      currentComponent = {
        type: line.replace("{", "").slice(1).trim(),
        order: counter++,
        properties: {},
      };
      theme.components.push(currentComponent);
    } else if (line === "}") {
      // End of component block
      currentComponent = null;
    } else {
      // property line
      const match = line.match(/^([a-zA-Z0-9_-]+)\s*[=:]\s*(.+)$/);
      if (match && match[1] && match[2]) {
        const key = match[1].trim().replace("-", "_");
        let value = match[2].trim();

        // remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        if (currentComponent) {
          currentComponent.properties[key] = value;
        } else {
          theme.globals[key] = value;
        }
      }
    }
  }
  return theme;
}

function calculateScreenSize(value: string | undefined) {
  if (!value) return { width: 0, height: 0 };
  const [width, height] = value.split("x").map(Number);
  return { width: width ?? 0, height: height ?? 0 };
}

export { resolvePosition, parseGrubFont, parseGrubTheme, calculateScreenSize };
