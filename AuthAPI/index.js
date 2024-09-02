import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB_Connect from "./DB.js";
dotenv.config();

const app = express();

const port = process.env.port || 3000;

app.listen(port, () => {
  DB_Connect();
  console.log(`Server started on port ${port}`);
});
