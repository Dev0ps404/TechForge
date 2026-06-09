const aiService = require('../services/aiService');

/**
 * @desc    Chat with AI Advisor
 * @route   POST /api/chat
 * @access  Private
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A history of conversation messages is required',
      });
    }

    // Call chat assistant service
    const aiResponse = await aiService.chatAssistant(messages);

    return res.status(200).json({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error from AI assistant',
    });
  }
};
