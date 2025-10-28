import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import ts from "typescript-eslint";

export default [
  eslintPluginPrettierRecommended,
  ...ts.configs.recommended,
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "src/components/ui/**"],
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      // Base rules
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "prettier/prettier": ["error", { printWidth: 120, semi: true, endOfLine: "lf" }],

      // TypeScript specific rules
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],

      // React Hooks rules (essential)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Core React rules (simplified)
      "react/prop-types": "off", // Not needed with TypeScript
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/jsx-boolean-value": ["error", "never"],
      "react/self-closing-comp": ["error", { component: true, html: true }],

      // Basic accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-role": "error",

      // Import organization
      "import/order": [
        "error",
        {
          groups: [["builtin", "external"], "internal", "type", ["parent", "sibling"], "index", "object"],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "react-dom", group: "builtin", position: "before" },
            { pattern: "@/store/**", group: "internal", position: "before" },
            { pattern: "@/hooks/**", group: "internal", position: "before" },
            { pattern: "@/context/**", group: "internal", position: "before" },
            { pattern: "@/api/**", group: "internal", position: "before" },
            { pattern: "@/utils/**", group: "internal", position: "before" },
            { pattern: "@/components/**", group: "internal", position: "before" },
            { pattern: "@/types/**", group: "type", position: "before" },
            { pattern: "*.css", group: "object", position: "after" },
            { pattern: "*.scss", group: "object", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "type"],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],
      "import/no-duplicates": "error",
    },
  },
  // {
  //     files: ["*.tsx", "**/*.tsx"],
  //     languageOptions: {
  //         parser: ts.parser,
  //     },
  // },
  // {
  //     files: ["*.ts", "**/*.ts"],
  //     languageOptions: {
  //         parser: ts.parser,
  //     },
  // },
];
