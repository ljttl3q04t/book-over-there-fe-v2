import { ApiServiceAuthor, axiosApi, dfbApi } from "../http-common";
import { BookCopy, ClubBookInfos } from "./types";

async function getClubBookIds(data: any): Promise<number[]> {
  try {
    const response = await dfbApi.post(`/club_book/get_ids`, data);
    const { club_book_ids } = response.data;
    return club_book_ids;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function getClubBookInfos(clubBookIds: number[]): Promise<ClubBookInfos[]> {
  if (!clubBookIds.length) {
    return [];
  }
  const data = {
    club_book_ids: clubBookIds.join(","),
  };
  try {
    const response = await dfbApi.post(`/club_book/get_infos`, data);
    const { club_book_infos } = response.data;
    return club_book_infos;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const getListBook = (page: any, page_Size: any, filter?: any) => {
  const params = { page, page_Size, filter };
  return axiosApi.get(`/book/list`, { params });
};

async function getMyBookList(): Promise<BookCopy[]> {
  try {
    const response = await ApiServiceAuthor.get(`/user/my-book`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const createBook = async (data: any) => {
  try {
    const response = await ApiServiceAuthor.post(`/user/book/add`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getHistoryBook = async () => {
  try {
    const response = await ApiServiceAuthor.get(`/user/book/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getBookByLink = async (data: any) => {
  try {
    const response = await ApiServiceAuthor.post(`/book/check`, data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || "An error occurred";
    throw new Error(errorMessage);
  }
};

const getBookborrow = async () => {
  try {
    const response = await ApiServiceAuthor.get(`user/book/borrowing`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const bookService = {
  getListBook,
  getMyBookList,
  createBook,
  getHistoryBook,
  getBookByLink,
  getBookborrow,
  getClubBookIds,
  getClubBookInfos,
};
export default bookService;
