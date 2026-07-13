module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.config.js', 'landing/**/*.js', 'landing/**/*.jsx'],
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  ],
};
