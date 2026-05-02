export const isSessionValid = () => {
    const token = localStorage.getItem("auth_token");
    const loginTime = localStorage.getItem("login_time");

    if (!token || !loginTime) return false;

    const ONE_HOUR = 60 * 60 * 1000; // 1 hour in ms
    const now = Date.now();

    return now - Number(loginTime) < ONE_HOUR;
};

export const clearSession = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_time");
};
