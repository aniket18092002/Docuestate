// src/services/auth.service.js
import axios from "./axios.config";

const register = (data) => axios.post("/auth/register", data);
const login = (data) => axios.post("/auth/login", data);
const getProfile = () => axios.get("/auth/profile");

export default { register, login, getProfile };
