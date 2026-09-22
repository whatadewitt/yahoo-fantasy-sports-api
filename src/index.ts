import YahooFantasy from './YahooFantasy.js';

// Export the main class as default
export default YahooFantasy;

export * as Collections from './collections/index.js';
// Export resource and collection classes
export * as Resources from './resources/index.js';
// Export all types
export * from './types/index.js';
// Named export for convenience
export { YahooFantasy };
