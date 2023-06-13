import axios from "axios";

export const axiosApi = axios.create({
    baseURL: "http://9094-171-236-170-164.ngrok-free.app/",
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
            removeAccessToken()
            window.location.href = "/login";
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
        params
    };
};


export class ApiService {
    static async post(path: string, data: any) {
        return axios.post(path, data, buildHeaders());
    }

    static async get(path: string) {
        return axios.get(path, buildHeaders());
    }

    static async put(path: string, data: any) {
        return axios.put(path, data, buildHeaders());
    }

    static async delete(path: string) {
        return axios.delete(path, buildHeaders());
    }
}
