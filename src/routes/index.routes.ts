import { Router } from "express";
import { index } from "../controllers/index.js";
import extension from "./extension.routes.js";

const router = Router();

router.get("/", index);

router.use("/extension", extension);

export default router;
