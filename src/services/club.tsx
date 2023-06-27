import { ApiServiceAuthor } from "../http-common";
import { axiosApi } from "../http-common";

const getListClub = () => {
  return localStorage.getItem("access_token") ? ApiServiceAuthor.get(`/club/list`) : axiosApi.get(`/club/list`);
};

const joinCLub = (data: any) => {
  return ApiServiceAuthor.post("/club/request-join", data);
};

const clubService = {
  getListClub,
  joinCLub,
};
export default clubService;
