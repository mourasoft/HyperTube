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
