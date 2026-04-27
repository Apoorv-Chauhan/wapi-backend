import axios from "axios";
const BASE_URL = process.env.AISENSY_BASE_URL;
const API_KEY = process.env.AISENSY_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "X-AiSensy-Partner-API-Key": API_KEY,
};

export const createBusiness = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.AISENSY_BASE_URL}/partner-apis/v1/partner/${process.env.AISENSY_PARTNER_ID}/business`,
      {
        display_name: data.display_name,
        email: data.email,
        company: data.company,
        contact: data.contact,
        timezone: "Asia/Calcutta GMT+05:30",
        currency: "INR",
        companySize: "10 - 20",
        password: "Temp@123", // 🔥 REQUIRED
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-AiSensy-Partner-API-Key": process.env.AISENSY_API_KEY,
        },
      },
    );

    return res.data;
  } catch (err) {
    console.error("FULL ERROR:", err);
    throw err;
  }
};

export const createProject = async (businessId, name) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/partner-apis/v1/partner/${process.env.AISENSY_PARTNER_ID}/business/${businessId}/project`,
      {
        name,
      },
      { headers },
    );
    return res.data;
  } catch (err) {
    // console.error("Create Project Error:", err.response?.data);
    console.error("ERROR: 1", err);
    throw err;
  }
};
