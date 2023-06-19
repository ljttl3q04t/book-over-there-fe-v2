import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import userService from "../services/user";

const initialState: any = {
  userList: [],
};

export const registerUser = createAsyncThunk("users/register", async (data: any, { rejectWithValue }) => {
  try {
    const res = await userService.registerUser(data);
    return res.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }

    return rejectWithValue(err.response.data);
  }
});

export const updateUser = createAsyncThunk("users/updateuser", async (data: any, { rejectWithValue }) => {
  try {
    const res = await userService.updateUser(data);
    return res.data;
  } catch (err: any) {
    if (!err.response) {
      throw err;
    }

    return rejectWithValue(err.response.data);
  }
});

export const getUser = createAsyncThunk("user/getUser", async () => {
  const res = await userService.getUser();
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state: any, { payload }) => {
      return payload;
    });
    builder.addCase(registerUser.rejected, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(updateUser.fulfilled, (state: any, { payload }) => {
      return payload;
    });
    builder.addCase(updateUser.rejected, (state: any, action: any) => {
      return action.payload;
    });
    builder.addCase(getUser.fulfilled, (state: any, action: any) => {
      return action.payload;
    });
  },
});

const { reducer } = userSlice;
export default reducer;
