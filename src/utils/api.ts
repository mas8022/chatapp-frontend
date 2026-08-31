import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window === undefined) return config;

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
);

api.interceptors.response.use((res: AxiosResponse) => {
  if (res.data.message) {
    if (res.data.status >= 300) {
      toast.error(res.data.message);
    } else {
      toast.success(res.data.message);
    }
  }

  return res.data;
});

export default api;
