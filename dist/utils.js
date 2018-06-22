export const generateURLParams = (options) => {
    return options ? Object.keys(options).map(key => {
        if (options[key] instanceof Array) {
            return `${key}=[${options[key].map((elem) => `"${elem}"`).join(",")}]`;
        }
        return `${key}=${options[key]}`;
    }).join("&") : null;
};
//# sourceMappingURL=utils.js.map