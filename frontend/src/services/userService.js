import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

//  CREATE USER
export const createUser = async (payload) => {
  const res = await axios.post(`${API_URL}/register`, payload);
  return res.data;
};

//  GET ALL USERS
export const getUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

//  GET USER BY ID
export const getUserById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

//  UPDATE USER
export const updateUser = async (id, payload) => {
  const res = await axios.put(`${API_URL}/${id}`, payload);
  return res.data;
};

//  DELETE USER (FIXED)
export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

//  UPDATE USER STATUS (FIXED)
export const updateUserStatus = async (id, status) => {
  const res = await axios.patch(`${API_URL}/${id}/status`, { status });
  return res.data;
};

export const getActiveOwners = async () => {
  const token = localStorage.getItem("auth_token");

  const res = await axios.get(`${API_URL}/owners`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // backend returns { success, users }
  return res.data.users;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API}/simple-login`, { email, password });
  return res.data;
};