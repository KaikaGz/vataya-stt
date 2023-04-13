const express = require("express");
const event = require("../controllers/dictionary");
const { authenticateJwt } = require("../services/authen");
const router = express.Router();

router.route("/").post((req, res) => res.send("test"));
router.route("/getdic/:id").get(authenticateJwt, event.getDicID);
router.route("/getalldic").post(authenticateJwt, event.getAllDic);
router.route("/getdic").get(authenticateJwt, event.getDicTopic);
router.route("/create").post(authenticateJwt, event.createDic);
router.route("/createtransform").post(authenticateJwt, event.createTransform);
router.route("/gettransform").post(authenticateJwt, event.getTransform);
router.route("/gettransform/:id").get(authenticateJwt, event.getTransformID);
router.route("/edittransform").put(authenticateJwt, event.editTransformID);
router.route("/deltransform/:id").put(authenticateJwt, event.delTransformID);

router.route("/getmodel").post(authenticateJwt, event.getmodel);

module.exports = router;
