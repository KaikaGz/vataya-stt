const db = require("../config/pgp");
const mysql = require("mysql");
const Model = {};
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const dayjsRelativeTime = require("dayjs/plugin/relativeTime");
const advancedFormat = require("dayjs/plugin/advancedFormat");
require("dayjs/locale/th");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(dayjsRelativeTime);
dayjs.extend(advancedFormat);

let tzLocal = dayjs.tz.guess();
dayjs.tz.setDefault(tzLocal);

Model.getEvent = (data) => {
  const {
    page = 1,
    limit = 10,
    class_id,
    camera_id,
    hub_id,
    confidence,
    date,
  } = data;
  let min = null,
    max = null;
  if (date) {
    [min, max] = date;
  }
  let queries = [
    `m.id,cast(m.confidence*100 as decimal(5,2)) as confidence,m.image, m.location_id, m.class_id, m.created_at, l.camera_id, l.hub_id, c.name`,
    "count(*) as total",
  ];
  return Promise.all(
    queries.map((v, i) =>
      db.queryAsync(
        `
    select ${v} from model_results m left join locations l on m.location_id=l.id left join classes c on m.class_id=c.id
    where ${camera_id ? "l.camera_id=?" : "true"} and ${
          hub_id ? "l.hub_id=?" : "true"
        }
    and ${class_id >= 0 ? "m.class_id=?" : "true"} and ${
          confidence ? "m.confidence>=?" : "true"
        } and ${
          date ? "DATE(m.created_at) BETWEEN ? AND ?" : "true"
        } order by created_at desc
    ${i == 0 ? `limit ${(page - 1) * limit},${limit}` : ""}
  `,
        [camera_id, hub_id, class_id, confidence, min, max].filter(
          (value) => value !== null && typeof value !== "undefined"
        )
      )
    )
  );
};

Model.getTodayEventHourly = () => {
  return db.queryAsync(
    `
    SELECT 
    DATE_FORMAT(SEC_TO_TIME(hourly.hour*60*60),'%H:00') as hour,
	sum(case when class_id=2 then 1 else 0 end) as altercation,sum(case when class_id=1 then 1 else 0 end) as robbery,sum(case when class_id=0 then 1 else 0 end) as armed
FROM hourly
LEFT JOIN (select * from model_results WHERE DATE_FORMAT(created_at, '%Y%m%d') = DATE_FORMAT(now(), '%Y%m%d')) m ON hourly.hour=hour(created_at)
GROUP BY hourly.hour
ORDER BY hourly.hour
      `,
    []
  );
};

Model.getOneLatest = () => {
  return db.queryAsync(
    `
    WITH ranked_messages AS (
      SELECT m.*, ROW_NUMBER() OVER (PARTITION BY class_id ORDER BY created_at DESC) AS rn
      FROM model_results AS m
    )
    SELECT cast(confidence*100 as decimal(5,2)) as confidence,image,classes.name, class_id,created_at FROM ranked_messages left join classes on classes.id=class_id WHERE rn = 1;
      `,
    []
  );
};

Model.getDaily = ({ date }) => {
  return [
    db.queryAsync(
      `
      select name as category,DATE_FORMAT(date, '%Y-%m-%d') as day,COALESCE(value,0) as value from (select name,date from (SELECT date FROM dates WHERE date BETWEEN ? AND ?
ORDER BY date) a CROSS JOIN classes) b left join (select count(*) as value,classes.name,DATE_FORMAT(created_at, '%Y-%m-%d') date from model_results left join classes on classes.id=class_id where DATE(created_at) BETWEEN ? AND ? group by classes.name,DATE_FORMAT(created_at, '%Y-%m-%d')) c using (name,date);
    `,
      [...date, ...date]
    ),
    db.queryAsync(
      `
    select count(*) as total,COALESCE(sum(case when class_id=2 then 1 else 0 end),0) as altercation,COALESCE(sum(case when class_id=1 then 1 else 0 end),0) as robbery,COALESCE(sum(case when class_id=0 then 1 else 0 end),0) as armed from model_results where DATE(created_at) BETWEEN ? AND ?;
    `,
      date
    ),
  ];
};

Model.insert = (data) => {
  const { confidence, location_id, image, class_id, created_at } = data;
  let updateList = {
    confidence,
    location_id,
    image,
    class_id,
    created_at: mysql.raw(`FROM_UNIXTIME(${created_at})`),
  };
  let notNullList = Object.fromEntries(
    Object.entries(updateList).filter(
      ([_, value]) => value !== null && typeof value !== "undefined"
    )
  );
  let insertColumns = Object.keys(notNullList);
  // let insertValues = Object.keys(notNullList).map((_, i) => `\$${i + 1}`);
  return db.queryAsync(
    `
    INSERT INTO model_results(${insertColumns.join(",")}) VALUES (${Array(
      insertColumns.length
    )
      .fill("?")
      .join(",")})
      `,
    Object.values(notNullList)
  );
};

Model.findLocationId = ({ camera_id, hub_id }) => {
  return db.queryAsync(
    `
    select * from locations where camera_id=? or hub_id=?;
  `,
    [camera_id, hub_id]
  );
};

Model.insertLocation = ({ camera_id, hub_id }) => {
  return db.queryAsync(
    `
    insert into locations(camera_id,hub_id) values (?,?);
  `,
    [camera_id, hub_id]
  );
};

Model.getDateTime = () => {
  const DateTime = dayjs()
    .tz("Asia/Bangkok")
    .locale("th")
    .format("YYYY-MM-DD HH:mm:ss");
  return DateTime;
};

Model.saveLogHistory = (status, phoneme, { user_id, fullname }) => {
  const detail = `${fullname} ${status} ${phoneme}`;
  const date = dayjs()
    .tz("Asia/Bangkok")
    .locale("th")
    .format("YYYY-MM-DD HH:mm:ss");
  createHistory = {
    status: status, //create, update, delete
    user_id: user_id,
    create_date: date,
    detail: detail,
  };
  //   console.log("createHistory", createHistory);
  let insertColumns = Object.keys(createHistory);
  return db.queryAsync(
    `insert into logHistory(${insertColumns.join(",")}) VALUES (${Array(
      insertColumns.length
    )
      .fill("?")
      .join(",")})`,
    Object.values(createHistory)
  );
};

module.exports = Model;
