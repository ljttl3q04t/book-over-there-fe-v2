import { ApiServiceAuthor } from "../http-common";
import { axiosApi } from "../http-common";

const getListClub = () => {
    return axiosApi.get(`/club/list`);
};

const clubService = {
    getListClub,
};
export default clubService;
