const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

module.exports = groq;
