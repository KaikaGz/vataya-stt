const db = require("../config/pgp");
const mysql = require("mysql");
const { getDateTime } = require("./event");
const Model = {};

Model.getAllOrg = (params, { role, org, user_id }) => {
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
    `org_id, org_name, create_date, create_by,status`,
    "count(*) as total",
  ];
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `select ${v} from organization where
            ${search_key ? "org_name COLLATE UTF8_GENERAL_CI like ?" : "true"}
          order by
            ${order_by.length > 0 ? OrderString : `org_name asc`} 
          ${
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
Model.getID = ({ id }) => {
  return db.queryAsync(
    `
      select * from organization where org_id = ?;
    `,
    [id]
  );
};
Model.insert = (data, { fullname }) => {
  const { org_name } = data;
  const date = getDateTime();

  let updateList = {
    org_name,
    create_by: fullname,
    create_date: date,
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
      INSERT INTO organization(${insertColumns.join(",")}) VALUES (${Array(
      insertColumns.length
    )
      .fill("?")
      .join(",")})
        `,
    Object.values(notNullList)
  );
};
Model.update = (data) => {
  const { org_id, org_name, status } = data;
  let updateList = {
    org_name,
    status,
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
      UPDATE organization
          set ${updateVariables.join(",")}
          where org_id=?
        `,
    [...updateValues, org_id]
  );
};
Model.updateStatus = (data) => {
  console.log("data", data);
  const { org_id, status } = data;
  let updateList = {
    status,
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
        UPDATE organization
            set ${updateVariables.join(",")}
            where org_id=?
          `,
    [...updateValues, org_id]
  );
};

module.exports = Model;
