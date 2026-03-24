import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:5001/api";

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

