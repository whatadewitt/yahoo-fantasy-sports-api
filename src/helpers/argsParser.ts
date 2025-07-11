// Args parser helper functions

export function extractCallback(args: any[]): Function | undefined {
  // Find the last function in the arguments
  for (let i = args.length - 1; i >= 0; i--) {
    if (typeof args[i] === 'function') {
      return args.splice(i, 1)[0];
    }
  }
  // Return undefined if no callback found
  return undefined;
}