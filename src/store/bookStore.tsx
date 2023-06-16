import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "../services/book";

const initialState: any = {
  listBook: [],
};

export const getListBook = createAsyncThunk(
  "book/getAllBook",
  async (data?: any) => {
    const res = await bookService.getListBook(data?.pageIndex, data?.pageSize);
    return res.data;
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListBook.fulfilled, (state: any, action: any) => {
      return action.payload;
    });
  },
});

const { reducer } = bookSlice;
export default reducer;
