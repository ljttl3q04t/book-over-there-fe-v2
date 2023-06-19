import { ApiServiceAuthor, axiosApi } from "../http-common";

const registerUser = (data: any) => {
    return axiosApi.post('/user/register', data);
};

const getUser = () =>{
    return ApiServiceAuthor.get('/user/info');
}

const updateUser = (data:any) =>{
    return ApiServiceAuthor.put('/user/info/update',data);
}

const userService = {
    registerUser,
    getUser,
    updateUser
};
export default userService;
