import mongoose from "mongoose";
import test, { ExecutionContext } from "ava";
import { api, baseUrl, ExtensionModel, upload } from "./helper/index.js";
import { MongoMemoryServer } from "mongodb-memory-server";

test.before(async (t: ExecutionContext<any>) => {
  t.context.mongod = await MongoMemoryServer.create();
  await mongoose.connect(t.context.mongod.getUri());
});

test.after.always(async (t: ExecutionContext<any>) => {
  await ExtensionModel.deleteMany({});
  await mongoose.disconnect();
  await t.context.mongod.stop();
});

test.serial("Should not get extensions", async (t) => {
  const res = await api.get(baseUrl + "/extension/all");
  t.is(res.status, 404);
  t.false(res.body.ok);
  t.is(res.body.msg, "No extensions found");
});

test.serial("Should upload extension", async (t) => {
  const res = await upload("/extension/add", "1.0.0", "inmanga-secret");
  t.is(res.status, 200);
  t.is(res.body.msg, "Extension uploaded successfully!");
  t.true(res.body.ok);
});

test.serial("Should upload new extension version", async (t) => {
  const res = await upload("/extension/add", "1.0.2", "inmanga-secret");
  t.is(res.status, 200);
  t.is(res.body.msg, "Extension uploaded successfully!");
  t.true(res.body.ok);
});

test.serial("Should fail to upload extension (missing field)", async (t) => {
  const res = await upload("/extension/add", "1.0.1", "");
  t.is(res.status, 400);
  t.is(res.body.msg, "Missing required fields");
  t.false(res.body.ok);
});

test.serial("Should fail to upload extension (wrong secret)", async (t) => {
  const res = await upload("/extension/add", "1.0.3", "idk");
  t.is(res.status, 400);
  t.is(res.body.msg, "Invalid secret");
  t.false(res.body.ok);
});

test.serial("Should fail to upload extension (missing file)", async (t) => {
  const res = await upload(
    "/extension/add",
    "1.0.1",
    "imanaga-secret",
    false,
    true
  );
  t.is(res.status, 500);
});

test.serial("Should fail to upload extension (invalid file)", async (t) => {
  const res = await upload("/extension/add", "1.0.1", "inmanga-secret", true);
  t.is(res.status, 400);
  t.is(res.body.msg, "Invalid file type");
  t.false(res.body.ok);
});

test.serial("Should fail to upload extension (same version)", async (t) => {
  const res = await upload("/extension/add", "1.0.0", "inmanga-secret");
  t.is(res.status, 400);
  t.is(res.body.msg, "Extension version already exists");
  t.false(res.body.ok);
});

test.serial("Should get all extensions", async (t) => {
  const res = await api.get(baseUrl + "/extension/all");
  t.is(res.status, 200);
  t.true(res.body.ok);
  t.is(res.body.data instanceof Array, true);
});

test.serial("Should get one extension (by name)", async (t) => {
  const res = await api.get(baseUrl + "/extension/inmanga");
  t.is(res.status, 200);
  t.true(res.body.ok);
  t.true(res.body.data !== undefined);
});

test.serial("Should not get extension (by name)", async (t) => {
  const res = await api.get(baseUrl + "/extension/inmanga_idk");
  t.is(res.status, 404);
  t.false(res.body.ok);
  t.is(res.body.msg, "Extension not found");
});

test.serial("Should get one extension (by name and version)", async (t) => {
  const res = await api.get(baseUrl + "/extension/inmanga/1.0.0");
  t.is(res.status, 200);
  t.true(res.body.ok);
  t.true(res.body.data !== undefined);
});

test.serial("Should not get extension (by name and version)", async (t) => {
  const res = await api.get(baseUrl + "/extension/inmanga/2.0.0");
  t.is(res.status, 404);
  t.false(res.body.ok);
  t.is(res.body.msg, "Extension version not found");
});
