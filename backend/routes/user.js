// REQUIRE CONTROLLER
const express = require("express");
const event = require("../controllers/user");
const validate = require("../middlewares/validate");
const eventValidation = require("../validations/user");
const { authenticateJwt } = require("../services/authen");

const router = express.Router();

router
  .route("/")
  // .get(authenticateJwt, event.get)
  .post(authenticateJwt, validate(eventValidation.post), event.post)
  .put(authenticateJwt, validate(eventValidation.put), event.put);

router.route("/auth").post(validate(eventValidation.logIn), event.logIn);
router.route("/auth/logout").post(authenticateJwt, event.logOut);
router.route("/current").get(authenticateJwt, event.current);
// router.route("/getalluser").post(authenticateJwt, event.getAllUser);
//--new
router.route("/getalluser").post(authenticateJwt, event.getAllUserTest);
router.route("/delete").post(authenticateJwt, event.delete);
router.route("/getallrole").get(authenticateJwt, event.getAllRole);
router.route("/getallorg").get(authenticateJwt, event.getAllOrg);
router.route("/create").post(authenticateJwt, event.post);
router.route("/getuser/:id").get(authenticateJwt, event.getUserByID);
router.route("/edit").put(authenticateJwt, event.put);
router.route("/resetpass").put(authenticateJwt, event.resetPassword);

//--current
router.route("/getbyid").post(authenticateJwt, event.getID);
// router.route("/getallorg").post(authenticateJwt, event.getAllFaculty);
router.route("/checkduplicate").post(authenticateJwt, event.checkDuplicate);

router.route("/getrolecreate").get(authenticateJwt, event.getRoleCreate);

router.route("/editprofile").post(authenticateJwt, event.editProfile);
router.route("/file/:name").get(authenticateJwt, (req, res) => {
  const fileName = req.params.name;
  const directoryPath = "/app" + "/public/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});

module.exports = router;
