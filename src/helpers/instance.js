import axios from "axios";
const config = require("../constants/config");

const { host } = config;

export function getInstance(token) {
  return axios.create({
    baseURL: `${host}`,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const Instance = axios.create({
  baseURL: `${host}`,
});
