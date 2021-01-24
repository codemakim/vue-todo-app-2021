module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2015,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:vue/essential'
  ],
  plugins: [
    'vue'
  ],
  // 0: 취급 안함. 1: 에러표시 2: 경고표시
  rules: {
    'no-new': 0,
    'new-cap': 0
  }
}