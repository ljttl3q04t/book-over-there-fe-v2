import { ApiServiceAuthor, axiosApi } from "../http-common";

const getListBook = (page: any, page_Size: any) => {
  const params = { page, page_Size };
  return ApiServiceAuthor.get(`/services/book/list`,params) ;
};

const bookService = {
  getListBook,
};
export default bookService;
