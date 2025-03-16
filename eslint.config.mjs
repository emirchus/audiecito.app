import { dirname } from "path";
import { fileURLToPath } from "url";

import globals from "globals";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactCompiler from "eslint-plugin-react-compiler";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
// import eslintPluginImport from "eslint-plugin-import";
import vercelStyleGuideReact from "@vercel/style-guide/eslint/rules/react";
import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  { ignores: ["node_modules", ".next", "out", "coverage", ".idea"] },

  // Compat extensions
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Language options and globals
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.serviceworker },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      // react: fixupPluginRules(eslintPluginReact),
      // "react-hooks": fixupPluginRules(eslintPluginReactHooks),
      "react-compiler": fixupPluginRules(eslintPluginReactCompiler),
      // "jsx-a11y": fixupPluginRules(eslintPluginJsxA11y),
      // import: fixupPluginRules(eslintPluginImport),
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...vercelStyleGuideReact.rules,

      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": [
        "warn",
        { callbacksLast: true, shorthandFirst: true, reservedFirst: true },
      ],
      "react-compiler/react-compiler": "error",
      "react/jsx-no-leaked-render": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",

      "import/no-default-export": "off",
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [{ pattern: "~/**", group: "external", position: "after" }],
          "newlines-between": "always",
        },
      ],
    },
  },

  // Custom rules
  {
    rules: {
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: ["return", "export"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info", "debug"],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_.*?$",
          varsIgnorePattern: "^_.*?$",
          caughtErrorsIgnorePattern: "^_.*?$",
          destructuredArrayIgnorePattern: "^_.*?$",
        },
      ],
    },
  },

  // Prettier Recommended
  eslintPluginPrettierRecommended,

  // Custom Prettier Rules
  {
    rules: {
      "prettier/prettier": [
        "warn",
        {
          printWidth: 100,
          trailingComma: "all",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
          arrowParens: "always",
          endOfLine: "auto",
          plugins: ["prettier-plugin-tailwindcss"],
        },
      ],
    },
  },
];

export default config;
