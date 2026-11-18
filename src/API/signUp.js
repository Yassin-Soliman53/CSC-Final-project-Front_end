import apiRequest from "./apirequest.js";

const signUp = async (signUpData) => {
  const account =
    signUpData?.data && typeof signUpData.data === "object"
      ? signUpData.data
      : signUpData;

  return await apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name: account.name?.trim(),
      email: account.email?.trim(),
      password: account.password,
      roomNumber: account.roomNumber?.trim(),
      phone: account.phone?.trim(),
    }),
  });
};

export default signUp;
