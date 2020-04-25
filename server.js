const express = require("express");
const cors = require("cors");

const connectDB = require("./db/db-connect");
const authRoutes = require("./routes/auth");

const app = express();

//connect-db
connectDB();

//middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
