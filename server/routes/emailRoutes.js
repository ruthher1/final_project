const express = require('express');
const router = express.Router();
const emailController= require('../controllers/emailController');

router.post('/send-email', emailController.sendEmailFromClient);
router.post('/send-email-to-client', emailController.sendEmailToClient);


module.exports = router;