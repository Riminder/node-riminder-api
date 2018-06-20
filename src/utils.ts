export const generateURLParams = (options: any) => {
  return options ? Object.keys(options).map(key => {
    if (options[key] instanceof Array) {
      return `${key}=[${options[key].map((elem: string) => `"${elem}"`).join(",")}]`;
    }
    return `${key}=${options[key]}`;
  }).join("&") : null;
};

