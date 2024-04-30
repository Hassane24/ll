var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var usersRouter = require("./routes/users");
var indexRouter = require("./routes/index");
const catalogRouter = require("./routes/catalog");
const compression = require("compression");
const rateLimiter = require("");
const helmet = require("helmet");
mongoose.set("strictQuery", false);
const dev_db_url =
  "mongodb+srv://hassane:kobecan1@library.mihove4.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
var app = express();

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdeliver.net"],
    },
  })
);
app.use(limiter);
app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
