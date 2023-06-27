import { ApiServiceAuthor, axiosApi } from "../http-common";
export interface UpdateMemberClubForm {
  membership_id: number;
  member_status: string;
}
const getListClub = () => {
  return localStorage.getItem("access_token") ? ApiServiceAuthor.get(`/club/list`) : axiosApi.get(`/club/list`);
};

const joinCLub = (data: any) => {
  return ApiServiceAuthor.post("/club/request-join", data);
};

const getClubBookList = () => {
  return ApiServiceAuthor.get("/club/book/list");
};
const getClubMemberList = () => {
  return ApiServiceAuthor.get("/club/member/list");
};
const updateMemberClub = (data: UpdateMemberClubForm) => {
  return ApiServiceAuthor.post("/club/member/update", data);
};
export default {
  getListClub,
  joinCLub,
  getClubBookList,
  getClubMemberList,
  updateMemberClub
};
