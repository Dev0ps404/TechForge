const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter
const createTransporter = () => {
  // Check if SMTP is configured, else log to console fallback
  if (
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER.includes('placeholder')
  ) {
    console.warn('Email SMTP credentials not fully configured. Email service will run in sandbox/logger mode.');
    return {
      sendMail: async (options) => {
        console.log('--- Sandbox Email Sent ---');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body Snippet: ${options.text || options.html.replace(/<[^>]*>/g, '').slice(0, 150)}...`);
        console.log('---------------------------');
        return { messageId: 'sandbox-mock-id' };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

/**
 * Send Welcome Email
 */
const sendWelcomeEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: `"TalentForge" <${process.env.EMAIL_FROM || 'no-reply@talentforge.com'}>`,
    to: toEmail,
    subject: 'Welcome to TalentForge - Ready to Ace Your Interview?',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; text-align: center;">Welcome to TalentForge!</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for signing up for TalentForge, your ultimate AI-powered interview preparation platform.</p>
        <p>With TalentForge, you can:</p>
        <ul>
          <li>Upload your resume for instant **ATS Score Scanning** and enhancement tips.</li>
          <li>Practice realistic mock interviews using **AI Question Generators** customized to your stack.</li>
          <li>Transcribe and grade your verbal answers with our **speech-to-text** review algorithms.</li>
          <li>Build coding consistency through our **DSA progress tracker** and **Daily Challenges**.</li>
        </ul>
        <p>Click below to jump to your dashboard and start preparing:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
        </div>
        <p>Happy coding and preparation!</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">TalentForge Team. Ace your interviews, change your life.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${toEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Welcome email failed:', error);
    return false;
  }
};

/**
 * Send Performance Report Email
 */
const sendPerformanceReportEmail = async (toEmail, userName, sessionData) => {
  const { jobRole, overallScore, feedback } = sessionData;
  const mailOptions = {
    from: `"TalentForge" <${process.env.EMAIL_FROM || 'no-reply@talentforge.com'}>`,
    to: toEmail,
    subject: `TalentForge Mock Interview Report: ${jobRole}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; text-align: center;">Mock Interview Performance Report</h2>
        <p>Hi ${userName},</p>
        <p>You have successfully completed a mock interview session for **${jobRole}**.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Overall Score: <span style="color: #4f46e5;">${overallScore.overall}/100</span></h3>
          <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0;">Technical Accuracy</td>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${overallScore.technical}/100</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0;">Communication</td>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${overallScore.communication}/100</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0;">Confidence</td>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${overallScore.confidence}/100</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0;">Grammar Check</td>
              <td style="padding: 6px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">${overallScore.grammar}/100</td>
            </tr>
          </table>
        </div>

        <h4 style="color: #1e293b; margin-bottom: 5px;">Key Strengths:</h4>
        <ul style="margin-top: 0;">
          ${feedback.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>

        <h4 style="color: #1e293b; margin-bottom: 5px;">Areas of Improvement:</h4>
        <ul style="margin-top: 0;">
          ${feedback.weaknesses.map(w => `<li>${w}</li>`).join('')}
        </ul>

        <p>Head back to the platform to view the question-by-question breakdown and detailed transcription reviews.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/evaluation/${sessionData._id}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Detailed Evaluation</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">TalentForge Team. Ace your interviews, change your life.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Performance report email sent to ${toEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Performance report email failed:', error);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPerformanceReportEmail,
};
