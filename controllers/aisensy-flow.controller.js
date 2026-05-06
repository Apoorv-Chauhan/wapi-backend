import {
  getAllFlows,
  getFlowById,
  createFlow,
  updateFlow,
  deleteFlow,
  getFlowAssets,
  uploadFlowAssets,
  getFlowWebPreview,
  publishFlow,
  deprecateFlow
} from '../services/aisensy/flow.service.js';

/**
 * Get All Flows
 * GET /api/aisensy/flows
 */
export const getFlows = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required as query parameter'
      });
    }

    const result = await getAllFlows(token);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching flows:', error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch flows',
      error: error.message
    });
  }
};

/**
 * Get Flow by ID
 * GET /api/aisensy/flows/:id
 */
export const getFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required as query parameter'
      });
    }

    const result = await getFlowById(token, id);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching flow:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
      message: 'Failed to fetch flow',
      error: error.message
    });
  }
};

/**
 * Create Flow
 * POST /api/aisensy/flows
 */
export const createNewFlow = async (req, res) => {
  try {
    const { token, ...flowData } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    if (!flowData.name || !flowData.categories) {
      return res.status(400).json({
        success: false,
        message: 'name and categories are required'
      });
    }

    const result = await createFlow(token, flowData);

    return res.status(201).json({
      success: true,
      message: 'Flow created successfully',
      data: result
    });

  } catch (error) {
    console.error('Error creating flow:', error);

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
        message: 'Invalid flow data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create flow',
      error: error.message
    });
  }
};

/**
 * Update Flow
 * PUT /api/aisensy/flows/:id
 */
export const updateExistingFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const { token, ...flowData } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    const result = await updateFlow(token, id, flowData);

    return res.status(200).json({
      success: true,
      message: 'Flow updated successfully',
      data: result
    });

  } catch (error) {
    console.error('Error updating flow:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
        message: 'Invalid flow data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update flow',
      error: error.message
    });
  }
};

/**
 * Delete Flow
 * DELETE /api/aisensy/flows/:id
 */
export const removeFlow = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required in request body'
      });
    }

    const result = await deleteFlow(token, id);

    return res.status(200).json({
      success: true,
      message: 'Flow deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Error deleting flow:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
      message: 'Failed to delete flow',
      error: error.message
    });
  }
};

/**
 * Get Flow Assets
 * GET /api/aisensy/flows/:id/assets
 */
export const getAssets = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required as query parameter'
      });
    }

    const result = await getFlowAssets(token, id);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching flow assets:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
      message: 'Failed to fetch flow assets',
      error: error.message
    });
  }
};

/**
 * Upload Flow Assets
 * POST /api/aisensy/flows/:id/assets
 */
export const uploadAssets = async (req, res) => {
  try {
    const { id } = req.params;
    const { token, ...assetData } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    const result = await uploadFlowAssets(token, id, assetData);

    return res.status(200).json({
      success: true,
      message: 'Flow assets uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('Error uploading flow assets:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
        message: 'Invalid asset data',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to upload flow assets',
      error: error.message
    });
  }
};

/**
 * Get Flow Web Preview
 * GET /api/aisensy/flows/:id/web-preview
 */
export const getWebPreview = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required as query parameter'
      });
    }

    const result = await getFlowWebPreview(token, id);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching flow web preview:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
      message: 'Failed to fetch flow web preview',
      error: error.message
    });
  }
};

/**
 * Publish Flow
 * POST /api/aisensy/flows/:id/publish
 */
export const publish = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    const result = await publishFlow(token, id);

    return res.status(200).json({
      success: true,
      message: 'Flow published successfully',
      data: result
    });

  } catch (error) {
    console.error('Error publishing flow:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
        message: 'Flow cannot be published',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to publish flow',
      error: error.message
    });
  }
};

/**
 * Deprecate Flow
 * POST /api/aisensy/flows/:id/deprecate
 */
export const deprecate = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'AISensy JWT token is required'
      });
    }

    const result = await deprecateFlow(token, id);

    return res.status(200).json({
      success: true,
      message: 'Flow deprecated successfully',
      data: result
    });

  } catch (error) {
    console.error('Error deprecating flow:', error);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flow not found',
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
        message: 'Flow cannot be deprecated',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to deprecate flow',
      error: error.message
    });
  }
};
