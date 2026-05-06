import {
  sendTextMessage,
  sendMarketingMessage,
  markMessageAsRead,
  sendMediaMessage,
  sendInteractiveMessage,
  sendLocationMessage,
  sendContactMessage
} from '../services/aisensy/messaging.service.js';

/**
 * Send Text Message (Utility/Service)
 * POST /api/aisensy/messages/text
 */
export const sendText = async (req, res) => {
  try {
    const { token, to, text, recipient_type } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!to || !text?.body) {
      return res.status(400).json({
        success: false,
        message: 'to and text.body are required'
      });
    }

    const result = await sendTextMessage(token, {
      to,
      text,
      recipient_type
    });

    return res.status(200).json({
      success: true,
      message: 'Text message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending text message:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send text message',
      error: error.message
    });
  }
};

/**
 * Send Marketing Message
 * POST /api/aisensy/messages/marketing
 */
export const sendMarketing = async (req, res) => {
  try {
    const { token, to, text, recipient_type } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!to || !text?.body) {
      return res.status(400).json({
        success: false,
        message: 'to and text.body are required'
      });
    }

    const result = await sendMarketingMessage(token, {
      to,
      text,
      recipient_type
    });

    return res.status(200).json({
      success: true,
      message: 'Marketing message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending marketing message:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send marketing message',
      error: error.message
    });
  }
};

/**
 * Mark Message as Read
 * POST /api/aisensy/messages/mark-read
 */
export const markRead = async (req, res) => {
  try {
    const { token, messageId } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: 'messageId is required'
      });
    }

    const result = await markMessageAsRead(token, messageId);

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: result
    });

  } catch (error) {
    console.error('Error marking message as read:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
};

/**
 * Send Media Message (Image, Video, Document, Audio)
 * POST /api/aisensy/messages/media
 */
export const sendMedia = async (req, res) => {
  try {
    const { token, to, type, media, recipient_type } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!to || !type || !media) {
      return res.status(400).json({
        success: false,
        message: 'to, type, and media are required'
      });
    }

    const result = await sendMediaMessage(token, {
      to,
      type,
      media,
      recipient_type
    });

    return res.status(200).json({
      success: true,
      message: 'Media message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending media message:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send media message',
      error: error.message
    });
  }
};

/**
 * Send Interactive Message (Buttons, List)
 * POST /api/aisensy/messages/interactive
 */
export const sendInteractive = async (req, res) => {
  try {
    const { token, to, interactive, recipient_type } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!to || !interactive) {
      return res.status(400).json({
        success: false,
        message: 'to and interactive are required'
      });
    }

    const result = await sendInteractiveMessage(token, {
      to,
      interactive,
      recipient_type
    });

    return res.status(200).json({
      success: true,
      message: 'Interactive message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending interactive message:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send interactive message',
      error: error.message
    });
  }
};

/**
 * Send Location Message
 * POST /api/aisensy/messages/location
 */
export const sendLocation = async (req, res) => {
  try {
    const { token, to, location, recipient_type } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!to || !location?.latitude || !location?.longitude) {
      return res.status(400).json({
        success: false,
        message: 'to, location.latitude, and location.longitude are required'
      });
    }

    const result = await sendLocationMessage(token, {
      to,
      location,
      recipient_type
    });

    return res.status(200).json({
      success: true,
      message: 'Location message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending location message:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send location message',
      error: error.message
    });
  }
};

/**
 * Send Contact Message
 * POST /api/aisensy/messages/contact
 */
export const sendContact = async (req, res) => {
  try {
    const { token, to, contacts, recipient_type } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!to || !contacts || !Array.isArray(contacts)) {
      return res.status(400).json({
        success: false,
        message: 'to and contacts array are required'
      });
    }

    const result = await sendContactMessage(token, {
      to,
      contacts,
      recipient_type
    });

    return res.status(200).json({
      success: true,
      message: 'Contact message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending contact message:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send contact message',
      error: error.message
    });
  }
};
