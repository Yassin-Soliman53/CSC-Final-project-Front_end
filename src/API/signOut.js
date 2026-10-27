import apiRequest from "./apirequest.js";

const signOut = async () => {
  return await apiRequest("/auth/signOut", {
    method: "POST",
  });
};

export default signOut;
