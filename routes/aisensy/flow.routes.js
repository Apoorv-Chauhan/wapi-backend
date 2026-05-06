import express from 'express';
import {
  getFlows,
  getFlow,
  createNewFlow,
  updateExistingFlow,
  removeFlow,
  getAssets,
  uploadAssets,
  getWebPreview,
  publish,
  deprecate
} from '../../controllers/aisensy-flow.controller.js';

const router = express.Router();

// Flow CRUD operations
router.get('/', getFlows);                          // Get all flows
router.post('/', createNewFlow);                    // Create flow
router.get('/:id', getFlow);                        // Get flow by ID
router.put('/:id', updateExistingFlow);             // Update flow
router.delete('/:id', removeFlow);                  // Delete flow

// Flow assets
router.get('/:id/assets', getAssets);               // Get flow assets
router.post('/:id/assets', uploadAssets);           // Upload flow assets

// Flow preview
router.get('/:id/web-preview', getWebPreview);      // Get flow web preview

// Flow actions
router.post('/:id/publish', publish);               // Publish flow
router.post('/:id/deprecate', deprecate);           // Deprecate flow

export default router;
