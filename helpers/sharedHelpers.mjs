export function mergeObjects(arrayOfObjects) {
  const destinationObj = {};

  if (arrayOfObjects) {
    arrayOfObjects.forEach(obj => {
      Object.keys(obj).forEach(key => {
        if ("undefined" != typeof key) {
          destinationObj[key] = obj[key];
        }
      });
    });
  }

  return destinationObj;
}

export function flattenObject(obj) {
  let toReturn = {};

  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue;

    if (typeof obj[i] === "object") {
      let flatObject = flattenObject(obj[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = obj[i];
    }
  }

  return toReturn;
}
