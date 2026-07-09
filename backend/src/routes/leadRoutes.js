const express = require('express');
const { getLeads, createLead, assignLead, updateLeadStatus, deleteLead } = require('../controllers/leadController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(authMiddleware, getLeads)
  .post(createLead); // Webhook/Form doesn't need auth

router.route('/:id')
  .delete(authMiddleware, deleteLead);

router.post('/assign', authMiddleware, assignLead);
router.post('/status', authMiddleware, updateLeadStatus);


module.exports = router;
