import config from "../config/index.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { hash, verify } from "argon2";

const s3 = new S3Client({
  region: config.AWS.REGION,
  credentials: {
    accessKeyId: config.AWS.ACCESS_KEY_ID,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
  },
});

export const encryptSecret = async (secret: string): Promise<string> =>
  await hash(secret);

export const compareSecret = async (
  hash: string,
  secret: string
): Promise<boolean> => await verify(hash, secret);

export const toS3 = (
  buffer: Buffer,
  name: string,
  version: string,
  ext: string,
  mime: string
) => {
  const command = new PutObjectCommand({
    Bucket: config.AWS.BUCKET,
    Key: `extensions/${name}/${name}_${version}.${ext}`,
    Body: buffer,
    /* c8 ignore next */
    ACL: config.NODE_ENV === "test" ? undefined : "public-read",
    ContentType: mime,
    ContentLength: buffer.length,
    ContentEncoding: "gzip",
  });

  return s3.send(command);
};
