module.exports = {
  extends: 'universe/native',
  env: { node: true },
  rules: {
    'react-native/no-inline-styles': 0,
    'import/namespace': 0,
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'react/jsx-no-undef': 'error'
  }
};
