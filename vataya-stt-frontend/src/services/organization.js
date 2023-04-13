import config from "../config/config";
import { getToken } from "../utils/prefix";

export async function api_getAllOrg() {
  const res = await fetch(config.api_backend + `/user/getallorg`, {
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

export async function api_getAllOrgList(data) {
  const res = await fetch(config.api_backend + `/org/getall`, {
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

export async function api_editOrgID(data) {
  const res = await fetch(config.api_backend + `/org/edit`, {
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

export async function api_createOrgID(data) {
  const res = await fetch(config.api_backend + `/org/create`, {
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

export async function api_getOrgID(id) {
  const res = await fetch(config.api_backend + `/org/getorg/${id}`, {
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

export async function api_updateSatus(data) {
  const res = await fetch(config.api_backend + `/org/setstatus`, {
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
