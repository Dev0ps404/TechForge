const genAI = require('../config/openai');

const GEMINI_MODEL = 'gemini-2.0-flash';

/**
 * Helper to check if API key is configured
 */
const isApiKeyConfigured = () => {
  const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  return key && !key.includes('placeholder');
};

/**
 * Helper to call Gemini API and parse JSON response
 */
const callJsonApi = async (systemPrompt, userPrompt) => {
  try {
    if (!isApiKeyConfigured()) {
      console.warn('API key is not configured or is a placeholder. Using mock AI data.');
      return getMockData(systemPrompt, userPrompt);
    }

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini API call failed:', error.message || error);
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
    if (!isApiKeyConfigured()) {
      const lastMsg = messages[messages.length - 1].content;
      return `[Mock AI Assistant]: Hello! I see you asked about "${lastMsg}". To get real AI career guidance, please configure your Gemini API Key in the backend .env file. For now, remember to review DSA topics like Arrays, Stack, and Dynamic Programming, and keep your resume optimized with metrics!`;
    }

    const systemInstruction = `You are the TalentForge AI Placement & Career Mentor. 
Provide expert guidance on resume building, DSA practice, interview preparation, tech stack selection, and general career advice. 
Be encouraging, structured, and give actionable code snippets or bullet points where helpful.`;

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction,
      generationConfig: { temperature: 0.7 },
    });

    // Convert OpenAI-style messages to Gemini chat history
    const history = [];
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg.role === 'user') {
        history.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant') {
        history.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }

    const chat = model.startChat({ history });
    const lastMsg = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMsg);

    return result.response.text();
  } catch (error) {
    console.error('Chat Assistant error:', error.message || error);
    // If the API call fails, fallback to a robust local rule-based helper
    return getMockChatResponse(messages);
  }
};

/**
 * Local fallback chat responses for Career Mentor when OpenAI API fails or has quota issues
 */
function getMockChatResponse(messages) {
  const lastUserMessage = messages[messages.length - 1]?.content || '';
  const query = lastUserMessage.toLowerCase();

  const header = `*(Note: Live AI Advisor is currently offline due to API quota limits. Here is curated expert guidance based on your query:)*\n\n`;

  // 1. MERN / Frontend / Backend / JavaScript
  if (
    query.includes('mern') ||
    query.includes('react') ||
    query.includes('node') ||
    query.includes('mongodb') ||
    query.includes('express') ||
    query.includes('fullstack') ||
    query.includes('full stack') ||
    query.includes('javascript') ||
    query.includes('web')
  ) {
    return header + `### 🚀 Placement Guidance for the MERN Stack

To prepare effectively for MERN stack roles, focus on the following core domains:

1. **React.js (Frontend)**:
   - **Concepts**: Virtual DOM, reconciliation, React Fiber, lifecycle methods vs functional hooks.
   - **Hooks**: Deep dive into custom hooks, and optimizations using \`useMemo\`, \`useCallback\`, and \`useRef\`.
   - **State Management**: Master **Redux Toolkit** and the **Context API** (know when to use which).

2. **Node.js & Express (Backend)**:
   - **Architecture**: Event loop, non-blocking I/O model, and middleware design patterns.
   - **API Best Practices**: RESTful route structures, payload validation (e.g., Joi/Zod), and robust error handling middleware.
   - **Authentication**: Stateful sessions vs stateless **JWT (JSON Web Tokens)**.

3. **MongoDB (Database)**:
   - **Modeling**: Embedding vs referencing documents.
   - **Queries**: Aggregation pipelines for complex data processing.
   - **Performance**: Indexing fields to optimize search queries.

4. **System Integration & Deployment**:
   - Understand **CORS** configuration, rate-limiting, and headers for basic API security.
   - Deploy frontend to Vercel/Netlify and backend to Render/Railway/AWS.`;
  }

  // 2. Resume / ATS / CV / Profile / Portfolio
  if (
    query.includes('resume') ||
    query.includes('ats') ||
    query.includes('cv') ||
    query.includes('profile') ||
    query.includes('portfolio') ||
    query.includes('projects')
  ) {
    return header + `### 📄 Resume & ATS Optimization Guide

To ensure your resume passes both automated screening (ATS) and recruiter reviews, implement these strategies:

1. **Quantify Achievements (Google's X-Y-Z Formula)**:
   - Instead of writing: *"Created a chat app using Socket.io"*
   - Write: *"Developed a real-time chat service using **Socket.io** and **Redis**, reducing messaging latency by **30%** and supporting over **500+ concurrent user connections**."*

2. **ATS Keyword Matching**:
   - Carefully read the job description and extract key skills (e.g., *TypeScript*, *Docker*, *CI/CD*, *Jest*).
   - Ensure these keywords are naturally integrated into your professional experience and skills section.

3. **Format & Layout**:
   - Use a clean, single-column design.
   - Avoid tables, charts, or images which can confuse older ATS parser engines.
   - Export your final copy as a structured PDF.`;
  }

  // 3. DSA / Algorithms / Leetcode / Data Structures
  if (
    query.includes('dsa') ||
    query.includes('algorithm') ||
    query.includes('leetcode') ||
    query.includes('data structure') ||
    query.includes('array') ||
    query.includes('string') ||
    query.includes('tree') ||
    query.includes('graph') ||
    query.includes('stack') ||
    query.includes('queue') ||
    query.includes('dp') ||
    query.includes('greedy')
  ) {
    return header + `### 💻 Data Structures & Algorithms (DSA) Roadmap

For FAANG and high-growth product companies, follow this systematic preparation roadmap:

1. **High-Frequency Topics**:
   - **Arrays & Strings**: Sliding Window, Two Pointers, Prefix Sum.
   - **Linked Lists**: Fast/Slow pointer (cycle detection), reversing.
   - **Trees & Graphs**: Recursion, DFS/BFS traversal, Shortest Path (Dijkstra's).
   - **DP & Greedy**: Memoization, classic problems (0-1 Knapsack, Coin Change, LIS).

2. **Consistency Over Intensity**:
   - Solve 2-3 problems daily instead of cramming 15 on weekends.
   - Complete exactly **30 questions** per category in our practice sheets to build conceptual muscle memory.

3. **Optimizing Solutions**:
   - Always analyze the **Time** and **Space Complexity** (Big O) of your code.
   - Be ready to optimize brute force $O(N^2)$ solutions to $O(N)$ or $O(N \log N)$.`;
  }

  // 4. Interview Preparation / Behavioral / HR / Scenario
  if (
    query.includes('interview') ||
    query.includes('behavioral') ||
    query.includes('hr') ||
    query.includes('scenario') ||
    query.includes('conflict') ||
    query.includes('project')
  ) {
    return header + `### 🤝 Behavioral & HR Interview Preparation

Technical skills get you the interview, but behavioral alignment gets you the offer. Prepare using the **STAR Method**:

1. **STAR Response Structure**:
   - **S - Situation**: Set the context of the problem you faced.
   - **T - Task**: Identify your responsibility or the goal.
   - **A - Action**: Explain the exact steps you took (emphasize *your* contribution).
   - **R - Result**: Deliver the outcome with numbers/metrics.

2. **Prepare Core Stories**:
   - A time you resolved a conflict with a teammate.
   - A time you took ownership or lead a project.
   - A time you failed and what you learned from it.
   - How you handled a tight deadline or shifting priorities.`;
  }

  // 5. General Placement & Career Advice (Default)
  return header + `### 💡 Placement Preparation Strategy

Here is a structured overview of what you should prioritize right now:

1. **DSA Core Mastery**:
   - Work through the curated sheets on our platform (aim for 30 questions in Arrays, Linked Lists, Stack, and Graphs).
   
2. **Project Portfolio**:
   - Build 2 high-quality projects. Focus on solving a real-world problem and integrate features like caching (Redis), authentication (JWT/OAuth), or APIs.

3. **Resume Score**:
   - Scan your resume using our ATS Scanner and bring the score above **80%** by adding metrics and removing vague terms.

4. **Mock Interviews**:
   - Schedule and practice with our AI Interview Rounds to build confidence answering live questions.`;
}

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
