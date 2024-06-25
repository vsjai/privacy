require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
console.log(process.env.API_KEY);
mongoose
  .connect("mongodb://localhost:27017/userDB")
  .then(function (connection) {
    console.log("connectede Successfully");
  });
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({ email: String, password: String });

userSchema.plugin(encrypt, { secret: process.env.API_KEY, encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app
  .get("/login", function (req, res) {
    res.render("login");
  })
  .post("/login", function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({ email: userName })
      .then(function (user) {
        if (user) {
          if (user.password === password) {
            res.render("secrets");
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  });

app.get("/register", function (req, res) {
  res.render("register");
});
app.post("/register", function (req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  const newUser = User({ email: userName, password: password });
  newUser
    .save()
    .then(function (_) {
      console.log("user save successfully");
      res.render("secrets");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("listening on port 3000");
});
