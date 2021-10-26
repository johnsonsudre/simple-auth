require('dotenv').config()
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/user");

mongoose.Promise = global.Promise;
// const mongoURI = process.env.MONGODB || "mongodb://localhost:27017/bitgol_users";
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/simple-auth-users'
const port = process.env.PORT || 3000;

const app = express();

const content = require("./routes/content");
const projects = require("./routes/projects");
const admin = require("./routes/admin");
const auth = require("./routes/auth");
const cover = require("./routes/cover");
const login = require("./routes/login");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extend: true }));
app.use(session({ secret: "simple-auth"}));


app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.role = req.session.role;
  res.locals.page = "cover";
  res.locals.err = req.session.err;
  next();
});

app.use("/login", login);
app.use("/content", content);
app.use("/projects", projects);
app.use("/admin", admin);
app.use("/auth", auth);
app.use("/", cover);


app.get("/logout", (req, res) => {
  console.log(req.session.user.username,"...bye")
  req.session.destroy(() => {
    res.redirect("/");
  });
});

const checkRootUser = async () => {
  const totalUsers = await User.count({ username: "root" });
  if (totalUsers === 0) {
    const user = new User({
      username: "root",
      password: "123",
      roles: ['admin', 'normal']
    });
    await user.save(() => console.log("root user created"));
  }
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("database connected");
    checkRootUser();
    app.listen(port, () => {
      console.log("listen on", port);
    });
  })
  .catch((err) => console.log(err));
