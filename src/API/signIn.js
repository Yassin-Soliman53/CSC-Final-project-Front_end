import apiRequest from "./apirequest.js";

const signIn = async (signInData) => {
  return await apiRequest("/auth/signIn", {
    method: "POST",
    body: JSON.stringify(signInData),
  });
};

export default signIn;
