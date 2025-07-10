// Backwards compatibility wrapper for TypeScript migration
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const YahooFantasy = require('./dist/cjs/YahooFantasy.js').default;
export default YahooFantasy;