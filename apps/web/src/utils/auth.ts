const TOKEN_KEY = "token";
const USER_KEY = "auth"

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setAuthUser = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const getAuthUser = () => {
  const user = localStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};