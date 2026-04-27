import axios from "axios";

export const sendCampaignMessage = async ({
  campaignName,
  destination,
  userName,
}) => {
  try {
    const res = await axios.post(
      "https://backend.aisensy.com/campaign/t1/api/v2",
      {
        campaignName,
        destination,
        userName,
        templateParams: [userName],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AISENSY_CAMPAIGN_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.data;
  } catch (err) {
    console.error("SEND ERROR:", err.response?.data || err.message);
    throw err;
  }
};
