import { config as setEnv } from "dotenv";

setEnv();

/* c8 ignore next 18*/
export default {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    REGION: process.env.AWS_REGION || "",
    BUCKET: process.env.AWS_BUCKET || "",
  },
  MONGODB: {
    URI: process.env.MONGODB_URI || "mongodb://localhost/tenarix",
    TEST_URI:
      process.env.MONGODB_URI_TEST || "mongodb://localhost/tenarix-test",
  },
  CORS: {
    ORIGIN: ["*", "http://localhost:3000"],
  },
};
