export function extractCallback(args) {
  if (args.length && typeof args[args.length - 1] === "function") {
    return args.pop();
  }

  return () => {};
}