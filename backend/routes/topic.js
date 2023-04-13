const express = require("express");
const event = require("../controllers/topic");
const { authenticateJwt } = require("../services/authen");
const router = express.Router();

router.route("/test").get((req, res) => {
  console.log("req", req.io);
  res.io.on("connection", (socket) => {
    console.log("dasdasd", socket);
  });
});
router.route("/getall").post(authenticateJwt, event.getTopicList);
router.route("/gettopic").get(authenticateJwt, event.getAllTopic);
router.route("/getdialog").get(authenticateJwt, event.getDialog);
module.exports = router;
