import axios from "../services/axios.config";

const propertyApi = {
  getAll: () => axios.get("/properties"),
  getById: (id) => axios.get(`/properties/${id}`),
  create: (data) => axios.post("/properties", data),
  update: (id, data) => axios.put(`/properties/${id}`, data),
  remove: (id) => axios.delete(`/properties/${id}`),
};

export default propertyApi;
