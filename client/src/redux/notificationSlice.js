import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch Notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    const { token } = getState().auth;
    const { data } = await axios.get(
      "http://localhost:5000/api/notifications",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  }
);

// ✅ Mark Notification as Read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { getState }) => {
    const { token } = getState().auth;
    await axios.put(
      `http://localhost:5000/api/notifications/${notificationId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return notificationId;
  }
);

// ✅ Mark All Notifications as Read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { getState }) => {
    const { token } = getState().auth;
    await axios.put(
      `http://localhost:5000/api/notifications/read-all`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { notifications: [], loading: false },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notif) =>
          notif._id === action.payload ? { ...notif, isRead: true } : notif
        );
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((notif) => ({
          ...notif,
          isRead: true,
        }));
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
