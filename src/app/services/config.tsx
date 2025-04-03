import axios from "axios";
export const http = axios.create({
  baseURL: "https://65a7ee3e94c2c5762da7f7ce.mockapi.io",
  timeout: 30000,
});
