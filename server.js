const express = require("express");
const cors = require("cors");

const connectDB = require("./db/db-connect");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const linkRoutes = require("./routes/link");

const app = express();

//connect-db
connectDB();

//middleware
app.use(express.json({ extended: false, limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL })); //for specific origins
// app.use(cors()); //for all origins

//routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", linkRoutes);

//#region error-handling
/*
  //for expressJwt --using jsonwebtoken instead

  app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token, Authentication failed");
  }
});
 */
//#endregion

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
