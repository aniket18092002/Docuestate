import axios from "axios";

const API = "http://localhost:5000/api/dashboard";

export const getDashboardStats = async () => {
  const res = await axios.get(`${API}/stats`);
  return res.data;
};

export const getRecentUsers = async () => {
  const res = await axios.get(`${API}/recent-users`);
  return res.data;
};