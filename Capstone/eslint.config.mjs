import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
  {
    rules: {
      "@next/next/no-img-element": "warn",
      "@next/next/no-page-custom-font": "warn",
    },
  },
];

export default eslintConfig;
