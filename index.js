require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const eventRoute = require("./routes/event.route");
const adminRoute = require("./routes/admin.route");
const port = process.env.PORT || 3001;
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/events", eventRoute);
app.use("/api/admin", adminRoute);

mongoose
  .connect(
    "mongodb+srv://client:client123@eventmanagement.t9xzgqk.mongodb.net/?retryWrites=true&w=majority&appName=eventManagement"
  )
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log(`⚙️ Server has started on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection to the database failed");
  });
