import config from "../config/config";
import { getToken } from "../utils/prefix";

export async function api_getAllRole() {
  const res = await fetch(config.api_backend + `/user/getallrole`, {
    // body: JSON.stringify(data),
    method: "GET",
    headers: {
      Authorization: getToken(),
      "Content-type": "application/json",
    },
  });

  const dataRespone = await res.json();
  return dataRespone;
}
