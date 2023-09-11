import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTs } from "../interface/userTc";

export interface User {
  id: string;
  name: string;
  avatar: string;
  token: string;
  email: string;
  message: string;
}

interface Auth {
  user: UserTs | {};
}

export const loginRedux = createAsyncThunk<User, User>(
  "auth/login",
  (userLogin) => {
    return userLogin;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
  } as Auth,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loginRedux.fulfilled,
      (state, action: PayloadAction<User>) => {
        localStorage.setItem("userLocal", JSON.stringify(action.payload));
        state.user = action.payload;
      }
    );
  },
});

export default authSlice.reducer;
