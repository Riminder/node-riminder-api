import "./defaults";
import { httpRequest } from "./http";
import defaults from "./defaults";

export const create = (object: string, data: any) => {
  let url = `${defaults.API_URL}/${object}`;
  let body = JSON.stringify(data);
  let options = {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return httpRequest(url, options);
};

export const getOne = (object: string, id: string) => {
  let url = `${defaults.API_URL}/${object}/${id}`;
  return httpRequest(url);
};

export const getList = (object: string, options: any) => {
  let whereClause = options.where || {};
  let page = options.page;
  let itemsPerPage = options.itemsPerPage;
  let urlParams = generateURLParams(whereClause, page, itemsPerPage);
  let url = `${defaults.API_URL}/${object}${urlParams ? `?${urlParams}` : ""}`;
  return httpRequest(url);
};

export const generateURLParams = (whereClause: any, page?: number, itemsPerPage?: number, sort?: string) => {
  let keys = Object.keys(whereClause);
  let URLParams = "";
  for (let key of keys) {
    URLParams = `${URLParams}&${key}=${whereClause[key]}`;
  }
  URLParams = `${URLParams}${page ? `&page=${page}` : ""}${itemsPerPage ? `&limit=${itemsPerPage}` : ""}${sort ? `&sort_by=${sort}` : ""}`;
  return URLParams.slice(1);
};