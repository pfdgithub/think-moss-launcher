import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
import ts from "typescript-eslint";
import eslint from "@eslint/js";

export default [
  {
    ignores: [".github/**", "dist/**", ".vite/**", "out/**"],
  },
  eslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  hooks.configs["recommended-latest"],
  ...ts.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/README.md#configuring-shared-settings
      react: {
        version: "detect",
      },
    },
    plugins: {},
    rules: {
      "no-debugger": ["warn"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-empty": ["off"],
      "react-hooks/exhaustive-deps": ["error"],
      "@typescript-eslint/ban-ts-comment": ["off"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-empty-object-type": ["off"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowTernary: true,
          allowShortCircuit: true,
        },
      ],
    },
  },
];
