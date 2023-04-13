const { topic, event } = require("../models");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = {
  getTopicList(req, res, next) {
    topic
      .getAllList(req.body, req.user)
      .then((d) => {
        let [data, count] = d;
        const [{ total = 0 }] = count;
        const { page = 1, size = 10 } = req.body;
        return res.status(200).json({
          success: true,
          data,
          meta: {
            page: parseInt(page),
            size: parseInt(size),
            total: parseInt(total),
          },
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  getAllTopic(req, res, next) {
    topic
      .getAllTopic()
      .then((data) => {
        return res.status(200).json({
          success: true,
          data: data,
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  getDialog(req, res, next) {
    topic
      .getDialog()
      .then((d) => {
        return res.status(200).json({
          success: true,
          data: d,
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
};
