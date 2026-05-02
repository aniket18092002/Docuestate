import axios from "axios";

const API = "http://localhost:5000/api/location-masters";

export const getLocationMasters = async () => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};

export const createLocationMaster = async (payload) => {
  const res = await axios.post(API, payload);
  return res.data;
};

export const updateLocationMaster = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload);
  return res.data;
};

export const updateLocationMasterStatus = async (id, status) => {
  const res = await axios.patch(`${API}/${id}/status`, { status });
  return res.data;
};
