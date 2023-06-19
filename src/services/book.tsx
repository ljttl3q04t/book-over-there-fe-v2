import { ApiServiceAuthor } from "../http-common";

const getListBook = (page: any, page_Size: any) => {
    const params = { page, page_Size };
    return ApiServiceAuthor.get(`/book/list`, { params });
};

const bookService = {
    getListBook,
};
export default bookService;
