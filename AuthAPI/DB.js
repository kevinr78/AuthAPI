import mongoose, { mongo } from "mongoose";

const DB_Connect = function () {
  try {
    mongoose.connect(process.env.DB_STRING);
    console.log("SuccessFully Connected to DB");
  } catch (error) {
    console.log("Error while connecting to DB");
  }

  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  mongoose.connection.on("disconnected", (err) => {
    console.log("Disconnected from DB");
  });
};

export default DB_Connect;
