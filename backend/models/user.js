const db = require("../config/pgp");
const bcrypt = require("bcryptjs");
const { getDateTime } = require("./event");
const Model = {};

Model.current = ({ id }) => {
  return db.queryAsync(
    `
    select * from user u where 
    ${id ? "u.id=?" : "true"};
  `,
    [id]
  );
};

Model.findByEmail = ({ email }) => {
  return db.queryAsync(
    `
    select * from user join organization on organization.org_id = user.org where email=? and user_status = 1;
  `,
    [email]
  );
};

Model.logIn = (email) => {
  return db.queryAsync(
    "update user set last_login=now() where email= ? ",
    email
  );
};

Model.logOut = (email) => {
  return db.queryAsync(
    "update user set last_logout=now() where email= ? ",
    email
  );
};

Model.comparePassword = (candidatePassword, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
};

Model.getAllFaculty = () => {
  return db.queryAsync("select * from organization");
};

Model.getOrg = (params) => {
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
    `org_id, org_name, create_date, create_by`,
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
      ${exportData ? "" : i == 0 ? `limit ${(page - 1) * size},${size}` : ""}
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

Model.select = (params, { org_id }) => {
  const {
    page = 1,
    size = 10,
    order_by = [],
    query = {},
    exportData = false,
    organization,
  } = params; // request body
  const { search_key } = query;
  const orderMaps = {};
  const OrderString = order_by
    .map(([key, order]) => `${orderMaps[key] ?? key} ${order}`)
    .join(",");
  let queries = [
    `user_id, fullname, email, org_id, org_name,role, role_name, user_status`,
    "count(*) as total",
  ];
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `
        select ${v} from
        (select * from
        (select *from user join organization on organization.org_id = user.org join role on role.role_id= user.role
        where user_status = 1 ) a
        where org_id = ? and role = 3)a
        where
      ${
        search_key
          ? "fullname COLLATE UTF8_GENERAL_CI like ? or email COLLATE UTF8_GENERAL_CI like ? or org_name COLLATE UTF8_GENERAL_CI like ? or role_name COLLATE UTF8_GENERAL_CI like ?"
          : "true"
      }
      order by
            ${order_by.length > 0 ? OrderString : `fullname asc`} 
      ${exportData ? "" : i == 0 ? `limit ${(page - 1) * size},${size}` : ""}
    `,
        [
          org_id,
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
  // return db.queryAsync(
  //   "select * from user join faculty on faculty.fac_id = user.faculty where user_status = 1 and fac_id = ?;"
  // );
};
Model.selectSuper = (params, { org_id }) => {
  const {
    page = 1,
    size = 10,
    order_by = [],
    query = {},
    exportData = false,
    organization,
  } = params; // request body
  const { search_key } = query;
  const orderMaps = {};
  const OrderString = order_by
    .map(([key, order]) => `${orderMaps[key] ?? key} ${order}`)
    .join(",");
  let queries = [
    `user_id, fullname, email, org_id, org_name,role, role_name, user_status`,
    "count(*) as total",
  ];
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `
        select ${v} from
        (select * from
        (select *from user join organization on organization.org_id = user.org join role on role.role_id= user.role
        where user_status = 1 and status = 1) a
        where role = 2 )a
        where
      ${
        search_key
          ? "fullname COLLATE UTF8_GENERAL_CI like ? or email COLLATE UTF8_GENERAL_CI like ? or org_name COLLATE UTF8_GENERAL_CI like ? or role_name COLLATE UTF8_GENERAL_CI like ?"
          : "true"
      }
      order by
            ${order_by.length > 0 ? OrderString : `fullname asc`} 
      ${exportData ? "" : i == 0 ? `limit ${(page - 1) * size},${size}` : ""}
    `,
        [
          org_id,
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
  // return db.queryAsync(
  //   "select * from user join faculty on faculty.fac_id = user.faculty where user_status = 1 and fac_id = ?;"
  // );
};

Model.insert = (data) => {
  const { fullname, password, email, org, role } = data;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const date = getDateTime();

  let updateList = {
    fullname,
    email,
    password: hash,
    role,
    org,
    user_status: 1,
    user_created: date,
  };
  let notNullList = Object.fromEntries(
    Object.entries(updateList).filter(
      ([_, value]) => value !== null && typeof value !== "undefined"
    )
  );
  let insertColumns = Object.keys(notNullList);
  return db.queryAsync(
    `
    INSERT INTO user(${insertColumns.join(",")}) VALUES (${Array(
      insertColumns.length
    )
      .fill("?")
      .join(",")})
      `,
    Object.values(notNullList)
  );
};

Model.update = (data) => {
  const { user_id, fullname, email, role, org = null, user_status } = data;
  let updateList = {
    user_id,
    fullname,
    email,
    role,
    user_status,
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
    UPDATE user
        set ${updateVariables.join(",")}
        where user_id=?
      `,
    [...updateValues, user_id]
  );
};

Model.checkDuplicate = (fullname) => {
  return db.queryAsync(
    `
    select * from user where fullname=? and user_status = 1;
  `,
    [fullname]
  );
};

Model.deleteOrg = (data) => {
  const { org_id } = data;
  return db.queryAsync(
    `
    delete from organization where org_id = ?;
  `,
    [org_id]
  );
};

Model.getID = (data) => {
  const { user_id } = data;
  return db.queryAsync(
    `
    select * from user where user_id = ?;
  `,
    [user_id]
  );
};
Model.getOrgID = (data) => {
  const { org_id } = data;
  return db.queryAsync(
    `
    select * from organization where org_id = ?;
  `,
    [org_id]
  );
};

Model.getRole = (data) => {
  return db.queryAsync(
    `
    select * from role where role_id != 3
    `
  );
};

Model.getRoleAdmin = (data, { role }) => {
  if (role == 1) {
    return db.queryAsync(
      `
      select * from role where role_id != 3 and role_id != 1
      `
    );
  } else if (role == 2) {
    return db.queryAsync(
      `
      select * from role where role_id = 3
      `
    );
  }
};

Model.insertOrg = (data, { fullname }) => {
  const { org_name } = data;
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.toLocaleTimeString("th-TH");
  let updateList = {
    org_name,
    create_by: fullname,
    create_date: date,
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

Model.updateOrg = (data, { fullname }) => {
  const { org_id, org_name } = data;
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.toLocaleTimeString("th-TH");
  let updateList = {
    org_id,
    org_name,
    create_by: fullname,
    create_date: date,
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

Model.resetPassID = (id) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("12345678", salt);
  return db.queryAsync(
    `
    UPDATE user
        set password = ?
        where user_id=?
      `,
    [hash, id]
  );
};

Model.editUserPassword = (data, { user_id }) => {
  const { fullname, email, password } = data;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  let updateList = {
    fullname,
    email,
    password: hash,
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
    UPDATE user
        set ${updateVariables.join(",")}
        where user_id=?
      `,
    [...updateValues, user_id]
  );
};

Model.editUserProfile = (data, { user_id }) => {
  const { fullname, email } = data;
  let updateList = {
    fullname,
    email,
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
    UPDATE user
        set ${updateVariables.join(",")}
        where user_id=?
      `,
    [...updateValues, user_id]
  );
};
// -------------new
Model.getAllUser = (params, { role, org, user_id }) => {
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
    `user_id, fullname, email, org_id, org_name,role, role_name, user_status`,
    "count(*) as total",
  ];
  return Promise.all(
    (exportData ? queries.slice(0, 1) : queries).map((v, i) =>
      // where user_status = 1 and fac_id = ?) a
      db.queryAsync(
        `
        select ${v} from
        (select * from
        (select * from user join organization on organization.org_id = user.org join role on role.id = user.role
        where user_status = 1) a
        where ${
          role == 1
            ? `role != 3 and user_id != ${user_id}`
            : role == 2
            ? `role != 1 and org = ${org} and user_id != ${user_id}`
            : "true"
        } )a
        where
      ${
        search_key
          ? "fullname COLLATE UTF8_GENERAL_CI like ? or email COLLATE UTF8_GENERAL_CI like ? or org_name COLLATE UTF8_GENERAL_CI like ? or role_name COLLATE UTF8_GENERAL_CI like ?"
          : "true"
      }
      order by
            ${order_by.length > 0 ? OrderString : `fullname asc`} 
      ${exportData ? "" : i == 0 ? `limit ${(page - 1) * size},${size}` : ""}
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

Model.delete = (data) => {
  const { user_id } = data;
  return db.queryAsync(
    `
      UPDATE user SET user_status=0 where user_id=?
    `,
    [user_id]
  );
};

Model.getAllRole = ({ role }) => {
  return db.queryAsync(
    `
        select * from role where ${
          role == 2 ? "id=3" : role == 1 ? "id=2 or id=1" : "false"
        }
    `
  );
};

Model.getAllOrg = ({ role, org }) => {
  return db.queryAsync(
    `
        select * from organization where ${
          org == 1 && role == 1 ? "true" : "false"
        }
    `
  );
};

Model.getUserByID = ({ id }) => {
  return db.queryAsync(
    `
          select * from user where user_id=?
      `,
    [id]
  );
};

module.exports = Model;
