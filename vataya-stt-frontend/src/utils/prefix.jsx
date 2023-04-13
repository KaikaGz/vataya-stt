export const getToken = () => {
  const { accessToken } = JSON.parse(localStorage.getItem("stt")) || {};
  return accessToken;
};
