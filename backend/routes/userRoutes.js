const express = require('express');
const router = express.Router();
const { allUsers } = require('../controllers/userController');
const { isAuthenticated, isAdmin} = require('../middleware/auth');

// user routes


// /api/allusers
router.get('/allusers', isAuthenticated , allUsers);

module.exports = router;