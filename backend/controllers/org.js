const { org, event } = require("../models");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = {
  getOrg(req, res, next) {
    org
      .getAllOrg(req.body, req.user)
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
  getOrgID(req, res, next) {
    org
      .getID(req.params)
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
  createOrg(req, res, next) {
    org
      .insert(req.body, req.user)
      .then(() => {
        // event.saveLogHistory("update", "user", req.user);
        return res.status(200).json({
          success: true,
          data: req.body,
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  editOrg(req, res, next) {
    org
      .update(req.body)
      .then(() => {
        // event.saveLogHistory("update", "user", req.user);
        return res.status(200).json({
          success: true,
          data: req.body,
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  status(req, res, next) {
    org
      .updateStatus(req.body)
      .then(() => {
        // event.saveLogHistory("update", "user", req.user);
        return res.status(200).json({
          success: true,
          data: req.body,
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
};
