const express = require('express')
const router  = express.Router()

const { logStudy, getHistory , deleteHistory} = require('../controllers/studyController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/log', authMiddleware, logStudy);
router.get('/history', authMiddleware, getHistory);
router.delete('/:id', authMiddleware, deleteHistory);

module.exports = router;