const { user, event } = require("../models");
const httpStatus = require("http-status");
const logger = require("../config/logger");
const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = {
  async logIn(req, res, next) {
    const [foundUser] = await user.findByEmail(req.body);
    if (foundUser && foundUser.user_status == 1) {
      const { password } = req.body;
      const isMatch = await user.comparePassword(password, foundUser.password);
      if (isMatch) {
        const current_time = new Date().getTime();
        const token = jwt.sign(
          {
            iat: current_time,
            user_profile: {
              id: foundUser.user_id,
              name: foundUser.fullname,
              email: foundUser.email,
              faculty: foundUser.fac_name,
              role: foundUser.role,
            },
          },
          fs.readFileSync("config/id_rsa"),
          {
            expiresIn: "10800", // 3 hrs
          }
        );
        await user.logIn(foundUser.email);
        return res.status(200).json({
          success: true,
          token: "JWT " + token,
          user_profile: {
            id: foundUser.user_id,
            name: foundUser.fullname,
            email: foundUser.email,
            organization: foundUser.org,
            role:
              foundUser.role == 1
                ? "Super Admin"
                : foundUser.role == 2
                ? "Admin"
                : "User",
          },
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Username or Password is wrong!" });
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Username or Password is wrong!" });
    }
  },
  async logOut(req, res, next) {
    user.logOut(req.user.email);
    return res.status(200).json({
      success: true,
    });
  },
  current(req, res, next) {
    user
      .current(req.user || {})
      .then(([data]) => {
        if (data) {
          return res.status(200).json({
            success: true,
            data,
          });
        } else {
          return res.status(200).json({
            success: false,
          });
        }
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  getAllUser(req, res, next) {
    if (req.user.org == 1) {
      user
        .selectSuper(req.body, req.user)
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
    } else {
      user
        .select(req.body, req.user)
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
    }
  },
  async post(req, res, next) {
    const [foundUser] = await user.findByEmail(req.body);
    if (foundUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "invalid email!",
      });
    } else {
      user
        .insert(req.body)
        .then(() => {
          //   event.saveLogHistory("create", "user", req.user);
          return res.status(httpStatus.CREATED).json({
            success: true,
            data: req.body,
            message: "create user success",
          });
        })
        .catch((e) => {
          if (e) {
            return res.status(401).json({ success: false, message: e.message });
          }
        });
    }
  },
  put(req, res, next) {
    user
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
  getID(req, res, next) {
    user
      .getID(req.body)
      .then((data) => {
        return res.status(200).json({
          success: true,
          data: {
            fullname: data[0].fullname,
            email: data[0].email,
            org: data[0].org,
            role: data[0].role,
          },
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  getAllFaculty(req, res, next) {
    user
      .getAllFaculty()
      .then((d) => {
        return res.status(200).json({
          success: true,
          data: d,
        });
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
  checkDuplicate(req, res, next) {
    user
      .checkDuplicate(req.body.fullname)
      .then((data) => {
        if (data?.length ?? 0 != 0) {
          res
            .status(200)
            .json({ check: false, reason: "User name already exists" });
        } else {
          res.status(200).json({ check: true, reason: "Available" });
        }
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  delete(req, res) {
    user
      .delete(req.body)
      .then(() => {
        // event.saveLogHistory("delete", "user", req.user);
        return res.status(200).json({
          success: true,
          message: "ลบข้อมูลสำเร็จ",
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  getAllRole(req, res) {
    user
      .getAllRole(req.user)
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
  getAllOrg(req, res) {
    user
      .getAllOrg(req.user)
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
  getUserByID(req, res) {
    user
      .getUserByID(req.params)
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

  getRoleCreate(req, res) {
    user
      .getRoleAdmin(req.body, req.user)
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
  postOrg(req, res, next) {
    user
      .insertOrg(req.body, req.user)
      .then(() => {
        return res.status(httpStatus.CREATED).json({
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
  putOrg(req, res, next) {
    user
      .updateOrg(req.body, req.user)
      .then(() => {
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
  deleteOrg(req, res, next) {
    user
      .deleteOrg(req.body)
      .then(() => {
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
  getOrgId(req, res, next) {
    user
      .getOrgID(req.body)
      .then((data) => {
        return res.status(200).json({
          success: true,
          data: {
            org_name: data[0].org_name,
          },
        });
      })
      .catch((e) => {
        if (e) {
          return res.status(401).json({ success: false, message: e.message });
        }
      });
  },
  resetPassword(req, res) {
    user
      .resetPassID(req.body.user_id)
      .then(() => {
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
  editProfile(req, res) {
    if (req.body.password) {
      user
        .editUserPassword(req.body, req.user)
        .then((d) => {
          return res.status(200).json({
            success: true,
            user_profile: {
              id: req.user.user_id,
              name: req.body.fullname,
              email: req.body.email,
            },
          });
        })
        .catch((e) => {
          if (e) {
            return res.status(401).json({ success: false, message: e.message });
          }
        });
    } else {
      user
        .editUserProfile(req.body, req.user)
        .then((d) => {
          return res.status(200).json({
            success: true,
            user_profile: {
              id: req.user.user_id,
              name: req.body.fullname,
              email: req.body.email,
            },
          });
        })
        .catch((e) => {
          if (e) {
            return res.status(401).json({ success: false, message: e.message });
          }
        });
    }

    // const [foundUser] = await user.findByEmail(req.body);
    // if (foundUser) {
    //   const { cur_password } = req.body;
    //   const isMatch = await user.comparePassword(
    //     cur_password,
    //     foundUser.password
    //   );
    //   if (isMatch) {
    //     await user.editUserProfile(req.body, req.user);
    //     return res.status(200).json({
    //       success: true,
    //       user_profile: {
    //         id: req.user.user_id,
    //         name: req.body.fullname,
    //         email: req.body.email,
    //       },
    //     });
    //   } else {
    //     return res
    //       .status(401)
    //       .json({ success: false, message: "Username or Password is wrong!" });
    //   }
    // } else {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Username or Password is wrong!" });
    // }
  },
  getAllUserTest(req, res) {
    user
      .getAllUser(req.body, req.user)
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
};
