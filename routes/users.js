const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/usa', (req, res, next) => {
  res.send("<h1>holaa</h1>");
});

module.exports = router;
