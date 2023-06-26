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

const bookService = {
  getListBook,
  getMyBookList,
};
export default bookService;
