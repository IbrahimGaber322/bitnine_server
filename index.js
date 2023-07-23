import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./database/database.js";
import userRoutes from "./routes/user.js";
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/user", userRoutes);

pool
  .connect()
  .then(() => {
    console.log("Pool connection successful!");
  })
  .then(() => {
    app.listen(SERVER_PORT, () =>
      console.log(`Server is connected on ${SERVER_PORT}`)
    );
  });
