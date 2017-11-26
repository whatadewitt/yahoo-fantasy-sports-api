export const mergeObjects = arrayOfObjects => {
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
};
