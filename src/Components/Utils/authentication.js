const APP_USER_STORAGE = 'BRF-USER-STORAGE';
const APP_ACCESS_TOKEN = 'BRF-ACCESS-TOKEN';
const APP_REFRESH_TOKEN = 'BRF-REFRESH-TOKEN';

export const getSessionUser = () => {
  const userStr = localStorage.getItem(APP_USER_STORAGE);

  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const getSessionToken = () => {
  const tokenStr = localStorage.getItem(APP_ACCESS_TOKEN);

  if (tokenStr) {
    return tokenStr;
  }
  return null;
};

export const getRefreshToken = () => {
  const tokenStr = localStorage.getItem(APP_REFRESH_TOKEN);

  if (tokenStr) {
    return tokenStr;
  }
  return null;
};

export const setSessionUserAndToken = (user, accessToken, refreshToken) => {
  localStorage.setItem(APP_USER_STORAGE, JSON.stringify(user));
  localStorage.setItem(APP_ACCESS_TOKEN, accessToken);
  localStorage.setItem(APP_REFRESH_TOKEN, refreshToken);
};

export const setSessionAccessAndRefreshToken = (accessToken, refreshToken) => {
  localStorage.setItem(APP_ACCESS_TOKEN, accessToken);
  localStorage.setItem(APP_REFRESH_TOKEN, refreshToken);
};

export const setSessionUser = (user) => {
  localStorage.setItem(APP_USER_STORAGE, JSON.stringify(user));
};

export const setSessionUserKeyAgainstValue = (key, value) => {
  const userStr = localStorage.getItem(APP_USER_STORAGE);
  let userStrObj = JSON.parse(userStr);

  userStrObj = {
    ...userStrObj, [key]: value
  };

  localStorage.setItem(APP_USER_STORAGE, JSON.stringify(userStrObj));
};

export const removeSessionAndLogoutUser = () => {
  localStorage.removeItem(APP_USER_STORAGE);
  localStorage.removeItem(APP_ACCESS_TOKEN);
  localStorage.removeItem(APP_REFRESH_TOKEN);
  window.location.href = '/login';
};
