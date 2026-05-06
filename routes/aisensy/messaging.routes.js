import express from 'express';
import {
  sendText,
  sendMarketing,
  markRead,
  sendMedia,
  sendInteractive,
  sendLocation,
  sendContact
} from '../../controllers/aisensy-messaging.controller.js';

const router = express.Router();

// Text messaging
router.post('/text', sendText);                     // Send text message (utility/service)
router.post('/marketing', sendMarketing);           // Send marketing message

// Message management
router.post('/mark-read', markRead);                // Mark message as read

// Media messaging
router.post('/media', sendMedia);                   // Send media (image, video, document, audio)

// Interactive messaging
router.post('/interactive', sendInteractive);       // Send interactive message (buttons, list)

// Location messaging
router.post('/location', sendLocation);             // Send location message

// Contact messaging
router.post('/contact', sendContact);               // Send contact message

export default router;
