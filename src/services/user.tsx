import { ApiServiceAuthor, axiosApi } from "../http-common";

const registerUser = (data: any) => {
    return axiosApi.post(`/user/register`, data);
};

const getUser = () =>{
    return ApiServiceAuthor.get('/user/info');
}

const userService = {
    registerUser,
    getUser
};
export default userService;
