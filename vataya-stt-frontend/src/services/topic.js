import config from "../config/config";
import { getToken } from "../utils/prefix";

export async function api_getTopicList(data) {
  const res = await fetch(config.api_backend + `/topic/getall`, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      Authorization: getToken(),
      "Content-type": "application/json",
    },
  });

  const dataRespone = await res.json();
  return dataRespone;
}

export async function api_getTopic() {
  const res = await fetch(config.api_backend + `/topic/gettopic`, {
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

export async function api_getDialog() {
  const res = await fetch(config.api_backend + `/topic/getdialog`, {
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
