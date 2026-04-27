import AisensyClient from "../models/aisensy-client.model.js";
import { sendCampaignMessage } from "../services/aisensy/sendMessage.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { email, campaignName } = req.body;

    // 1️⃣ Get user
    const user = await AisensyClient.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️⃣ Check WABA connection (VERY IMPORTANT)
    if (!user.isWabaConnected) {
      return res.status(400).json({
        error: "WABA not connected",
      });
    }

    // 3️⃣ Send message
    const response = await sendCampaignMessage({
      campaignName,
      destination: user.phone,
      userName: user.name,
    });

    res.json({
      success: true,
      response,
    });
  } catch (err) {
    res.status(500).json({
      error: "Message failed",
      details: err.message,
    });
  }
};
