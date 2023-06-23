export const invert = <T extends Record<string, string>>(obj: T): { [K in T[keyof T]]: keyof T } => {
  const invertedObj = {} as { [K in T[keyof T]]: keyof T };
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      invertedObj[obj[key]] = key as keyof T;
    }
  }
  return invertedObj;
};
