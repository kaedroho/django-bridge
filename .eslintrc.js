module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./packages/react/tsconfig.json"],
  },
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: [".eslintrc.js"],
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript",
    "prettier",
  ],
  rules: {
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
      },
    ],
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "react/jsx-props-no-spreading": "off",
    // We don't use prop types
    "react/require-default-props": "off",
    // By default, this rule also forbids quote characters which aren't very harmful
    "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
  },
};
