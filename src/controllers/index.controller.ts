import { Request, Response } from "express";

export const index = (_req: Request, res: Response): Response => {
  return res.json({ msg: "Hello" });
};
