import apiRequest from "./apirequest.js";

const signIn = async (signInData) => {
  const credentials =
    signInData?.data && typeof signInData.data === "object"
      ? signInData.data
      : signInData;

  return await apiRequest("/auth/signIn", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email?.trim(),
      password: credentials.password,
    }),
  });
};

export default signIn;
