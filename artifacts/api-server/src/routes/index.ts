import { Router } from "express";
import healthRouter from "./health.js";
import adminRouter from "./admin.js";

const router = Router();

router.use("/", healthRouter);
router.use("/admin", adminRouter);

export default router;
