import express from 'express';
import {
  createWhatsAppTemplate,
  getAllTemplates,
  getTemplate,
  removeTemplate,
  updateTemplate,
  sendTemplate
} from '../../controllers/aisensy-template.controller.js';

const router = express.Router();

// Template CRUD operations
router.post('/', createWhatsAppTemplate);           // Create template
router.get('/', getAllTemplates);                   // Get all templates
router.get('/:id', getTemplate);                    // Get template by ID
router.put('/:id', updateTemplate);                 // Edit/Update template by ID
router.delete('/:name', removeTemplate);            // Delete template by name

// Send template message
router.post('/send', sendTemplate);                 // Send template message

export default router;
