import axios from "axios";

const API = "http://localhost:5000/api/properties";

// export const getAllProperties = async () => {
//   const res = await axios.get(API);
//   return res.data;
// };
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("auth_token")}`
  },
});
export const getAllProperties = async () => {
  const res = await axios.get(API, authHeader());
  return res.data;
};
export const getPropertyById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const createProperty = async (payload) => {
  const res = await axios.post(API, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`
    },
  });
  return res.data;
};

export const updateProperty = async (id, payload) => {
  const res = await axios.put(`${API}/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`
    },
  });
  return res.data;
};


// export const updatePropertyStatus = async (id, status) => {
//   const res = await axios.patch(`${API}/${id}/status`, { status });
//   return res.data;
// };
export const updatePropertyStatus = async (id, status) => {
  const res = await axios.patch(
    `${API}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
      },
    }
  );
  return res.data;
};
export const updatePropertyStatus_listed = async (id, status) => {
  const res = await axios.patch(
    `${API}/${id}/property_listed`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
      },
    }
  );
  return res.data;
};

export const updateFeaturedImage = async (id, featured_image) => {
  const res = await axios.patch(
    `${API}/${id}/featured-image`,
    { featured_image },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
      },
    }
  );
  return res.data;
};

export const setLandingImage = async (propertyId, attachmentId) => {
  return axios.patch(
    `${API}/${propertyId}/landing-image`,
    { attachmentId },
    authHeader()
  );
};

export const deletePropertyAttachment = async (propertyId, attachmentId) => {
  return axios.delete(
    `http://localhost:5000/api/properties/${propertyId}/attachment/${attachmentId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
      },
    }
  );
};

export const searchProperties = async (queryString) => {
  const res = await axios.get(
    `http://localhost:5000/api/properties/search${queryString}`
  );
  return res.data;
};