/* eslint-disable no-console */
import config from "../config/index.js";
import mongoose from "mongoose";

/* istanbul ignore next */
const uri =
  process.env.NODE_ENV === "test"
    ? config.MONGODB.TEST_URI
    : config.MONGODB.URI;

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb Connection stablished.");
});

/* istanbul ignore next */
connection.on("error", (err) => {
  console.log("Mongodb connection error:", err);
  process.exit(0);
});

export const connect = async () => {
  mongoose.connect(uri);
};
