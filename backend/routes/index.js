const express = require('express');
const chatRoutes = require('./chatRoutes');
const uploadRoutes = require('./uploadRoutes');

const router = express.Router();

router.use('/', chatRoutes);
router.use('/', uploadRoutes);

module.exports = router;
