const express = require("express");
const cors = require("cors");

const app = express();

//middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.get("/api/register", (req, res) => {
  res.json({ msg: "data from server success" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
