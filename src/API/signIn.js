import apiRequest from "./apirequest.js";

const login = async (loginData) => {
  return await apiRequest("/auth/signIn", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
};

export default login;
