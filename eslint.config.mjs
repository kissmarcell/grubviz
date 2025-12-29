// @ts-check

import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  globalIgnores(["dist/", "node_modules/", "themes/"]),
  {
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: ["../*", "./*"],
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
]);
