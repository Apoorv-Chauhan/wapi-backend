import axios from "axios";
const BASE_URL = process.env.AISENSY_BASE_URL;
const API_KEY = process.env.AISENSY_API_KEY;

const headers = {
  "Content-Type": "application/json",
  "X-AiSensy-Partner-API-Key": API_KEY,
};

/**
 * Check if AISensy configuration is valid
 */
export const checkAISensyConfig = () => {
  const config = {
    hasBaseUrl: !!process.env.AISENSY_BASE_URL,
    hasApiKey: !!process.env.AISENSY_API_KEY,
    hasPartnerId: !!process.env.AISENSY_PARTNER_ID,
    baseUrl: process.env.AISENSY_BASE_URL || 'NOT_SET',
    partnerId: process.env.AISENSY_PARTNER_ID || 'NOT_SET',
  };

  const isValid = config.hasBaseUrl && config.hasApiKey && config.hasPartnerId;

  return {
    isValid,
    config,
    message: isValid 
      ? 'AISensy configuration is valid' 
      : 'AISensy configuration is incomplete'
  };
};

export const createBusiness = async (data) => {
  try {
    // Validate required environment variables
    if (!process.env.AISENSY_BASE_URL) {
      throw new Error('AISENSY_BASE_URL is not configured');
    }
    if (!process.env.AISENSY_PARTNER_ID) {
      throw new Error('AISENSY_PARTNER_ID is not configured');
    }
    if (!process.env.AISENSY_API_KEY) {
      throw new Error('AISENSY_API_KEY is not configured');
    }

    const url = `${process.env.AISENSY_BASE_URL}/partner-apis/v1/partner/${process.env.AISENSY_PARTNER_ID}/business`;
    
    console.log('🔄 Creating AISensy business:', {
      url,
      display_name: data.display_name,
      email: data.email
    });

    const res = await axios.post(
      url,
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

    console.log('✅ AISensy business created successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Create Business Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      data: {
        display_name: data.display_name,
        email: data.email,
        company: data.company
      }
    });
    throw err;
  }
};

export const createProject = async (businessId, name) => {
  try {
    // Validate required environment variables
    if (!BASE_URL || !process.env.AISENSY_PARTNER_ID || !API_KEY) {
      throw new Error('Missing AISensy configuration: BASE_URL, PARTNER_ID, or API_KEY not set');
    }

    if (!businessId) {
      throw new Error('Business ID is required to create a project');
    }

    if (!name) {
      throw new Error('Project name is required');
    }

    console.log('🔄 Creating AISensy project:', {
      businessId,
      name,
      url: `${BASE_URL}/partner-apis/v1/partner/${process.env.AISENSY_PARTNER_ID}/business/${businessId}/project`
    });

    const res = await axios.post(
      `${BASE_URL}/partner-apis/v1/partner/${process.env.AISENSY_PARTNER_ID}/business/${businessId}/project`,
      {
        name,
      },
      { headers },
    );

    console.log('✅ AISensy project created successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Create Project Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      businessId,
      name
    });
    throw err;
  }
};
