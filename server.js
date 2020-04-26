const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./db/db-connect");
const authRoutes = require("./routes/auth");

const app = express();

//connect-db
connectDB();

//middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL })); //for specific origins
app.use(cors()); //for all origins

//routes
app.use("/api", authRoutes);

//error-handling
//for expressJwt --using jsonwebtoken instead
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token, Authentication failed");
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
