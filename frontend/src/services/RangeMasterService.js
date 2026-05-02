import axios from "axios";

const API = "http://localhost:5000/api/range-masters";

export const getRangeMasters = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createRangeMaster = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateRangeMaster = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

export const updateRangeMasterStatus = async (id, status) => {
  const res = await axios.patch(`${API}/${id}/status`, { status });
  return res.data;
};
