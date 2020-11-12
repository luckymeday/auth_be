const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

const cors = require("cors");

const logger = require("morgan");

const passport = require("passport");
require("./helpers/passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
app.use(passport.initialize());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

/* DB Connections */
mongoose
  .connect(mongoURI, {
    // some options to deal with deprecated warning
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Mongoose connected to ${mongoURI}`))
  .catch((err) => console.log(err));

module.exports = app;
