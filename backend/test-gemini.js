const dotenv = require('dotenv');
dotenv.config();

const groq = require('./config/openai');

async function test() {
  try {
    console.log('Testing Groq API...');
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say hello in one word' }],
      temperature: 0.7,
    });
    console.log('Success! Response:', response.choices[0].message.content);
  } catch (err) {
    console.error('Groq test failed:', err.message);
  }
}

test();
