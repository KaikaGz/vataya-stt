const event = require("../models/event");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const fs = require("fs");
const fileType = require("file-type");
const { insertLocation } = require("../models/event");

module.exports = {
  getEvent(req, res, next) {
    event
      .getEvent(req.body)
      .then((data) => {
        return res.status(200).json({
          success: true,
          data,
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  getOneLatest(req, res, next) {
    event
      .getOneLatest()
      .then((data) => {
        return res.status(200).json({
          success: true,
          data: {
            armed:
              data.filter((v) => v.name == "armed").length > 0
                ? data.filter((v) => v.name == "armed")[0]
                : null,
            robbery:
              data.filter((v) => v.name == "robbery").length > 0
                ? data.filter((v) => v.name == "robbery")[0]
                : null,
            altercation:
              data.filter((v) => v.name == "altercation").length > 0
                ? data.filter((v) => v.name == "altercation")[0]
                : null,
          },
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  async getDaily(req, res, next) {
    try {
      const [dailyData, [summary]] = await Promise.all(
        event.getDaily(req.body)
      );
      return res.status(200).json({
        success: true,
        data: {
          summary,
          chart_data: dailyData,
        },
      });
    } catch (e) {
      if (e) {
        return res.status(401).json({ success: false, message: e.message });
      }
    }
  },
  async getTodayEventHourly(req, res, next) {
    try {
      const dailyData = await event.getTodayEventHourly();
      return res.status(200).json({
        success: true,
        data: {
          armed: dailyData.map(({ armed, hour }) => ({
            Hour: hour,
            Event: armed,
          })),
          robbery: dailyData.map(({ robbery, hour }) => ({
            Hour: hour,
            Event: robbery,
          })),
          altercation: dailyData.map(({ altercation, hour }) => ({
            Hour: hour,
            Event: altercation,
          })),
        },
      });
    } catch (e) {
      if (e) {
        return res.status(401).json({ success: false, message: e.message });
      }
    }
  },
  async post(req, res, next) {
    try {
      const { image, created_at, camera_id, hub_id, class_id } = req.body;
      let location_id = null;
      [foundLocation] = await event.findLocationId({ camera_id, hub_id });
      if (foundLocation) {
        location_id = foundLocation.id;
      } else {
        location_id = (await event.insertLocation({ camera_id, hub_id }))
          .insertId;
      }
      if (image) {
        var data = image.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer.from(data, "base64");
        var ext = image.split(";")[0].match(/jpeg|png|gif/)
          ? image.split(";")[0].match(/jpeg|png|gif/)[0]
          : (await fileType.fromBuffer(buf))["ext"];
        const fileName = `images/${class_id}_${camera_id}_${hub_id}_${created_at}.${ext}`;
        fs.writeFileSync(fileName, buf);
        await event.insert({
          ...req.body,
          location_id,
          image: `/${fileName}`,
        });
      } else {
        await event.insert({ ...req.body, location_id });
      }
      return res.status(httpStatus.CREATED).json({
        success: true,
      });
    } catch (e) {
      if (e) {
        return res.status(401).json({ success: false, message: e.message });
      }
    }
  },
};
