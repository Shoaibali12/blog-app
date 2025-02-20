import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Persist user state
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Save user info
      localStorage.setItem("token", action.payload.token); // Save token
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user"); // Clear user info
      localStorage.removeItem("token"); // Clear token
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
