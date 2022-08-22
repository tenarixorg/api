import mongoose from "mongoose";
import { Extension } from "../lib/index.js";

const { Schema, model } = mongoose;

const extensionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
    },
    secret: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    versions: {
      type: Object,
      required: true,
    },
    latest: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ExtensionModel = model<Extension>("Extension", extensionSchema);
