import config from "../config/config";

export async function api_login(data) {
  const res = await fetch(config.api_backend + `/user/auth`, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  });

  const dataRespone = await res.json();
  return dataRespone;
}
