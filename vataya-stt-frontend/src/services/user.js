import config from "../config/config";
import { getToken } from "../utils/prefix";

export async function api_getTableUser(data) {
  const res = await fetch(config.api_backend + `/user/getalluser`, {
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

export async function api_deleteUser(data) {
  const res = await fetch(config.api_backend + `/user/delete`, {
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

export async function api_createUser(data) {
  const res = await fetch(config.api_backend + `/user/create`, {
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

export async function api_getUserID(id) {
  const res = await fetch(config.api_backend + `/user/getuser/${id}`, {
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

export async function api_editUserID(data) {
  const res = await fetch(config.api_backend + `/user/edit`, {
    body: JSON.stringify(data),
    method: "PUT",
    headers: {
      Authorization: getToken(),
      "Content-type": "application/json",
    },
  });

  const dataRespone = await res.json();
  return dataRespone;
}

export async function api_resetPassword(data) {
  const res = await fetch(config.api_backend + `/user/resetpass`, {
    body: JSON.stringify(data),
    method: "PUT",
    headers: {
      Authorization: getToken(),
      "Content-type": "application/json",
    },
  });

  const dataRespone = await res.json();
  return dataRespone;
}
