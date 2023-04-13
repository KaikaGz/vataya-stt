const db = require("../config/pgp");
const mysql = require("mysql");
const { getDateTime } = require("./event");
const Model = {};

Model.getAllList = (params, { role, org, user_id }) => {
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
  let queries = [`topic_id, topic_name`, "count(*) as total"];
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `select ${v} from topic where
                ${
                  search_key
                    ? "topic_name COLLATE UTF8_GENERAL_CI like ?"
                    : "true"
                }
              order by
                ${order_by.length > 0 ? OrderString : `topic_name asc`} 
              ${
                exportData
                  ? ""
                  : i == 0
                  ? `limit ${(page - 1) * size},${size}`
                  : ""
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

Model.getAllTopic = () => {
  return db.queryAsync(
    `
        select * from topic;
    `
  );
};
Model.getDialog = () => {
  return db.queryAsync(
    `
        select  dialog_id as id, dialog_name as content,topic from dialog;
    `
  );
};

module.exports = Model;
