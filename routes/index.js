const express = require('express');
const router = new express.Router();
const indexController = require('../controllers/index');

router.get('/', indexController.index);

module.exports = router;