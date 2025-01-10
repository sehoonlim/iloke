const express = require('express');

const Keyword_types = require('./keyword/keyword')
const Keyword_values = require('./keyword/keyValue')

const router = express.Router();

router.use('/', Keyword_types);
router.use('/value', Keyword_values);

module.exports = router;