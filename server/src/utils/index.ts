export function camelToSnake(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    const value = obj[key];
    acc[snakeKey] = camelToSnake(value);
    return acc;
  }, {});
}

export function queryParser(queryString: string, key: string) {
  const queryParams = queryString.split("&");

  return queryParams.reduce((acc, param) => {
    const [k, value] = param.split("=");

    if (k === key) {
      acc.push(value);
    }

    return acc;
  }, []);
}
