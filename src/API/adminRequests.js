import apiRequest from "./apirequest.js";

const requestAdminRole = () =>
  apiRequest("/users/admin-requests", {
    method: "POST",
    body: JSON.stringify({}),
  });

const getAdminRequests = () => apiRequest("/users/admin-requests");

const reviewAdminRequest = (requestId, status) =>
  apiRequest(`/users/admin-requests/${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

const getUsers = () => apiRequest("/users");

const updateUserRole = (userId, role) =>
  apiRequest(`/users/${encodeURIComponent(userId)}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export {
  getAdminRequests,
  getUsers,
  requestAdminRole,
  reviewAdminRequest,
  updateUserRole,
};
