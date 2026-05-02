import axios from "axios";

const API = "http://localhost:5000/api/property-types";


export const getPropertyTypes = async () => {
  const res = await axios.get(`${API}/active`);
  return res.data;
};
export const createPropertyType = async (payload) => {
  const res = await axios.post(API, payload);
  return res.data;
};

export const getPropertyTypeById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const updatePropertyType = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload);
  return res.data;
};

export const updatePropertyTypeStatus = async (id, status) => {
  const res = await axios.patch(`${API}/${id}/status`, { status });
  return res.data;
};
