import test from "ava";
import { api, baseUrl } from "./helper/index.js";

test("Should get msg", async (t) => {
  const res = await api.get(baseUrl);
  t.is(res.statusCode, 200);
  t.deepEqual(res.body, { msg: "Hello" });
});
