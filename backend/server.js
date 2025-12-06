import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route.js";
import cors from "cors";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://educational-gamification-7df52f.netlify.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/user", userRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/auth0_testing")
  .then(() => {
    console.log("Connected to mongoDB");
    app.listen(3000, () => {
      console.log("Listening to port 3000");
    });
  })
  .catch((error) => {
    console.log("Could not connect to mongo server.");
  });
