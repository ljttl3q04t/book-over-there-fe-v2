import { axiosApi } from "../http-common";

const registerUser = (data: any) => {
    return axiosApi.post(`/user/register`, data);
};

const userService = {
    registerUser,
};
export default userService;
