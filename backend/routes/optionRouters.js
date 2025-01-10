const express = require('express');

const Option_types = require('./option/option')
const Option_values = require('./option/optionValue')

const router = express.Router();


//  소스 로그 보는곳 이후 주석처리할것
router.use((req, res, next) => {
 
    // console.log(`deps:1->[${req.method}] ${req.url}`);
    next();
});

router.use('/', Option_types);
router.use('/value', Option_values);

module.exports = router;