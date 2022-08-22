import config from "../config/index.js";
import { compareSecret, encryptSecret, toS3 } from "../lib/index.js";
import { fileTypeFromBuffer } from "file-type";
import { Request, Response } from "express";
import { ExtensionModel } from "../models/index.js";

export const add = async (req: Request, res: Response): Promise<Response> => {
  const { name, version, lang, secret, description, homepage, readme, author } =
    req.body;

  if (!name || !version || !lang || !secret) {
    return res.status(400).json({
      msg: "Missing required fields",
      ok: false,
    });
  }

  const buffer = req.file?.buffer as Buffer;

  const ext = await fileTypeFromBuffer(buffer);

  /* c8 ignore next */
  if (ext?.ext !== "zip" && ext?.ext !== "tar" && ext?.ext !== "gz") {
    return res.status(400).json({
      msg: "Invalid file type",
      ok: false,
    });
  }

  const tarball = `https://${config.AWS.BUCKET}.s3.us-east-2.amazonaws.com/extensions/${name}/${name}_${version}.${ext?.ext}`;

  const extensionQ = (await ExtensionModel.findOne({ name })) || null;

  if (!extensionQ) {
    const secret_ = await encryptSecret(secret);
    const extension = new ExtensionModel({
      name,
      versions: {
        [version]: {
          description,
          tarball,
          homepage,
          readme,
        },
      },
      lang,
      latest: version,
      secret: secret_,
      author,
    });
    await extension.save();
  } else {
    const same = Object.keys(extensionQ.versions).includes(version);

    if (same) {
      return res.status(400).json({
        msg: "Extension version already exists",
        ok: false,
      });
    }
    const valid = await compareSecret(extensionQ.secret, secret);
    if (!valid) {
      return res.status(400).json({
        msg: "Invalid secret",
        ok: false,
      });
    }
    extensionQ.versions = {
      ...extensionQ.versions,
      [version]: {
        description,
        tarball,
        homepage,
        readme,
      },
    };

    extensionQ.lang = lang;
    extensionQ.author = author;
    extensionQ.latest = version;
    await extensionQ.save();
  }
  try {
    const data = await toS3(buffer, name, version, ext?.ext, ext?.mime);
    /* c8 ignore next 6 */
    if (!data.ETag) {
      return res.status(500).json({
        msg: "Failed to upload extension",
        ok: false,
      });
    }
    return res.json({ ok: true, msg: "Extension uploaded successfully!" });
    /* c8 ignore next 7*/
  } catch (error: any) {
    return res.status(500).json({
      msg: error.message,
      ok: false,
    });
  }
};

export const getAll = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const extensions = await ExtensionModel.find();

  if (extensions.length < 1) {
    return res.status(404).json({
      msg: "No extensions found",
      ok: false,
    });
  }

  const data = extensions.map((extension) => {
    return {
      author: extension.author,
      name: extension.name,
      description: extension.description,
      versions: extension.versions,
      lang: extension.lang,
      latest: extension.latest,
    };
  });

  return res.json({ ok: true, data });
};

export const getOne = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, version } = req.params;

  const extension = await ExtensionModel.findOne({ name });

  if (!extension) {
    return res.status(404).json({
      msg: "Extension not found",
      ok: false,
    });
  }

  if (!version) {
    return res.json({
      ok: true,
      data: {
        author: extension.author,
        name: extension.name,
        description: extension.description,
        versions: extension.versions,
        lang: extension.lang,
        latest: extension.latest,
      },
    });
  }

  const data = extension.versions[version];

  if (!data) {
    return res.status(404).json({
      msg: "Extension version not found",
      ok: false,
    });
  }
  return res.json({
    ok: true,
    data: {
      author: extension.author,
      name: extension.name,
      lang: extension.lang,
      version,
      ...data,
    },
  });
};
