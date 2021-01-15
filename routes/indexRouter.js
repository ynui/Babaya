const express = require('express');
const router = express.Router();
const path = require('path')

// const Utils = require('../src/Utils')
// router.use(Utils.isRequestValid)


/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.get('/test', (req, res, next) => {

});

module.exports = router;
