import axios from "axios";

export const axiosApi = axios.create({
    baseURL: "http://143.198.94.33/services/",
    headers: {
        "Content-type": "Application/json",
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
