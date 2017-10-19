const router = require('express').Router();
const path = require('path');

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/public', 'index.html'));
});

module.exports = router;
