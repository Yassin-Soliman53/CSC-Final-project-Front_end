import apiRequest from "./apirequest.js";

const signUp = async (signUpData) => {
  return await apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(signUpData),
  });
};

export default signUp;
