import { RcFile } from "antd/es/upload";
import { ApiServiceAuthor, axiosApi } from "../http-common";
export interface UpdateMemberClubForm {
  membership_id: number;
  member_status: string;
}
export interface ClubMemberOrderCreateForm {
  membership_id: number | undefined;
  member_book_copy_ids: number[];
  due_date: string;
  note: string;
  attachment: RcFile;
}
export interface ClubMemberDepositCreateForm {
  member_book_copy_ids: number[];
  description: string;
  attachment: RcFile;
}
export interface ClubMemberWithdrawCreateForm {
  member_book_copy_ids: number[];
  description: string;
  attachment: RcFile;
}
export interface ClubStaffBookListParams {
  searchText?: string;
  page?: number;
  pageSize?: number;
  membership_id?: number;
  book_copy__book_status?: string;
  deposit_book?: boolean;
  withdraw_book?: boolean;
  create_order_book?: boolean;
}
export interface ClubMemberBookBorrowingExtendForm {
  membership_order_detail_ids: React.Key[];
  new_due_date: string;
  note: string;
  attachment: RcFile;
}
export interface ClubMemberBookBorrowingReturnForm {
  membership_order_detail_ids: React.Key[];
  note: string;
  attachment: RcFile;
}
export interface ClubMemberBookBorrowingForm {
  membership_id: number;
}

const getListClub = () => {
  return localStorage.getItem("access_token") ? ApiServiceAuthor.get(`/club/list`) : axiosApi.get(`/club/list`);
};

const joinCLub = (data: any) => {
  return ApiServiceAuthor.post("/club/request-join", data);
};

const getClubBookList = () => {
  return axiosApi.get("/club/book/list");
};
const getClubMemberList = () => {
  return ApiServiceAuthor.get("/club/member/list");
};
const updateMemberClub = (data: UpdateMemberClubForm) => {
  return ApiServiceAuthor.post("/club/member/update", data);
};
const getClubStaffBookList = (params: ClubStaffBookListParams = {}) => {
  const {
    searchText = "",
    page = 1,
    pageSize = 10000,
    membership_id,
    deposit_book = false,
    withdraw_book = false,
    create_order_book = false,
  } = params;

  let query = `?search=${searchText}&page=${page}&page_size=${pageSize}`;

  if (membership_id !== undefined) {
    query += `&membership_id=${membership_id}`;
  }

  if (deposit_book) {
    query += `&deposit_book=${true}`;
  } else if (withdraw_book) {
    query += `&withdraw_book=${true}`;
  } else if (create_order_book) {
    query += `&create_order_book=${true}`;
  }

  return ApiServiceAuthor.get(`/club/staff/book/list${query}`);
};

const clubMemberOrderCreate = (data: ClubMemberOrderCreateForm) => {
  const formData = new FormData();
  formData.append("membership_id", String(data.membership_id));
  formData.append("member_book_copy_ids", data.member_book_copy_ids.join(","));
  formData.append("due_date", data.due_date);
  formData.append("note", data.note);
  formData.append("attachment", data.attachment);
  return ApiServiceAuthor.post("/club/member/order/create", formData);
};

const clubMemberDepositCreate = (data: ClubMemberDepositCreateForm) => {
  const formData = new FormData();
  formData.append("member_book_copy_ids", data.member_book_copy_ids.join(","));
  formData.append("description", data.description);
  formData.append("attachment", data.attachment);
  return ApiServiceAuthor.post("/club/member/book/deposit", formData);
};
const clubMemberWithdrawCreate = (data: ClubMemberWithdrawCreateForm) => {
  const formData = new FormData();
  formData.append("member_book_copy_ids", data.member_book_copy_ids.join(","));
  formData.append("description", data.description);
  formData.append("attachment", data.attachment);
  return ApiServiceAuthor.post("/club/member/book/withdraw", formData);
};
const getClubMemberBookBorrowing = (data: ClubMemberBookBorrowingForm) => {
  return ApiServiceAuthor.post("/club/member/book/borrowing", data);
};
const clubMemberBookBorrowingExtend = (data: ClubMemberBookBorrowingExtendForm) => {
  const formData = new FormData();
  formData.append("membership_order_detail_ids", data.membership_order_detail_ids.join(","));
  formData.append("new_due_date", data.new_due_date);
  formData.append("note", data.note);
  formData.append("attachment", data.attachment);
  return ApiServiceAuthor.post("/club/member/order/extend", formData);
};
const clubMemberBookBorrowingReturn = (data: ClubMemberBookBorrowingReturnForm) => {
  const formData = new FormData();
  formData.append("membership_order_detail_ids", data.membership_order_detail_ids.join(","));
  formData.append("note", data.note);
  formData.append("attachment", data.attachment);
  return ApiServiceAuthor.post("/club/member/book/return", formData);
};
export default {
  getListClub,
  joinCLub,
  getClubBookList,
  getClubMemberList,
  updateMemberClub,
  getClubStaffBookList,
  clubMemberOrderCreate,
  getClubMemberBookBorrowing,
  clubMemberBookBorrowingExtend,
  clubMemberDepositCreate,
  clubMemberWithdrawCreate,
  clubMemberBookBorrowingReturn,
};
