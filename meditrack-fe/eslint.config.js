// eslint.config.js (Flat Config)
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginImport from "eslint-plugin-import";

export default [
  // 1) 기본 JS 권장
  js.configs.recommended,

  // 2) React 권장(Flat용)
  {
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
      import: pluginImport,
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // 공통 룰
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // 리액트 훅 룰
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // import 정리(선택)
      "import/order": ["warn", {
        "newlines-between": "always",
        "alphabetize": { order: "asc", caseInsensitive: true },
        "groups": ["builtin", "external", "internal", ["parent", "sibling", "index"]],
      }],

      // 사용하지 않는 변수: _ 접두 허용
      "no-unused-vars": ["warn", {
        args: "after-used",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],

      // dev 환경에서만 의미 있는 경고라면 warn 정도로
      "react-refresh/only-export-components": "warn",
    },
  },

  // 3) 파일별 오버라이드
  // 컨텍스트/훅/서비스/유틸은 컴포넌트 외 export가 자연스러우므로 react-refresh 룰 해제
  {
    files: [
      "src/contexts/**/*.{js,jsx,ts,tsx}",
      "src/hooks/**/*.{js,jsx,ts,tsx}",
      "src/services/**/*.{js,jsx,ts,tsx}",
      "src/utils/**/*.{js,jsx,ts,tsx}",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // 페이지/컴포넌트는 그대로 적용
  {
    files: ["src/components/**/*.{js,jsx,ts,tsx}", "src/pages/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },

  // 4) 환경별/테스트 오버라이드(필요 시)
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      "no-unused-expressions": "off",
    },
  },

  // 5) 무시할 파일
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "**/vite-env.d.ts",
    ],
  },
];
