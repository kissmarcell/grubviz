import { type Font, type ThemeArray, type ComponentHolder } from "@/types.js";

const DEFAULT_FONT_FAMILY = "Unifont, monospace";

/**
 * Resolves a GRUB position/size ("120", "-10", "50%", "50%-80", "50%+12.5")
 * into pixels. Returns undefined when the value is missing or invalid, so
 * half-typed input in the editor never throws during render.
 */
function resolvePosition(
  value: string | number | undefined,
  containerSize: number,
): number | undefined {
  if (value === undefined || value === "") return undefined;
  if (typeof value === "number") return value;

  const v = value.trim();

  // pixels only
  if (/^[+-]?\d+(?:\.\d+)?$/.test(v)) {
    return parseFloat(v);
  }

  // percentage or percentage ± pixels
  const match = v.match(/^(\d+(?:\.\d+)?)%(?:([+-])(\d+(?:\.\d+)?))?$/);
  if (!match || !match[1]) return undefined;

  const percent = parseFloat(match[1]) / 100;
  const sign = match[2];
  const offset = match[3] ? parseFloat(match[3]) : 0;

  let result = containerSize * percent;

  if (sign === "+") result += offset;
  if (sign === "-") result -= offset;

  return result;
}

/** Parses a plain pixel number ("36" -> 36), undefined when invalid. */
function parseNumber(value: string | number | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : Number(value.trim());
  return Number.isFinite(n) ? n : undefined;
}

function parseGrubFont(font?: string): Font | undefined {
  if (!font) return undefined;
  const parts = font.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  const parsedSize = last ? parseInt(last, 10) : NaN;
  const hasSize = Number.isFinite(parsedSize);
  if (hasSize) parts.pop();
  const style = /italic/i.test(font) ? "italic" : "normal";
  const weight = /bold/i.test(font) ? "bold" : "normal";
  const name = parts
    .filter((p) => !/^(Bold|Italic|Regular)$/i.test(p))
    .join(" ");
  const family = name
    ? `"${name}", ${DEFAULT_FONT_FAMILY}`
    : DEFAULT_FONT_FAMILY;

  return { family, style, weight, size: hasSize ? parsedSize : 16 };
}

function parseGrubTheme(text: string): ThemeArray {
  const lines = text.split(/\r?\n/);
  const theme: ThemeArray = {
    globals: {},
    components: [],
    warnings: [],
  };
  // Stack of open component blocks, so nested components are supported.
  const stack: ComponentHolder[] = [];
  let pending: ComponentHolder | null = null; // header seen, "{" not yet
  let counter = 0;

  const open = (component: ComponentHolder) => {
    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(component);
    else theme.components.push(component);
    stack.push(component);
  };

  lines.forEach((raw, lineIndex) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return; // skip empty lines and comments

    if (line.startsWith("+")) {
      // Start of a component block, "{" may be on the same or the next line
      const header = line.slice(1).replace("{", "").trim();
      pending = {
        type: header,
        order: counter++,
        properties: {},
        children: [],
      };
      if (line.includes("{")) {
        open(pending);
        pending = null;
      }
    } else if (line === "{" && pending) {
      open(pending);
      pending = null;
    } else if (line === "}") {
      // End of component block
      stack.pop();
    } else {
      // property line
      const match = line.match(/^([a-zA-Z0-9_-]+)\s*[=:]\s*(.+)$/);
      if (match && match[1] && match[2]) {
        const key = match[1].trim().replaceAll("-", "_");
        let value = match[2].trim();

        // remove quotes if present, otherwise drop a trailing comment
        if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else {
          value = value.replace(/\s+#.*$/, "");
        }

        const current = stack[stack.length - 1];
        if (current) {
          current.properties[key] = value;
        } else {
          (theme.globals as Record<string, string>)[key] = value;
        }
      } else {
        theme.warnings.push(`Line ${lineIndex + 1}: cannot parse "${line}"`);
      }
    }
  });

  if (stack.length > 0) theme.warnings.push("Unclosed component block");
  return theme;
}

function calculateScreenSize(value: string | undefined) {
  if (!value) return { width: 0, height: 0 };
  const [width, height] = value.split("x").map(Number);
  return { width: width ?? 0, height: height ?? 0 };
}

export {
  resolvePosition,
  parseNumber,
  parseGrubFont,
  parseGrubTheme,
  calculateScreenSize,
};
