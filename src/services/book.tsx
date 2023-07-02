import { ApiServiceAuthor } from "../http-common";
import { BookCopy, ListView } from "./types";

const getListBook = (page: any, page_Size: any, filter?: any) => {
  const params = { page, page_Size, filter };
  return ApiServiceAuthor.get(`/book/list`, { params });
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

const getBookByLink = async (data:any) => {
  try {
    const response = await ApiServiceAuthor.post(`/book/check`,data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
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
  getBookborrow
};
export default bookService;
