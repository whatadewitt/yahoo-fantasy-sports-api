export function parseResourceArgs(args) {
  if (args.length) {
    // if there's no dash and it's not a number they are here for sub-resources
    let dateType = "season";
    let date = "";
    let resource = "";

    const arg = args.shift();
    if (!isNaN(parseInt(arg, 10)) || arg.indexOf("-") !== -1) {
      // this is the date
      date = arg;
      if (date.indexOf("-") > 0) {
        // string is date, of format y-m-d
        dateType = "date";
      } else {
        // number is week...
        dateType = "week";
      }

      if (args.length) {
        resource = args.pop();
      }
    } else {
      resource = arg;
    }

    return [date, dateType, resource];
  }

  return [null, null, null];
}
