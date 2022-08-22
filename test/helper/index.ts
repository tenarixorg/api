import fs from "fs";
import app_ from "../../src/app.js";
import request from "supertest";
import { ExtensionModel } from "../../src/models/index.js";
import { fileURLToPath } from "url";
import { join } from "path";

export const app = app_;
export const api = request(app);
export const baseUrl = "/api/v1";
export { ExtensionModel };

export const upload = (
  url: string,
  version: string,
  secret: string,
  inv?: boolean,
  f?: boolean
) => {
  const __dirname = join(fileURLToPath(import.meta.url), "..");
  const file = fs.readFileSync(
    join(__dirname, `tarball.${inv ? "txt" : "gz"}`)
  );
  return api
    .post(baseUrl + url)
    .attach(!f ? "tarball" : "idk", file, "tarball.gz")
    .field("name", "inmanga")
    .field("lang", "es")
    .field("description", "inmanga extension")
    .field("version", version)
    .field("author", "aku")
    .field("secret", secret)
    .field("readme", "Read me")
    .field("homepage", "https://inmanga.com");
};
