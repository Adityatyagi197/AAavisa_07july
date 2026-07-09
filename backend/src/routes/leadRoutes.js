const express = require('express');
const { getLeads, createLead, assignLead, updateLeadStatus, getLeadById, updateLead, findLeadByEmail, updateMeetingPreference } = require('../controllers/leadController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(authMiddleware, getLeads)
  .post(createLead); // Webhook/Form doesn't need auth

router.post('/assign', authMiddleware, assignLead);
router.post('/status', authMiddleware, updateLeadStatus);

// Public route — no auth needed — for self-fill form
router.get('/find-by-email', findLeadByEmail);

router.route('/:id')
  .get(authMiddleware, getLeadById)
  .put(authMiddleware, updateLead)
  .patch(authMiddleware, updateLead);

// Public route — no auth — lead submits meeting preference form
router.patch('/:id/meeting-preference', updateMeetingPreference);

module.exports = router;

