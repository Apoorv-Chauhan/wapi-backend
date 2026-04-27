// import express from "express";
// import { onboardClient } from "../controllers/aisensy.controller.js";

// const router = express.Router();

// router.post("/onboard", onboardClient);

// export default router;
import express from "express";
import multer from "multer";
import { onboardClient } from "../controllers/aisensy.controller.js";
import { createWabaLink } from "../controllers/aisensy-waba.controller.js";
import {
  checkWabaStatus,
  handleWebhook,
} from "../controllers/aisensy-webhook.controller.js";
import { sendMessage } from "../controllers/aisensy-message.controller.js";

const router = express.Router();
const upload = multer(); // 👈 important

router.post("/onboard", upload.none(), onboardClient);
router.post("/generate-waba-link", createWabaLink);
router.post("/webhook/aisensy", handleWebhook);
router.post("/status", checkWabaStatus);
router.post("/send-message", sendMessage); // optional endpoint to test message sending

export default router;
