import API from "./api";

export const loginUser = async (credentials) => {
  const res = await API.post("/users/login", credentials);
  return res.data;
};

export const registerUser = async (user) => {
  const res = await API.post("/users/register", user);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const getUserByUsername = async (username) => {
  const res = await API.get(`/users/${username}`);
  return res.data;
};
