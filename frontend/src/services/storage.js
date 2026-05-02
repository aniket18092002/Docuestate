const TOKEN_KEY = "auth_token";

const storage = {
  saveToken: (token) => localStorage.setItem(TOKEN_KEY, token),

  getToken: () => localStorage.getItem(TOKEN_KEY),

  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};

export default storage;
