import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import tailwind from "eslint-plugin-tailwindcss"
import nextPlugin from "@next/eslint-plugin-next"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"

export default [
  // Enable ESLint base rules
  eslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
    },
  },
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  // Enable TypeScript rules
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      "react/prop-types": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "no-redeclare": "off",
      "@typescript-eslint/no-redeclare": "warn",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
      "prefer-const": "warn",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    files: ["**/*.js"], // Add this specific config for .js files
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]
