const express = require("express");
const config = require("./config/config");
const morgan = require("./config/morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const httpStatus = require("http-status");
// const bodyParser = require('body-parser');
const cors = require("cors");
// const path = require('path');
const compression = require("compression");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const passport = require("passport");
const fileUpload = require("express-fileupload");

const app = express();
const appSocket = express();
const server = require("http").createServer(appSocket);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// VIEW ENGINE SETUP
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

appSocket.get("/socket.io", (req, res) => {
  res.sendFile(__dirname + "/mocks/index.html");
});

server.listen("6005", () => {
  console.log("connecting socket server");
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});
// io.listen(6005, (data) => {
//   console.log(" app listening on port " + data);
// });
app.use(function (req, res, next) {
  res.io = io;
  next();
});

// //middleware
// app.use("/images", express.static("images"));
// app.use("/uploads", express.static("uploads"));
// app.use(express.static("public"));

// // jwt authentication
app.use(passport.initialize());
require("./config/passport")(passport);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
// CORS Middleware: allow cors requests from any origin and with credentials
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "True");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

// enable cors
app.use(cors());
app.options("*", cors());

//express-fileupload
app.use(fileUpload());

// secured
app.disable("x-powered-by");

// api routes
app.use("/api", routes);
app.use("/api", express.static("public"));
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
