const pool = require('../config/db');

const getAllQuizzes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quizzes'); // Ajusta según tu tabla
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los quizzes:', error);
    res.status(500).json({ message: 'Error al obtener los quizzes' });
  }
};


const getRandomQuiz = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quizzes');
    const quizzes = result.rows;
    const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    res.status(200).json(randomQuiz);
  } catch (error) {
    console.error('Error al obtener un quiz aleatorio:', error);
    res.status(500).json({ message: 'Error al obtener un quiz aleatorio' });
  }
};

module.exports = {
  getAllQuizzes,
  getRandomQuiz,
};
