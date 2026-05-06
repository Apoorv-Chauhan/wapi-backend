import express from "express";
import multer from "multer";
import { onboardClient } from "../controllers/aisensy.controller.js";
import { createWabaLink } from "../controllers/aisensy-waba.controller.js";
import {
  checkWabaStatus,
  handleWebhook,
} from "../controllers/aisensy-webhook.controller.js";
import { sendMessage } from "../controllers/aisensy-message.controller.js";
import { authenticateUser } from "../middlewares/auth.js";
import { checkAISensyConfig } from "../services/aisensy/aisensy.service.js";
import { regenerateToken, getTokenInfo } from "../controllers/aisensy-token.controller.js";
import templateRoutes from "./aisensy/template.routes.js";
import messagingRoutes from "./aisensy/messaging.routes.js";
import flowRoutes from "./aisensy/flow.routes.js";

const router = express.Router();
const upload = multer(); // 👈 important

// Diagnostic endpoint to check AISensy configuration
router.get("/config-check", authenticateUser, (req, res) => {
  try {
    const configStatus = checkAISensyConfig();
    return res.json({
      success: true,
      ...configStatus
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check AISensy configuration',
      error: error.message
    });
  }
});

// Token management endpoints
router.post("/regenerate-token", authenticateUser, regenerateToken);
router.get("/token-info", authenticateUser, getTokenInfo);

// Template management endpoints
router.use("/templates", templateRoutes);

// Messaging endpoints
router.use("/messages", messagingRoutes);

// Flow management endpoints
router.use("/flows", flowRoutes);

// Existing endpoints
router.post("/onboard", upload.none(), onboardClient);
router.post("/generate-waba-link", authenticateUser, createWabaLink);
router.post("/webhook/aisensy", handleWebhook);
router.post("/status", checkWabaStatus);
router.post("/send-message", sendMessage); // optional endpoint to test message sending

export default router;
