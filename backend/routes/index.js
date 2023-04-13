const express = require("express");
const eventRoute = require("./event");
const userRoute = require("./user");
const orgRoute = require("./org");
const topicRoute = require("./topic");
const dicRoute = require("./dictionary");
const config = require("../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/event",
    route: eventRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/org",
    route: orgRoute,
  },
  {
    path: "/topic",
    route: topicRoute,
  },
  {
    path: "/dic",
    route: dicRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  //   {
  //     path: '/docs',
  //     route: docsRoute,
  //   },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
