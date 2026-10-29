import apiRequest from "./apirequest.js";

export function requestPasswordReset(email) {
  return apiRequest("/auth/forgotPassword", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token, password) {
  return apiRequest("/auth/resetPassword", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
