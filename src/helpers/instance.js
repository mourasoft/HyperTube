import axios from "axios";
const config = require("../constants/config");

const { host, img } = config;

export function getInstance(token) {
  return axios.create({
    baseURL: `${host}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const Instance = axios.create({
  baseURL: `${host}`,
});

export const imgUrl = img;

export const ApiAllMovie = axios.create({
  baseURL: `https://yts.mx/api/v2/list_movies.json`,
});

export const BackupAllMovie = axios.create({
  baseURL: `https://yts.megaproxy.biz/api/v2/list_movies.json`,
});
