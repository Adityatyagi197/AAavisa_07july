const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Meta / WhatsApp / Instagram
router.get('/meta', webhookController.verifyMetaWebhook);
router.post('/meta', webhookController.verifyMetaSignature, webhookController.handleMetaWebhook);

// Stripe (Needs raw body for signature validation)
router.post('/stripe', express.raw({ type: 'application/json' }), webhookController.handleStripeWebhook);

// TikTok etc.
router.post('/tiktok', webhookController.handleTikTokWebhook);

module.exports = router;
