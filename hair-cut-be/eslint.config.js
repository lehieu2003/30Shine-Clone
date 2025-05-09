import js from "@eslint/js";
import nodePlugin from "eslint-plugin-node";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";
import securityPlugin from "eslint-plugin-security";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      js,
      node: nodePlugin,
      import: importPlugin,
      promise: promisePlugin,
      security: securityPlugin,
      prettier: prettierPlugin,
    },
    extends: [
      "eslint:recommended",
      "plugin:node/recommended",
      "plugin:import/recommended",
      "plugin:promise/recommended",
      "plugin:security/recommended",
      "plugin:prettier/recommended",
    ],
    rules: {
      "prettier/prettier": "warn",
      "no-console": "off", // Cho phép console.log
      "node/no-unsupported-features/es-syntax": "off", // Cho phép import/export
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
]);
