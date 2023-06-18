import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clubService from "../services/club";

const initialState: any = {
    userList: []
};

export const getClubList = createAsyncThunk(
    "club/getListClub",
    async () => {
        const res = await clubService.getListClub();
        return res.data;
    }
);

const clubSlice = createSlice({
    name: "club",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getClubList.fulfilled, (state: any, action: any) => {
            return action.payload;
        });
    },
});

const { reducer } = clubSlice;
export default reducer;
