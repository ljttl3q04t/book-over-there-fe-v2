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
const getClubStaffBookList = () => {
  return ApiServiceAuthor.get(`/club/staff/book/list?page=1&page_size=10000`);
};
export default {
  getListClub,
  joinCLub,
  getClubBookList,
  getClubMemberList,
  updateMemberClub,
  getClubStaffBookList
};
