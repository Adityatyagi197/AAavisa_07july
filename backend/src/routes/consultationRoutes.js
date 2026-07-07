const express = require('express');
const { getConsultations, createConsultation, updateOutcome } = require('../controllers/consultationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(authMiddleware, getConsultations)
  .post(createConsultation); // Public booking link

router.patch('/:id/outcome', authMiddleware, updateOutcome);

module.exports = router;
