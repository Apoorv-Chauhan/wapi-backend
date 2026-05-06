import axios from "axios";

const DIRECT_BASE_URL = process.env.AISENSY_DIRECT_BASE_URL || 'https://backend.aisensy.com';

/**
 * Send Text Message (Utility/Service Messages)
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} messageData - Message configuration
 * @returns {Promise<Object>}
 */
export const sendTextMessage = async (token, messageData) => {
  try {
    const { to, text, recipient_type = 'individual' } = messageData;

    // Validate required fields
    if (!to || !text?.body) {
      throw new Error('to and text.body are required');
    }

    console.log('🔄 Sending text message:', {
      to,
      type: 'text',
      url: `${DIRECT_BASE_URL}/direct-apis/t1/messages`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/messages`,
      {
        to,
        type: 'text',
        recipient_type,
        text: {
          body: text.body
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/xml'
        }
      }
    );

    console.log('✅ Text message sent successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Send Text Message Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Send Marketing Message
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} messageData - Message configuration
 * @returns {Promise<Object>}
 */
export const sendMarketingMessage = async (token, messageData) => {
  try {
    const { to, text, recipient_type = 'individual' } = messageData;

    // Validate required fields
    if (!to || !text?.body) {
      throw new Error('to and text.body are required');
    }

    console.log('🔄 Sending marketing message:', {
      to,
      type: 'text',
      url: `${DIRECT_BASE_URL}/direct-apis/t1/marketing_messages`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/marketing_messages`,
      {
        to,
        type: 'text',
        recipient_type,
        text: {
          body: text.body
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/xml'
        }
      }
    );

    console.log('✅ Marketing message sent successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Send Marketing Message Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Mark Message as Read
 * @param {string} token - AISensy JWT Bearer token
 * @param {string} messageId - WhatsApp message ID
 * @returns {Promise<Object>}
 */
export const markMessageAsRead = async (token, messageId) => {
  try {
    if (!messageId) {
      throw new Error('messageId is required');
    }

    console.log('🔄 Marking message as read:', messageId);

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/mark-read`,
      {
        messageId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/xml'
        }
      }
    );

    console.log('✅ Message marked as read successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Mark Message as Read Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      messageId
    });
    throw err;
  }
};

/**
 * Send Media Message (Image, Video, Document, Audio)
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} messageData - Message configuration
 * @returns {Promise<Object>}
 */
export const sendMediaMessage = async (token, messageData) => {
  try {
    const { to, type, media, recipient_type = 'individual' } = messageData;

    // Validate required fields
    if (!to || !type || !media) {
      throw new Error('to, type, and media are required');
    }

    // Validate media type
    const validTypes = ['image', 'video', 'document', 'audio'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid media type. Must be one of: ${validTypes.join(', ')}`);
    }

    console.log('🔄 Sending media message:', {
      to,
      type,
      url: `${DIRECT_BASE_URL}/direct-apis/t1/messages`
    });

    const payload = {
      to,
      type,
      recipient_type
    };

    // Add media object based on type
    payload[type] = media;

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/xml'
        }
      }
    );

    console.log('✅ Media message sent successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Send Media Message Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Send Interactive Message (Buttons, List)
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} messageData - Message configuration
 * @returns {Promise<Object>}
 */
export const sendInteractiveMessage = async (token, messageData) => {
  try {
    const { to, interactive, recipient_type = 'individual' } = messageData;

    // Validate required fields
    if (!to || !interactive) {
      throw new Error('to and interactive are required');
    }

    console.log('🔄 Sending interactive message:', {
      to,
      type: 'interactive',
      url: `${DIRECT_BASE_URL}/direct-apis/t1/messages`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/messages`,
      {
        to,
        type: 'interactive',
        recipient_type,
        interactive
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/xml'
        }
      }
    );

    console.log('✅ Interactive message sent successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Send Interactive Message Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Send Location Message
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} messageData - Message configuration
 * @returns {Promise<Object>}
 */
export const sendLocationMessage = async (token, messageData) => {
  try {
    const { to, location, recipient_type = 'individual' } = messageData;

    // Validate required fields
    if (!to || !location?.latitude || !location?.longitude) {
      throw new Error('to, location.latitude, and location.longitude are required');
    }

    console.log('🔄 Sending location message:', {
      to,
      type: 'location',
      url: `${DIRECT_BASE_URL}/direct-apis/t1/messages`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/messages`,
      {
        to,
        type: 'location',
        recipient_type,
        location
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/xml'
        }
      }
    );

    console.log('✅ Location message sent successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Send Location Message Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};

/**
 * Send Contact Message
 * @param {string} token - AISensy JWT Bearer token
 * @param {Object} messageData - Message configuration
 * @returns {Promise<Object>}
 */
export const sendContactMessage = async (token, messageData) => {
  try {
    const { to, contacts, recipient_type = 'individual' } = messageData;

    // Validate required fields
    if (!to || !contacts || !Array.isArray(contacts)) {
      throw new Error('to and contacts array are required');
    }

    console.log('🔄 Sending contact message:', {
      to,
      type: 'contacts',
      url: `${DIRECT_BASE_URL}/direct-apis/t1/messages`
    });

    const response = await axios.post(
      `${DIRECT_BASE_URL}/direct-apis/t1/messages`,
      {
        to,
        type: 'contacts',
        recipient_type,
        contacts
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/xml'
        }
      }
    );

    console.log('✅ Contact message sent successfully');
    return response.data;

  } catch (err) {
    console.error("❌ Send Contact Message Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
};
