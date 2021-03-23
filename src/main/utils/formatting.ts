export const cleanify = (params: { [index: string]: any }) => {

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (params[key] === undefined) {
        delete params[key];
      }
    }
  }

  return params;

};
