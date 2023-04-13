const { dic, event } = require("../models");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = {
  getDicID(req, res, next) {
    dic
      .getDic(req.params)
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
  getAllDic(req, res, next) {
    dic
      .getAllDic(req.body, req.user)
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
  createDic(req, res, next) {
    dic
      .insert(req.body, req.user)
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
  getDicTopic(req, res, next) {
    dic
      .getDicTopic()
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
  createTransform(req, res, next) {
    dic
      .createTransform(req.body)
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
  getTransform(req, res, next) {
    dic
      .getTransform(req.body)
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
  getTransformID(req, res, next) {
    dic
      .getTransformID(req.params)
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
  editTransformID(req, res, next) {
    dic
      .editTransformID(req.body)
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
  delTransformID(req, res, next) {
    dic
      .delTransformID(req.params)
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
  getmodel(req, res, next) {
    dic
      .getmodel(req.body)
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
};
