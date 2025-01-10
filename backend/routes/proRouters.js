const express = require('express');

const Products = require('./products/Products')

const router = express.Router();

router.use('/', Products);

module.exports = router;