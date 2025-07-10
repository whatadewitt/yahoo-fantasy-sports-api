/* global module, require */
// TypeScript migration: point to compiled CommonJS build
const tsExports = require("./dist/cjs/index.js");
module.exports = tsExports.default;

// TODO: league settings sample data
// TODO: transactions sample data
