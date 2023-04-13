const passport = require("passport");
const { user: userModel } = require("../models");

function authenticateJwt(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Missing Authorization Header" });
  }
  passport.authenticate("jwt", async function (err, user, info) {
    if (!user || err) {
      if (req.headers.authorization.indexOf("Basic ") === -1) {
        return res.status(401).send({
          error: {
            code: "INVALID_AUTHORIZATION_CODE",
            message: "Invalid authorization code",
          },
        });
      }
      // verify auth credentials
      const base64Credentials = req.headers.authorization.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      const [email, password] = credentials.split(":");

      const foundUser = await userModel.findByEmail({ email });
      if (foundUser.length > 0) {
        const isMatch = await userModel.comparePassword(
          password,
          foundUser[0].password
        );
        if (isMatch) {
          req.user = foundUser[0];
          next();
        } else {
          return res.status(401).send({
            error: {
              code: "INVALID_AUTHORIZATION_CODE",
              message: "Invalid authorization code",
            },
          });
        }
      } else {
        return res.status(401).send({
          error: {
            code: "INVALID_AUTHORIZATION_CODE",
            message: "Invalid authorization code",
          },
        });
      }
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
}

module.exports = { authenticateJwt };
