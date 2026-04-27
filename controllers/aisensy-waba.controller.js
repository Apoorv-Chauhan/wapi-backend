import AisensyClient from "../models/aisensy-client.model.js";
import { generateWabaLink } from "../services/aisensy/waba.service.js";

export const createWabaLink = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      businessId,
      projectId,
      assistantId,
      website,
      address,
      timezone,
    } = req.body;

    if (!email || !businessId) {
      return res.status(400).json({ error: "Email and Business ID are required" });
    }

    // Update or create user in database with the dynamic info
    const user = await AisensyClient.findOneAndUpdate(
      { email },
      {
        name,
        phone,
        company,
        businessId,
        projectId,
        website,
        address,
        timezone,
      },
      { upsert: true, returnDocument: "after" },
    );

    const response = await generateWabaLink({
      businessId: businessId,
      projectId: projectId,
      assistantId: assistantId || process.env.AISENSY_ASSISTANT_ID,
      name: name,
      email: email,
      phone: phone,
      website,
      address,
      timezone,
    });

    const link = response;

    res.json({
      success: true,
      link,
    });
  } catch (err) {
    res.status(500).json({
      error: "WABA link generation failed",
      details: err.message,
    });
  }
};
