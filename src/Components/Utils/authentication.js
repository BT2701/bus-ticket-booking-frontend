import CryptoJS from 'crypto-js';

const APP_USER_STORAGE = 'BRF-USER-STORAGE';
const APP_ACCESS_TOKEN = 'BRF-ACCESS-TOKEN';
const APP_REFRESH_TOKEN = 'BRF-REFRESH-TOKEN';

const SECRET_KEY = 'EkZGXUF3cq9Kv4dFWQqaZhVoF91kh6vM';

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
    return decryptedData;
  } catch (err) {
    console.error('Failed to decrypt data:', err);
    return null;
  }
};

export const getSessionUser = () => {
  const userStr = localStorage.getItem(APP_USER_STORAGE);
  if (userStr) {
    return decryptData(userStr);
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
  localStorage.setItem(APP_USER_STORAGE, encryptData(user));
  localStorage.setItem(APP_ACCESS_TOKEN, accessToken);
  localStorage.setItem(APP_REFRESH_TOKEN, refreshToken);
};

export const setSessionAccessAndRefreshToken = (accessToken, refreshToken) => {
  localStorage.setItem(APP_ACCESS_TOKEN, accessToken);
  localStorage.setItem(APP_REFRESH_TOKEN, refreshToken);
};

export const setSessionAccess = (accessToken) => {
  localStorage.setItem(APP_ACCESS_TOKEN, accessToken);
};

export const setSessionUser = (user) => {
  localStorage.setItem(APP_USER_STORAGE, encryptData(user));
};

export const setSessionUserKeyAgainstValue = (key, value) => {
  const userStr = localStorage.getItem(APP_USER_STORAGE);
  let userObj = {};
  if (userStr) {
    try {
      userObj = decryptData(userStr);
    } catch (err) {
      console.error('Failed to decrypt user data:', err);
      return;
    }
  }
  userObj[key] = value;
  localStorage.setItem(APP_USER_STORAGE, encryptData(userObj));
};

export const removeSessionAndLogoutUser = () => {
  localStorage.removeItem(APP_USER_STORAGE);
  localStorage.removeItem(APP_ACCESS_TOKEN);
  localStorage.removeItem(APP_REFRESH_TOKEN);
  // window.location.href = '/login';
};
