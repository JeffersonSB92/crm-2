import { Router } from "express";
import { EmailController } from "../controllers/EmailController";

const router = Router();

router.get("/login", EmailController.login);
router.get("/callback", EmailController.callback);
router.get("/list", EmailController.list);
router.post("/send", EmailController.send);
router.get("/status", EmailController.status);


export default router;
