import axios from "axios";

export const generateWabaLink = async ({
  businessId,
  projectId,
  assistantId,
  name,
  email,
  phone,
  website,
  address,
  timezone,
}) => {
  try {
    const res = await axios.post(
      `${process.env.AISENSY_BASE_URL}/partner-apis/v1/partner/${process.env.AISENSY_PARTNER_ID}/generate-waba-link`,
      {
        businessId,
        projectId,
        assistantId: assistantId || process.env.AISENSY_ASSISTANT_ID,
        setup: {
          business: {
            name,
            email,
            phone: {
              code: phone?.code || 91,
              number: phone?.number || (typeof phone === "string" ? phone.replace(/^(\+?91)/, "") : ""),
            },
            website: website || "https://your-business-website.com",
            address: {
              streetAddress1: address?.streetAddress1 || "Default Address",
              city: address?.city || "City",
              state: address?.state || "State",
              zipPostal: address?.zipPostal || "000000",
              country: address?.country || "IN",
            },
            timezone: timezone || "UTC+05:30",
          },
          phone: {
            displayName: name,
            category: "OTHER",
            description: "",
          },
        },
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-AiSensy-Partner-API-Key": process.env.AISENSY_API_KEY,
        },
      },
    );
    console.log("WABA RESPONSE:", res.data);

    return res.data;
  } catch (err) {
    console.error("WABA LINK ERROR:", err.response?.data || err.message);
    throw err;
  }
};
