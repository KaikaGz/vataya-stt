const db = require("../config/pgp");
const mysql = require("mysql");
const { getDateTime } = require("./event");
const Model = {};

Model.getDic = ({ id }) => {
  return db.queryAsync(
    `
          select * from dictionary where dic_id = ?;
      `,
    [id]
  );
};
Model.getAllDic = (params, { role, org, user_id }) => {
  const {
    page = 1,
    size = 10,
    order_by = [],
    query = {},
    exportData = false,
  } = params; // request body
  const { search_key } = query;
  const orderMaps = {};
  const OrderString = order_by
    .map(([key, order]) => `${orderMaps[key] ?? key} ${order}`)
    .join(",");
  let queries = [
    `dictionary.*, COUNT(text_transform.dic_id) as no_of_dic`,
    "count(*) as total",
  ];
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `select ${v} FROM dictionary left join text_transform on dictionary.dic_id = text_transform.dic_id where ${
          search_key ? "dic_name COLLATE UTF8_GENERAL_CI like ?" : "true"
        } GROUP by dictionary.dic_id order by ${
          order_by.length > 0 ? OrderString : `dic_name asc`
        } ${
          exportData ? "" : i == 0 ? `limit ${(page - 1) * size},${size}` : ""
        }
                  `,
        [
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
        ].filter(
          (value) =>
            value !== null &&
            typeof value !== "undefined" &&
            value !== "" &&
            value !== "%%"
        )
      )
    )
  );
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `select ${v} from dictionary where ${
          search_key ? "dic_name COLLATE UTF8_GENERAL_CI like ?" : "true"
        } order by ${order_by.length > 0 ? OrderString : `dic_name asc`} ${
          exportData ? "" : i == 0 ? `limit ${(page - 1) * size},${size}` : ""
        }
                  `,
        [
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
        ].filter(
          (value) =>
            value !== null &&
            typeof value !== "undefined" &&
            value !== "" &&
            value !== "%%"
        )
      )
    )
  );
};
Model.insert = (params, { fullname }) => {
  const { dic_name, type } = params;
  const date = getDateTime();
  let updateList = {
    dic_name,
    create_by: fullname,
    create_date: date,
    edit_by: fullname,
    edit_date: date,
    type,
    status: 1,
  };
  let notNullList = Object.fromEntries(
    Object.entries(updateList).filter(
      ([_, value]) => value !== null && typeof value !== "undefined"
    )
  );
  let insertColumns = Object.keys(notNullList);
  return db.queryAsync(
    `
      INSERT INTO dictionary(${insertColumns.join(",")}) VALUES (${Array(
      insertColumns.length
    )
      .fill("?")
      .join(",")})
        `,
    Object.values(notNullList)
  );
};
Model.getDicTopic = () => {
  return db.queryAsync(
    `
        select * from dictionary
    `
  );
};
Model.createTransform = (params) => {
  const { text_original, text_tranform, dic_id } = params;
  console.log("params", params);
  const date = getDateTime();
  let updateList = {
    txt_original: text_original,
    txt_transform: text_tranform,
    dic_id: dic_id,
  };
  let notNullList = Object.fromEntries(
    Object.entries(updateList).filter(
      ([_, value]) => value !== null && typeof value !== "undefined"
    )
  );
  let insertColumns = Object.keys(notNullList);
  return db.queryAsync(
    `
        INSERT INTO text_transform(${insertColumns.join(",")}) VALUES (${Array(
      insertColumns.length
    )
      .fill("?")
      .join(",")})
          `,
    Object.values(notNullList)
  );
};
Model.getTransform = (params) => {
  const {
    page = 1,
    size = 10,
    order_by = [],
    query = {},
    dic_id,
    exportData = false,
  } = params; // request body
  const { search_key } = query;
  const orderMaps = {};
  const OrderString = order_by
    .map(([key, order]) => `${orderMaps[key] ?? key} ${order}`)
    .join(",");
  let queries = [`txt_id,txt_original,txt_transform`, "count(*) as total"];
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `select ${v} FROM text_transform where dic_id = ? and ${
          search_key
            ? "txt_original COLLATE UTF8_GENERAL_CI like ? or txt_transform COLLATE UTF8_GENERAL_CI like ?"
            : "true"
        } order by ${order_by.length > 0 ? OrderString : `txt_id asc`} ${
          exportData ? "" : i == 0 ? `limit ${(page - 1) * size},${size}` : ""
        }
                      `,
        [
          dic_id,
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
          `%${search_key || ""}%`,
        ].filter(
          (value) =>
            value !== null &&
            typeof value !== "undefined" &&
            value !== "" &&
            value !== "%%"
        )
      )
    )
  );
};
Model.getTransformID = ({ id }) => {
  return db.queryAsync(
    `
        select * from text_transform where txt_id = ?;
    `,
    [id]
  );
};
Model.editTransformID = (params) => {
  const { txt_original, txt_transform, txt_id } = params;
  const date = getDateTime();
  let updateList = {
    txt_original,
    txt_transform,
  };
  let notNullList = Object.fromEntries(
    Object.entries(updateList).filter(
      ([_, value]) => value !== null && typeof value !== "undefined"
    )
  );
  let updateVariables = Object.keys(notNullList).map((v, i) => `${v}=?`);
  let updateValues = Object.values(notNullList);

  return db.queryAsync(
    `
    UPDATE text_transform set ${updateVariables.join(",")} where txt_id = ?`,
    [...updateValues, txt_id]
  );
};
Model.delTransformID = ({ id }) => {
  return db.queryAsync(
    `
        delete * from text_transform where txt_id = ?;
    `,
    [id]
  );
};
Model.getmodel = (params) => {
  const { model } = params;
  const updateVariables = model.map((d) => {
    return `dictionary.dic_id = ${d}`;
  });

  return db.queryAsync(
    `
    select dictionary.*,text_transform.txt_original,text_transform.txt_transform from dictionary join text_transform on text_transform.dic_id = dictionary.dic_id where ${updateVariables.join(" or ")};
    `
  );
};

module.exports = Model;
