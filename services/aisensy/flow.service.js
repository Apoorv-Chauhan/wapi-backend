import axios from "axios";

const DIRECT_BASE_URL = process.env.AISENSY_DIRECT_BASE_URL || 'https://backend.aisensy.com';

/**
 * Get all flows
 * @param {string} token - AISensy JWT Bearer token
 * @returns {Promise<Object>}
 */
export const getAllFlows = async (token) => {
  try {
    console.log('🔄 Fetching all flows from AISensy');

    const response = await axios.get(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log(`✅ Fetched ${response.data?.data?.length || 0} flows`);
    return response.data;

  } catch (err) {
    console.error("❌ Get All Flows Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Get flow by ID
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @returns {Promise<Object>}
 */
export const getFlowById = async (token, flowId) => {
  try {
    console.log('🔄 Fetching flow:', flowId);

    const response = await axios.get(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow fetched successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Get Flow Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};

/**
 * Create flow
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} flowData - Flow configuration
 * @returns {Promise<Object>}
 */
export const createFlow = async (token, flowData) => {
  try {
    const { name, categories } = flowData;

    // Validate required fields
    if (!name || !categories) {
      throw new Error('name and categories are required');
    }

    console.log('🔄 Creating AISensy flow:', {
      name,
      categories,
      url: `${DIRECT_BASE_URL}/direct-apis/t1/flows`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows`,
      flowData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow created successfully:', response.data);
    return response.data;

  } catch (err) {
    console.error("❌ Create Flow Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Update flow
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @param {Object} flowData - Updated flow data
 * @returns {Promise<Object>}
 */
export const updateFlow = async (token, flowId, flowData) => {
  try {
    console.log('🔄 Updating AISensy flow:', {
      flowId,
      url: `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}`
    });

    const response = await axios.put(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}`,
      flowData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow updated successfully:', response.data);
    return response.data;

  } catch (err) {
    console.error("❌ Update Flow Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};

/**
 * Delete flow
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @returns {Promise<Object>}
 */
export const deleteFlow = async (token, flowId) => {
  try {
    console.log('🔄 Deleting flow:', flowId);

    const response = await axios.delete(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow deleted successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Delete Flow Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};

/**
 * Get flow assets
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @returns {Promise<Object>}
 */
export const getFlowAssets = async (token, flowId) => {
  try {
    console.log('🔄 Fetching flow assets:', flowId);

    const response = await axios.get(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}/assets`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow assets fetched successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Get Flow Assets Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};

/**
 * Upload flow assets
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @param {Object} assetData - Asset data
 * @returns {Promise<Object>}
 */
export const uploadFlowAssets = async (token, flowId, assetData) => {
  try {
    console.log('🔄 Uploading flow assets:', flowId);

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}/assets`,
      assetData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow assets uploaded successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Upload Flow Assets Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};

/**
 * Get flow web preview
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @returns {Promise<Object>}
 */
export const getFlowWebPreview = async (token, flowId) => {
  try {
    console.log('🔄 Fetching flow web preview:', flowId);

    const response = await axios.get(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}/web-preview`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow web preview fetched successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Get Flow Web Preview Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};

/**
 * Publish flow
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @returns {Promise<Object>}
 */
export const publishFlow = async (token, flowId) => {
  try {
    console.log('🔄 Publishing flow:', flowId);

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}/publish`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow published successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Publish Flow Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};

/**
 * Deprecate flow
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} flowId - Flow ID
 * @returns {Promise<Object>}
 */
export const deprecateFlow = async (token, flowId) => {
  try {
    console.log('🔄 Deprecating flow:', flowId);

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/flows/${flowId}/deprecate`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Flow deprecated successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Deprecate Flow Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      flowId
    });
    throw err;
  }
};
