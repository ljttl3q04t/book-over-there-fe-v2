import { notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const axiosApi = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}/services`,
  headers: {
    "Content-type": "Application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// API for D Free Book
export const dfbApi = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}/dfree`,
  headers: {
    "Content-type": "Application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosApi.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    if (!error.response) {
      notification.error({
        message: error.message,
      });
    }

    if (error.response && error.response.status === 401) {
      removeAccessToken();
      localStorage.clear();
      return;
    }
    return Promise.reject(error);
  },
);

dfbApi.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    if (!error.response) {
      notification.error({
        message: error.message,
      });
    }
    return Promise.reject(error);
  },
);

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const removeAccessToken = () => {
  return localStorage.removeItem("access_token");
};

const buildHeaders = (params?: any) => {
  const access_token = getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    ...params,
  };
};

export class ApiServiceAuthor {
  static async post(path: string, data: any) {
    return axiosApi.post(path, data, buildHeaders());
  }

  static async get(path: string, params?: any) {
    return axiosApi.get(path, buildHeaders(params));
  }

  static async put(path: string, data: any) {
    return axiosApi.put(path, data, buildHeaders());
  }

  static async delete(path: string) {
    return axiosApi.delete(path, buildHeaders());
  }
}
