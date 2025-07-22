module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
    // 'next/core-web-vitals',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': 'off',
  },
  globals: {
    WxLogin: 'readonly',
  },
}
