import cors from "cors";
import morgan from "morgan";
import config from "./config/index.js";
import routes from "./routes/index.js";
import express from "express";

const app = express();

app.use(
  cors({
    origin: config.CORS.ORIGIN,
    credentials: true,
  })
);
/* c8 ignore next 3*/
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1", routes);

export default app;
