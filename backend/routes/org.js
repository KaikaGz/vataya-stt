const express = require("express");
const event = require("../controllers/org");
const { authenticateJwt } = require("../services/authen");
const router = express.Router();

router.route("/").post((req, res) => res.send("test"));
router.route("/getall").post(authenticateJwt, event.getOrg);
router.route("/getorg/:id").get(authenticateJwt, event.getOrgID);
router.route("/create").post(authenticateJwt, event.createOrg);
router.route("/edit").put(authenticateJwt, event.editOrg);
router.route("/setstatus").put(authenticateJwt, event.status);

module.exports = router;
