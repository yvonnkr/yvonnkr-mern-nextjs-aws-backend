const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("Connected to database");
  } catch (err) {
    console.log("Connection to Database failed");
    console.error(err.message);

    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
