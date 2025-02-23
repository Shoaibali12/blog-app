import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../redux/notificationSlice";
import { Link, useNavigate } from "react-router-dom";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center">🔔 Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-400 mt-4">No new notifications</p>
      ) : (
        <div className="max-w-2xl mx-auto mt-6 space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center transition-opacity ${
                notif.isRead ? "opacity-50" : "opacity-100"
              }`}
            >
              <div>
                <p className="text-white">{notif.message}</p>
                <button
                  onClick={() => {
                    navigate(`/post/${notif.blogId}`, {
                      state: { notificationId: notif._id },
                    });
                  }}
                  className="text-blue-400 hover:underline text-sm"
                >
                  View Post
                </button>
              </div>
              {!notif.isRead && (
                <button
                  onClick={() => dispatch(markNotificationAsRead(notif._id))}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-500 text-sm"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
