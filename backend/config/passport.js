const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const fs = require('fs');
// const redis = require('./redis');

module.exports = function (passport) {
  // const ROLES = { admin: 1, staff: 2, registrar: 3, analyst: 4, factory: 5, guild: 6 };

  let opts = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = fs.readFileSync('config/id_rsa');
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      const [foundUser] = await User.findByEmail(payload.user_profile);
      if (foundUser) {
        if (payload.iat < foundUser.last_logout) {
          return done(null, false);
        }
        return done(null, foundUser);
      }
      return done(null, false);
    })
  );
  // Object.keys(ROLES).map((id) => {
  //   passport.use(
  //     ROLES,
  //     new JwtStrategy(opts, (payload, done) => {
  //       User.findById(payload.user_id, (err, user) => {
  //         if (err) {
  //           return done(err, false);
  //         }

  //         if (user) {
  //           return done(null, user);
  //         } else {
  //           return done(null, false);
  //         }
  //       });
  //     })
  //   );
  // });
};
