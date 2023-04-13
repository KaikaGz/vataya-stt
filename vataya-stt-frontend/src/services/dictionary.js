import config from "../config/config";
import { getToken } from "../utils/prefix";

export async function api_getDicID(id) {
  const res = await fetch(config.api_backend + `/dic/getdic/${id}`, {
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

export async function api_getDicList(data) {
  const res = await fetch(config.api_backend + `/dic/getalldic`, {
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

export async function api_getDic() {
  const res = await fetch(config.api_backend + `/dic/getdic`, {
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

export async function api_createDic(data) {
  const res = await fetch(config.api_backend + `/dic/create`, {
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

export async function api_createTransform(data) {
  const res = await fetch(config.api_backend + `/dic/createtransform`, {
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

export async function api_getTransform(data) {
  const res = await fetch(config.api_backend + `/dic/gettransform`, {
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

export async function api_getTransformID(id) {
  const res = await fetch(config.api_backend + `/dic/gettransform/${id}`, {
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

export async function api_editTransformID(data) {
  const res = await fetch(config.api_backend + `/dic/edittransform`, {
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

export async function api_deleteTransformID(id) {
  const res = await fetch(config.api_backend + `/dic/deltransform/${id}`, {
    // body: JSON.stringify(data),
    method: "DELETE",
    headers: {
      Authorization: getToken(),
      "Content-type": "application/json",
    },
  });

  const dataRespone = await res.json();
  return dataRespone;
}

export async function api_getModel(data) {
  const res = await fetch(config.api_backend + `/dic/getmodel`, {
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
