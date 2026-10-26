import apiRequest from "./apirequest.js";

const signUp = async (signUpData) => {
  return await apiRequest("/auth/signUp", {
    method: "POST",
    body: JSON.stringify(signUpData),
  });
};

export default signUp;
