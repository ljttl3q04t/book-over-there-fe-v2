import { ApiServiceAuthor } from "../http-common";
import { axiosApi } from "../http-common";

const getListClub = () => {
    return axiosApi.get(`/club/list`);
};

const joinCLub = (data: any) => {
    return ApiServiceAuthor.post('/club/request-join', data);
}

const clubService = {
    getListClub,
    joinCLub
};
export default clubService;
