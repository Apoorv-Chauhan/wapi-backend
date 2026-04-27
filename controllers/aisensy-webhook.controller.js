import AisensyClient from "../models/aisensy-client.model.js";

export const handleWebhook = async (req, res) => {
  try {
    console.log("WEBHOOK DATA:", req.body);

    const { businessId, status } = req.body;

    if (status === "CONNECTED") {
      await AisensyClient.findOneAndUpdate(
        { businessId },
        { isWabaConnected: true },
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    res.sendStatus(500);
  }
};
export const checkWabaStatus = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await AisensyClient.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      isConnected: user.isWabaConnected,
    });
  } catch (err) {
    res.status(500).json({
      error: "Status check failed",
      details: err.message,
    });
  }
};
