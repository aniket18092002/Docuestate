// src/api/admin.api.js
import axios from "../services/axios.config";

const adminApi = {
 //test
  getSummary: () => axios.get("/admin/summary"),
  // returns recent properties list
  getRecentProperties: (limit = 10) => axios.get(`/properties?limit=${limit}&sort=recent`),
  // returns recent inquiries
  getRecentInquiries: (limit = 10) => axios.get(`/inquiries?limit=${limit}&sort=recent`),
};

export default adminApi;
