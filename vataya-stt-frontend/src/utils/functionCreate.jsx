export const timeout = (number) => {
  return new Promise((res) => setTimeout(res, number));
};
