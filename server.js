// import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import usersRoutes from "./routes/usersRoutes.js";
// import "dotenv/config";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

//cors middleware
app.use(cors());

//Middleware for JSON parsing

app.use(express.json());

// bank users routes

app.use("/api", usersRoutes);

//Error handling Middleware
app.use(errorHandler);

mongoose.connect(process.env.CONNECT_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Listening on port");
  });
});
