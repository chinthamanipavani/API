const express = require('express');
const { searchGitHub, getAllResults } = require('../controllers/resultController');

const router = express.Router();

router.get('/search', searchGitHub);
router.get('/all', getAllResults);

module.exports = router;
