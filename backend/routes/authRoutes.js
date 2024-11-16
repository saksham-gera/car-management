const express = require('express');
const { signup, login, verify, extractUser } = require('../controllers/authController');
const router = express.Router();

router.get('/verify', verify, extractUser);
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;