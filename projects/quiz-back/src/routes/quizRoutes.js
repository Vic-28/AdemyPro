const express = require('express');
const { getAllQuizzes, getRandomQuiz } = require('../controllers/quizController');

const router = express.Router();

router.get('/quizzes', getAllQuizzes); 
router.get('/quizzes/random', getRandomQuiz); 

module.exports = router;
