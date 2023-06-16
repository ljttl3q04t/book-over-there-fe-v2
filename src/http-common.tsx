import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "http://143.198.94.33/services",
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
    if (error.response && error.response.status === 401) {
      removeAccessToken();
      return;
    }

    return Promise.reject(error);
  }
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
      "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2OTEwNTQxLCJpYXQiOjE2ODY5MDY5NDEsImp0aSI6Ijk0Mzc3NTRmMmIzZDQxYmFiM2EyMzgwY2RiYmM3OWI4IiwidXNlcl9pZCI6MX0.4phvuG_xrsbGMJ1iYuJL-s-ELqqNKQ25icMIntDKou0`,
      "Content-type": "Application/json",
    },
    params,
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
