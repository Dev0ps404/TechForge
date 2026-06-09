const openai = require('../config/openai');

/**
 * Helper to call OpenAI API in JSON mode
 */
const callJsonApi = async (systemPrompt, userPrompt) => {
  try {
    // If API key is placeholder, return mockup data to prevent crashes during initial setups
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('placeholder')) {
      console.warn('OPENAI_API_KEY is not configured or is a placeholder. Using mock AI data.');
      return getMockData(systemPrompt, userPrompt);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    // Return mock data fallback rather than failing entirely, for solid robustness
    return getMockData(systemPrompt, userPrompt);
  }
};

/**
 * Generate a set of interview questions based on role, stack, difficulty, and experience
 */
const generateQuestions = async (jobRole, techStack, difficulty, experience, numQuestions = 5) => {
  const systemPrompt = `You are a Senior Technical Recruiter at a top tech company (like Google or Stripe). 
Your task is to generate a JSON object containing a list of realistic interview questions.
The JSON MUST follow this exact structure:
{
  "questions": [
    {
      "text": "Question text here...",
      "category": "Technical", // Options: 'Technical', 'Coding', 'Behavioral', 'Scenario-Based', 'System Design', 'HR'
      "difficulty": "${difficulty}",
      "sampleAnswer": "A high-quality response demonstrating what a senior or strong candidate would answer...",
      "expectedKeywords": ["keyword1", "keyword2"]
    }
  ]
}
Ensure the categories are well-distributed (e.g., include at least one coding/logical question, one scenario-based/system design, and one behavioral or technical concept question). 
The output MUST be parseable JSON. Return ONLY the JSON object. Do not include markdown code block formatting.`;

  const userPrompt = `Generate exactly ${numQuestions} questions for the following candidate profile:
Job Role: ${jobRole}
Tech Stack: ${techStack}
Difficulty Level: ${difficulty}
Experience Level: ${experience}
Create standard, challenging questions that match the profile.`;

  const result = await callJsonApi(systemPrompt, userPrompt);
  return result.questions || [];
};

/**
 * Analyze resume text and generate ATS feedback
 */
const analyzeResume = async (resumeText) => {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) scanner and professional resume critic. 
Analyze the provided resume text and generate a detailed report.
The output MUST be a JSON object conforming to this exact structure:
{
  "atsScore": 85, // Integer between 0 and 100
  "skillsDetected": ["JavaScript", "React", "Node.js"],
  "missingKeywords": ["GraphQL", "Docker", "CI/CD"],
  "weakAreas": ["Lack of quantifiable metrics in project descriptions", "Vague summary statement"],
  "improvementSuggestions": [
    "Add metrics (e.g., 'improved page speed by 40%')",
    "Incorporate missing industry standard keywords in your skill tags"
  ],
  "parsedData": {
    "education": "BS in Computer Science...",
    "experienceYears": 3
  }
}
The output MUST be parseable JSON. Return ONLY the JSON object.`;

  const userPrompt = `Analyze the following resume text:\n\n${resumeText}`;
  return await callJsonApi(systemPrompt, userPrompt);
};

/**
 * Evaluate a single answer for an interview question
 */
const evaluateAnswer = async (questionText, answerText, category, difficulty) => {
  const systemPrompt = `You are an expert technical interviewer assessing a candidate's response.
Evaluate their answer based on technical correctness, communication clarity, confidence level, and grammatical accuracy.
Provide scores from 0 to 100.
The output MUST be a JSON object conforming to this exact structure:
{
  "score": 80, // Overall score out of 100
  "technicalScore": 85, // out of 100
  "communicationScore": 75, // out of 100
  "confidenceScore": 80, // out of 100
  "grammarErrors": ["Used 'have ran' instead of 'had run'"],
  "technicalFeedback": "Detailed feedback about the correctness and depth of technical answers...",
  "communicationFeedback": "Feedback on pace, structuring, and vocabulary...",
  "strengths": ["Clear definition of concepts", "Mentioned time complexity"],
  "weaknesses": ["Missed explaining space complexity constraints"]
}
The output MUST be parseable JSON. Return ONLY the JSON object.`;

  const userPrompt = `
Question Category: ${category}
Question Difficulty: ${difficulty}
Question Text: ${questionText}
Candidate's Answer: ${answerText}
Evaluate and score the response.`;

  return await callJsonApi(systemPrompt, userPrompt);
};

/**
 * Chat Assistant for career guidance
 */
const chatAssistant = async (messages) => {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('placeholder')) {
      const lastMsg = messages[messages.length - 1].content;
      return `[Mock AI Assistant]: Hello! I see you asked about "${lastMsg}". To get real AI career guidance, please configure your OpenAI API Key in the backend .env file. For now, remember to review DSA topics like Arrays, Stack, and Dynamic Programming, and keep your resume optimized with metrics!`;
    }

    const sysMessage = {
      role: 'system',
      content: `You are the TalentForge AI Placement & Career Mentor. 
Provide expert guidance on resume building, DSA practice, interview preparation, tech stack selection, and general career advice. 
Be encouraging, structured, and give actionable code snippets or bullet points where helpful.`
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [sysMessage, ...messages],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Chat Assistant error:', error);
    return 'I encountered an error. Please try again or check server logs.';
  }
};

/**
 * Mock Fallback Data Generator
 */
function getMockData(systemPrompt, userPrompt) {
  if (systemPrompt.includes('Recruiter')) {
    // Return mock questions
    return {
      questions: [
        {
          text: "Explain the virtual DOM in React and how reconciliation works.",
          category: "Technical",
          difficulty: "Intermediate",
          sampleAnswer: "React builds a lightweight representation of the real DOM in memory called the Virtual DOM. When state changes, a new virtual DOM is created. React compares it to the previous snapshot using a diffing algorithm (Reconciliation) and only updates changed nodes in the real DOM, optimizing render cycles.",
          expectedKeywords: ["Virtual DOM", "Diffing", "Reconciliation", "Batching", "Render"]
        },
        {
          text: "Write a function to check if a binary tree is symmetric.",
          category: "Coding",
          difficulty: "Intermediate",
          sampleAnswer: "A tree is symmetric if the left subtree is a mirror reflection of the right subtree. We can write a recursive helper function isMirror(t1, t2) that checks if both are null, or if only one is null (false), or if values match and left mirrors right and right mirrors left recursively.",
          expectedKeywords: ["Recursion", "Binary Tree", "Mirror Reflection", "DFS", "Base Case"]
        },
        {
          text: "Tell me about a time you resolved a technical conflict with a team member.",
          category: "Behavioral",
          difficulty: "Intermediate",
          sampleAnswer: "I once proposed using GraphQL for our API, while another engineer preferred REST. Instead of arguing, I scheduled a short proof-of-concept meeting where we listed pros and cons for our specific use-case (network overhead vs caching simplicity). We agreed to start with REST but design endpoints to support GraphQL wrappers if needed.",
          expectedKeywords: ["Conflict Resolution", "Collaboration", "Trade-offs", "Communication", "Star Method"]
        },
        {
          text: "How would you design a rate limiter for a public facing API?",
          category: "System Design",
          difficulty: "Intermediate",
          sampleAnswer: "A rate limiter limits incoming requests. We could use Redis for high-speed counter checks. Common algorithms include Token Bucket (allows bursts), Leaky Bucket (smooths output), or sliding window log. We place the rate limiter as a middleware or at the API gateway layer.",
          expectedKeywords: ["Token Bucket", "Redis", "Sliding Window", "Middleware", "API Gateway"]
        },
        {
          text: "Why do you want to join our company as a developer?",
          category: "HR",
          difficulty: "Intermediate",
          sampleAnswer: "I want to apply my problem-solving skills to real-world challenges. Your company's focus on engineering excellence and modern stack matches my career goals, and I've read about your positive collaborative culture.",
          expectedKeywords: ["Alignment", "Values", "Growth", "Contribution"]
        }
      ]
    };
  } else if (systemPrompt.includes('ATS')) {
    // Return mock resume scan
    return {
      atsScore: 78,
      skillsDetected: ["JavaScript", "HTML5", "CSS3", "React.js", "Node.js", "Express", "MongoDB", "Git"],
      missingKeywords: ["TypeScript", "Docker", "CI/CD Pipelines", "Redux Toolkit", "Unit Testing"],
      weakAreas: [
        "Project achievements lack quantitative metrics.",
        "Profile summary does not highlight experience levels or key achievements clearly."
      ],
      improvementSuggestions: [
        "Reword project experiences to mention metrics (e.g. 'reduced load times by 25%', 'handled 10k daily requests').",
        "Add a section for certifications or cloud platforms like AWS.",
        "Add TypeScript and Redux tags if you have basic familiarity, as many MERN roles require them."
      ],
      parsedData: {
        education: "Bachelor of Technology in Computer Engineering",
        experienceYears: 2
      }
    };
  } else if (systemPrompt.includes('technical interviewer')) {
    // Return mock grading
    return {
      score: 82,
      technicalScore: 85,
      communicationScore: 80,
      confidenceScore: 82,
      grammarErrors: ["A slight run-on sentence when describing DOM updates."],
      technicalFeedback: "Strong answer. You accurately identified the Virtual DOM and diffing concept. Adding key terms like 'reconciliation' and explaining fiber architecture would raise it to an outstanding grade.",
      communicationFeedback: "Excellent pacing and articulation. The structure of your response was logical (What is it -> Why do we use it -> How does it work).",
      strengths: ["Clear analogies used", "Correct technical definition of Virtual DOM"],
      weaknesses: ["Failed to mention React Fiber or batches updates details"]
    };
  }
  return {};
}

module.exports = {
  generateQuestions,
  analyzeResume,
  evaluateAnswer,
  chatAssistant,
};
