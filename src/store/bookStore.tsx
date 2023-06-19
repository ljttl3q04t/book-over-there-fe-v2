import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "../services/book";

const initialState: any = {
  listBook: {},
};

export const getListBook = createAsyncThunk(
  "book/getAllBook",
  async (data?: any) => {
    const res = await bookService.getListBook(data?.pageIndex, data?.pageSize, data?.filter);
    return res.data;
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListBook.fulfilled, (state: any, { payload }: any) => {
      state.listBook = payload
    });
  },
});

const { reducer } = bookSlice;
export default reducer;
