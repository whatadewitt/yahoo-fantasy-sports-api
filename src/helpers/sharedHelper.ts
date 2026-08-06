export function yahooArray(collection: any): any[] {
  const count = collection.count || 0;
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push(collection[i]);
  }

  return items;
}

export function mergeObjects(arrayOfObjects: any[]): any {
  const destinationObj: any = {};

  if (arrayOfObjects) {
    arrayOfObjects.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        if (typeof key !== "undefined") {
          destinationObj[key] = obj[key];
        }
      });
    });
  }

  return destinationObj;
}

export function mapDraft(d: any): any[] {
  if (!d) return d;

  const draft = Object.values(d);

  return draft.reduce((result: any[], d: any) => {
    if (d.draft_result) {
      result.push(d.draft_result);
    }
    return result;
  }, []);
}
