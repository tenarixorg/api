/* eslint-disable no-console */
/* c8 ignore next 8*/
import config from "./config/index.js";
import app from "./app.js";
import { connect } from "./database/index.js";

app.listen(config.PORT, async () => {
  console.log(`Local: http://localhost:${config.PORT}/api/v1/`);
  await connect();
});
