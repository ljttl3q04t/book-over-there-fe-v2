import { ApiService } from "../http-common"

const getListBook = (pageSize: any, pageIndex: any) => {
    return ApiService.get(`/services/book/list/?page=${pageIndex}&page_size=${pageSize}`);
}

const bookService = {
    getListBook

}
export default bookService;