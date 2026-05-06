import { regenerateJWTToken } from '../services/aisensy/aisensy.service.js';
import { User, Workspace } from '../models/index.js';

/**
 * Regenerate AISensy JWT Bearer Token
 * POST /api/aisensy/regenerate-token
 * 
 * Body:
 * {
 *   "username": "user@example.com",  // Optional - will use logged-in user's email
 *   "password": "password",           // Required
 *   "projectId": "project_id",        // Optional - will use user's first workspace project
 *   "workspaceId": "workspace_id",    // Optional - specify which workspace
 *   "directApi": true                 // Optional - true = non-expiring, false = 24hrs
 * }
 */
export const regenerateToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password, projectId, workspaceId, directApi = true } = req.body;

    // Validate password is provided
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Get user details
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Use provided username or user's email
    const finalUsername = username || user.email;

    // Get project ID
    let finalProjectId = projectId;

    if (!finalProjectId) {
      // Find workspace
      let workspace;
      
      if (workspaceId) {
        workspace = await Workspace.findOne({
          _id: workspaceId,
          user_id: userId,
          deleted_at: null
        }).lean();
      } else {
        // Get first workspace
        workspace = await Workspace.findOne({
          user_id: userId,
          deleted_at: null
        }).sort({ createdAt: -1 }).lean();
      }

      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: 'No workspace found. Please create a workspace first or provide projectId.'
        });
      }

      if (!workspace.aisensy_project_id) {
        return res.status(400).json({
          success: false,
          message: 'Workspace does not have AISensy project ID. Please create a workspace with AISensy integration.'
        });
      }

      finalProjectId = workspace.aisensy_project_id;
    }

    // Regenerate token
    const result = await regenerateJWTToken(
      finalUsername,
      password,
      finalProjectId,
      directApi
    );

    return res.status(200).json({
      success: true,
      message: 'JWT token regenerated successfully',
      data: {
        token: result.token,
        username: finalUsername,
        projectId: finalProjectId,
        directApi: result.directApi,
        expiresIn: result.expiresIn
      }
    });

  } catch (error) {
    console.error('Error regenerating token:', error);
    
    // Handle specific errors
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your password.',
        error: error.response?.data
      });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Project not found in AISensy.',
        error: error.response?.data
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to regenerate token',
      error: error.message
    });
  }
};

/**
 * Get token generation details
 * GET /api/aisensy/token-info
 * 
 * Returns information needed to generate token manually
 */
export const getTokenInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.query;

    // Get user
    const user = await User.findById(userId).select('email name aisensy_business_id').lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get workspaces
    let workspaces;
    if (workspaceId) {
      workspaces = await Workspace.find({
        _id: workspaceId,
        user_id: userId,
        deleted_at: null
      }).select('name aisensy_project_id').lean();
    } else {
      workspaces = await Workspace.find({
        user_id: userId,
        deleted_at: null
      }).select('name aisensy_project_id').lean();
    }

    return res.status(200).json({
      success: true,
      data: {
        username: user.email,
        businessId: user.aisensy_business_id,
        workspaces: workspaces.map(ws => ({
          id: ws._id,
          name: ws.name,
          projectId: ws.aisensy_project_id
        })),
        instructions: {
          step1: 'Use your AISensy password (default: Temp@123)',
          step2: 'Select a workspace with projectId',
          step3: 'Call POST /api/aisensy/regenerate-token with password and optional workspaceId',
          manualGeneration: {
            format: 'username:password:projectId',
            encode: 'Base64 encode the above string',
            endpoint: 'POST https://backend.aisensy.com/direct-apis/t1/users/regenrate-token',
            header: 'Authorization: Bearer <base64_token>'
          }
        }
      }
    });

  } catch (error) {
    console.error('Error getting token info:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get token info',
      error: error.message
    });
  }
};
