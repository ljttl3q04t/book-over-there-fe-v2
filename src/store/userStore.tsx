import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/user";

const initialState: any = {
    userList: []
};

export const registerUser = createAsyncThunk(
    "user/register",
    async (data?: any) => {
        const res = await userService.registerUser(data);
        return res.data;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state: any, action: any) => {
            return action.payload;
        });
    },
});

const { reducer } = userSlice;
export default reducer;
