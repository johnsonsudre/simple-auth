const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/user");

mongoose.Promise = global.Promise;
const mongoURI = process.env.MONGODB || "mongodb://localhost:27017/bitgol_users";
const port = process.env.PORT || 3000;

const app = express();

const projects = require("./routes/projects");
const admin = require("./routes/admin");
const auth = require("./routes/auth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extend: true }));
app.use(session({ secret: "bitgol4d"}));

app.use("/projects", projects);
app.use("/admin", admin);
app.use("/", auth);

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

const checkRootUser = async () => {
  const total = await User.count({ username: "root" });
  if (total === 0) {
    const user = new User({
      username: "root",
      password: "123",
    });
    await user.save(() => console.log("root user is created"));
  }
};

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("database connected");
    checkRootUser();
    app.listen(port, () => {
      console.log("listen on", port);
    });
  })
  .catch((err) => console.log(err));
