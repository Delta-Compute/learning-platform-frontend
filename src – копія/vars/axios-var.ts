import axios from "axios";

export const mainPath = import.meta.env.VITE_BACKEND_MAIN_PATH;

export const apiClient = axios.create({
  baseURL: mainPath,
});