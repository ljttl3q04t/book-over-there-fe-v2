import bookService from "@/services/book";
import { BookCopy } from "@/services/types";
import { notification } from "antd";

export const fetchBookList = async () => {
  try {
    const response: BookCopy[] = await bookService.getMyBookList();
    const data = response.map((item: any, index: any) => {
      return {
        key: index + 1,
        id: item.id,
        bookName: item?.book?.name,
        bookCategory: item?.book?.category?.name,
        bookAuthor: item?.book?.author?.name,
        bookPublisher: item?.book?.publisher?.name,
        bookImage: item?.book?.image,
        createdAt: item?.created_at,
        iupdatedAt: item?.updated_at,
        bookStatus: item?.book_status,
        bookDepositPrice: item?.book_deposit_price,
        bookDepositStatus: item?.book_deposit_status,
        user: item?.user,
      };
    });
    return data;
  } catch (error) {
    console.error("error", error);
    // Handle error
    notification.error({
      message: `Validation Error: `,
      description: "System error",
    });
  }
};

export const getListBookInit = async (option: any) => {
  try {
    const response = await bookService.getListBook(option.pageIndex, option.pageSize, option.txtSearch);
    const data = response?.data?.results.map((item: any, index: any) => {
      return {
        key: index + 1,
        id: item.id,
        bookName: item?.name,
        bookCategory: item?.category?.name,
        bookAuthor: item?.author?.name,
        bookPublisher: item?.publisher?.name,
        bookImage: item?.image,
      };
    });
    return data;
  } catch (error) {
    console.error("error", error);
    // Handle error
    notification.error({
      message: `Validation Error: `,
      description: "System error",
    });
  }
};

export const getBookByLink = async (link: any) => {
  try {
    const response = await bookService.getBookByLink(link);
    return response;
  } catch (error) {
    notification.error({
      message: `Validation Error: `,
      description: "Link book incorrect",
    });
  }
};

export const getBookBorrow = async () => {
  try {
    const response = await bookService.getBookborrow();
    return response;
  } catch (error) {
    notification.error({
      message: `Validation Error: `,
      description: "System error",
    });
  }
};

export const getBookHistory = async () => {
  try {
    const response: any[] = await bookService.getHistoryBook();

    const data = response.map((item: any, index: any) => {
      return {
        key: index + 1,
        id: item.id,
        action: item.action,
        bookName: item?.book_copy?.book?.name,
        bookCategory: item?.book_copy?.book?.category?.name,
        bookAuthor: item?.book_copy?.book?.author?.name,
        bookPublisher: item?.book_copy?.book?.publisher?.name,
        bookImage: item?.book_copy?.book?.image,
        createdAt: item?.book_copy?.created_at,
        updatedAt: item?.book_copy?.updated_at,
        bookStatus: item?.book_copy?.book_status,
        bookDepositPrice: item?.book_copy?.book_deposit_price,
        bookDepositStatus: item?.book_copy?.book_deposit_status,
        user: item?.book_copy?.user,
      };
    });
    return data;
  } catch (error) {
    console.error("error", error);
    // Handle error
    notification.error({
      message: `Validation Error: `,
      description: "System error",
    });
  }
};
