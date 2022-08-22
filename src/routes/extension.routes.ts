import { Router } from "express";
import { upload } from "../middlewares/index.js";
import { add, getAll, getOne } from "../controllers/index.js";

const router = Router();

router.get("/all", getAll);

router.get("/:name", getOne);

router.get("/:name/:version", getOne);

router.post("/add", upload.single("tarball"), add);

export default router;
