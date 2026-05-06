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

/**
 * Get all businesses for the partner
 * This allows us to find existing businesses by email
 */
export const getAllBusinesses = async () => {
  try {
    if (!BASE_URL || !process.env.AISENSY_PARTNER_ID || !API_KEY) {
      throw new Error('Missing AISensy configuration');
    }

    const url = `${BASE_URL}/partner-apis/v1/partner/${process.env.AISENSY_PARTNER_ID}/business`;
    
    console.log('🔄 Fetching all AISensy businesses from:', url);

    const res = await axios.get(url, { headers });

    console.log(`✅ Fetched ${res.data?.length || 0} businesses from AISensy`);
    return res.data;
  } catch (err) {
    console.error("❌ Get Businesses Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Find business by email from AISensy
 * Returns the business object if found, null otherwise
 */
export const findBusinessByEmail = async (email) => {
  try {
    const businesses = await getAllBusinesses();
    
    if (!businesses || !Array.isArray(businesses)) {
      console.log('⚠️ No businesses returned from AISensy');
      return null;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const business = businesses.find(b => 
      b.email?.toLowerCase().trim() === normalizedEmail ||
      b.user_name?.toLowerCase().trim() === normalizedEmail
    );

    if (business) {
      console.log(`✅ Found existing business for ${email}:`, {
        businessId: business.business_id || business.id,
        displayName: business.display_name
      });
      return business;
    } else {
      console.log(`⚠️ No existing business found for ${email}`);
      return null;
    }
  } catch (err) {
    console.error(`❌ Error finding business for ${email}:`, err.message);
    throw err;
  }
};

/**
 * Get or create business - tries to find existing first, creates if not found
 */
export const getOrCreateBusiness = async (data) => {
  try {
    // First, try to find existing business
    console.log(`🔍 Checking if business exists for ${data.email}...`);
    const existingBusiness = await findBusinessByEmail(data.email);
    
    if (existingBusiness) {
      console.log(`✅ Using existing business for ${data.email}`);
      return {
        ...existingBusiness,
        businessId: existingBusiness.business_id || existingBusiness.id,
        isExisting: true
      };
    }

    // If not found, create new business
    console.log(`📝 No existing business found, creating new one for ${data.email}`);
    const newBusiness = await createBusiness(data);
    return {
      ...newBusiness,
      isExisting: false
    };
  } catch (err) {
    console.error(`❌ Error in getOrCreateBusiness for ${data.email}:`, err.message);
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

/**
 * Regenerate AISensy JWT Bearer Token
 * @param {string} username - AISensy user email
 * @param {string} password - AISensy user password
 * @param {string} projectId - AISensy project ID
 * @param {boolean} directApi - true = non-expiring token, false = expires in 24hrs
 * @returns {Promise<Object>} - Token response
 */
export const regenerateJWTToken = async (username, password, projectId, directApi = true) => {
  try {
    // Validate inputs
    if (!username || !password || !projectId) {
      throw new Error('Username, password, and projectId are required');
    }

    // Create base64 encoded authorization token
    // Format: username:password:projectId
    const authString = `${username}:${password}:${projectId}`;
    const base64Token = Buffer.from(authString).toString('base64');

    console.log('🔄 Regenerating AISensy JWT token:', {
      username,
      projectId,
      directApi,
      url: `${process.env.AISENSY_DIRECT_BASE_URL}/direct-apis/t1/users/regenrate-token`
    });

    // Call AISensy API to regenerate token
    const response = await axios.post(
      `${process.env.AISENSY_DIRECT_BASE_URL}/direct-apis/t1/users/regenrate-token`,
      {
        direct_api: directApi
      },
      {
        headers: {
          'Authorization': `Bearer ${base64Token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ JWT token regenerated successfully');
    
    return {
      success: true,
      token: response.data.users?.[0]?.token || response.data.token,
      users: response.data.users,
      directApi,
      expiresIn: directApi ? 'Never' : '24 hours'
    };

  } catch (err) {
    console.error("❌ Regenerate JWT Token Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      username,
      projectId
    });
    throw err;
  }
};
