import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB_Connect from "./DB.js";
import userAuthRouter from "./routes/User/auth.js";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userAuthRouter);

const port = process.env.port || 3000;

app.use((err, req, res, next) => {
  console.log("Error Handling");
  res.status(err.status).send({ message: err.message });
});

app.listen(port, () => {
  DB_Connect();
  console.log(`Server started on port ${port}`);
});
