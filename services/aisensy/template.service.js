import axios from "axios";

const DIRECT_BASE_URL = process.env.AISENSY_DIRECT_BASE_URL || 'https://backend.aisensy.com';

/**
 * Create WhatsApp Template in AISensy
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} templateData - Template configuration
 * @returns {Promise<Object>}
 */
export const createTemplate = async (token, templateData) => {
  try {
    const { name, category, language, components } = templateData;

    // Validate required fields
    if (!name || !category || !language || !components) {
      throw new Error('name, category, language, and components are required');
    }

    console.log('🔄 Creating AISensy template:', {
      name,
      category,
      language,
      url: `${DIRECT_BASE_URL}/direct-apis/t1/wa_template`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/wa_template`,
      {
        name,
        category,
        language,
        components
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Template created successfully:', response.data);
    return response.data;

  } catch (err) {
    console.error("❌ Create Template Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Get all templates
 * @param {string} token - AISensy JWT Bearer token
 * @returns {Promise<Object>}
 */
export const getTemplates = async (token) => {
  try {
    console.log('🔄 Fetching templates from AISensy');

    const response = await axios.get(
      `${DIRECT_BASE_URL}/direct-apis/t1/get-templates`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log(`✅ Fetched ${response.data?.length || 0} templates`);
    return response.data;

  } catch (err) {
    console.error("❌ Get Templates Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Get template by ID
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>}
 */
export const getTemplateById = async (token, templateId) => {
  try {
    console.log('🔄 Fetching template:', templateId);

    const response = await axios.get(
      `${DIRECT_BASE_URL}/direct-apis/t1/get-template/${templateId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Template fetched successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Get Template Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      templateId
    });
    throw err;
  }
};

/**
 * Delete template by name
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} templateName - Template name
 * @returns {Promise<Object>}
 */
export const deleteTemplate = async (token, templateName) => {
  try {
    console.log('🔄 Deleting template:', templateName);

    const response = await axios.delete(
      `${DIRECT_BASE_URL}/direct-apis/t1/wa_template/${templateName}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Template deleted successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Delete Template Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      templateName
    });
    throw err;
  }
};

/**
 * Edit/Update template by ID
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} templateId - Template ID
 * @param {Object} templateData - Updated template data
 * @returns {Promise<Object>}
 */
export const editTemplate = async (token, templateId, templateData) => {
  try {
    const { category, components } = templateData;

    // Validate required fields
    if (!category || !components) {
      throw new Error('category and components are required');
    }

    console.log('🔄 Editing AISensy template:', {
      templateId,
      category,
      url: `${DIRECT_BASE_URL}/direct-apis/t1/edit-template/${templateId}`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/edit-template/${templateId}`,
      {
        category,
        components
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Template edited successfully:', response.data);
    return response.data;

  } catch (err) {
    console.error("❌ Edit Template Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      templateId
    });
    throw err;
  }
};

/**
 * Send template message
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} messageData - Message configuration
 * @returns {Promise<Object>}
 */
export const sendTemplateMessage = async (token, messageData) => {
  try {
    const { to, template } = messageData;

    if (!to || !template) {
      throw new Error('to and template are required');
    }

    console.log('🔄 Sending template message:', {
      to,
      templateName: template.name
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/messages/send`,
      {
        to,
        type: 'template',
        template
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Template message sent successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Send Template Message Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};
