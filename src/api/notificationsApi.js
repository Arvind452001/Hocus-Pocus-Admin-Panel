
// ==============================
// 1. Broadcast Notification

import axiosJSONData from "./axiosJSONData";

// ==============================
export const sendBroadcastNotification = (data) => {
  return axiosJSONData.post("/notifications/admin/broadcast", data);
};

// ==============================
// 2. Send to Single User
// ==============================
export const sendToUser = (data) => {
  return axiosJSONData.post("/notifications/admin/send-to-user", data);
};

// ==============================
// 3. Send to User Enabled
// ==============================
export const sendToUserEnabled = (data) => {
  return axiosJSONData.post(
    "/api/notifications/admin/send-to-user-enabled",
    data
  );
};

// ==============================
// 4. Send to Multiple Users
// ==============================
export const sendToMultipleUsers = (data) => {
  return axiosJSONData.post(
    "/notifications/admin/send-to-multiple",
    data
  );
};

// ==============================
// 5. Broadcast Enabled Users
// ==============================
export const sendBroadcastEnabled = (data) => {
  return axiosJSONData.post(
    "/api/notifications/admin/broadcast-enabled",
    data
  );
};

// ==============================
// 6. Send to Less than 10 Users
// ==============================
export const sendToLessThan10 = (data) => {
  return axiosJSONData.post(
    "/notifications/admin/send-to-less-than-10",
    data
  );
};

// ==============================
// 7. Get Stats
// ==============================
export const getNotificationStats = () => {
  return axiosJSONData.get("/api/notifications/admin/stats");
};

// ==============================
// 8. Get Users With Tokens
// ==============================
export const getUsersWithTokens = () => {
  return axiosJSONData.get(
    "/api/notifications/admin/users-with-tokens"
  );
};