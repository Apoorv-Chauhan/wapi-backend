import {
  createTemplate,
  getTemplates,
  getTemplateById,
  deleteTemplate,
  editTemplate,
  sendTemplateMessage
} from '../services/aisensy/template.service.js';

/**
 * Create WhatsApp Template
 * POST /api/aisensy/templates
 */
export const createWhatsAppTemplate = async (req, res) => {
  try {
    const { token, name, category, language, components } = req.body;

    // Validate required fields
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required. Use /api/aisensy/regenerate-token to get one.'
      });
    }

    if (!name || !category || !language || !components) {
      return res.status(400).json({
        success: false,
        message: 'name, category, language, and components are required'
      });
    }

    // Create template
    const result = await createTemplate(token, {
      name,
      category,
      language,
      components
    });

    return res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: result
    });

  } catch (error) {
    console.error('Error creating template:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please regenerate your AISensy token.',
        error: error.response?.data
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create template',
      error: error.message
    });
  }
};

/**
 * Get All Templates
 * GET /api/aisensy/templates
 */
export const getAllTemplates = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required as query parameter'
      });
    }

    const result = await getTemplates(token);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching templates:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
};

/**
 * Get Template by ID
 * GET /api/aisensy/templates/:id
 */
export const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required as query parameter'
      });
    }

    const result = await getTemplateById(token, id);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching template:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
        error: error.response?.data
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
      error: error.message
    });
  }
};

/**
 * Delete Template by Name
 * DELETE /api/aisensy/templates/:name
 */
export const removeTemplate = async (req, res) => {
  try {
    const { name } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required in request body'
      });
    }

    const result = await deleteTemplate(token, name);

    return res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Error deleting template:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
        error: error.response?.data
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to delete template',
      error: error.message
    });
  }
};

/**
 * Edit/Update Template by ID
 * PUT /api/aisensy/templates/:id
 */
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { token, category, components } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!category || !components) {
      return res.status(400).json({
        success: false,
        message: 'category and components are required'
      });
    }

    const result = await editTemplate(token, id, { category, components });

    return res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: result
    });

  } catch (error) {
    console.error('Error updating template:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
        error: error.response?.data
      });
    }

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
        message: 'Invalid template data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update template',
      error: error.message
    });
  }
};

/**
 * Send Template Message
 * POST /api/aisensy/templates/send
 */
export const sendTemplate = async (req, res) => {
  try {
    const { token, to, template } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!to || !template) {
      return res.status(400).json({
        success: false,
        message: 'to (phone number) and template are required'
      });
    }

    const result = await sendTemplateMessage(token, { to, template });

    return res.status(200).json({
      success: true,
      message: 'Template message sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error sending template message:', error);

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
      message: 'Failed to send template message',
      error: error.message
    });
  }
};
