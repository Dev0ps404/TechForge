const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendWelcomeEmail } = require('../services/emailService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    // Send welcome email asynchronously
    sendWelcomeEmail(user.email, user.name).catch(err => console.error('Error sending welcome email:', err));

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        skills: user.skills,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user (must request password field explicitly since select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        skills: user.skills,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

/**
 * @desc    Google Authentication (Signup/Login)
 * @route   POST /api/auth/google
 * @access  Public
 */
exports.googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential token is required',
      });
    }

    let payload;
    
    // Attempt real verification if GOOGLE_CLIENT_ID is set and token is not mock
    if (process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes('placeholder') && !credential.startsWith('mock_')) {
      try {
        if (credential.startsWith('ey')) {
          const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          payload = ticket.getPayload();
        } else {
          const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${credential}`);
          if (!userInfoRes.ok) {
            throw new Error(`Google userinfo returned status ${userInfoRes.status}`);
          }
          const googleData = await userInfoRes.json();
          payload = {
            email: googleData.email,
            name: googleData.name,
            picture: googleData.picture,
            sub: googleData.sub,
          };
        }
      } catch (err) {
        console.error('Google token verification failed:', err);
        return res.status(400).json({
          success: false,
          message: 'Invalid Google token',
        });
      }
    } else {
      // Mock Google Token validation fallback for quick testing
      console.warn('Running in Mock Google Token verification mode.');
      payload = {
        email: req.body.email || 'google_user@gmail.com',
        name: req.body.name || 'Google User',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
        sub: credential.startsWith('mock_') ? credential : 'mock_sub_google_12345',
      };
    }

    const { email, name, picture, sub } = payload;

    // Try finding user by googleId
    let user = await User.findOne({ googleId: sub });

    if (!user) {
      // If not, check if user exists with the same email
      user = await User.findOne({ email });

      if (user) {
        // Link googleId to existing account
        user.googleId = sub;
        if (!user.profilePicture || user.profilePicture.includes('unsplash')) {
          user.profilePicture = picture;
        }
        await user.save();
      } else {
        // Create new user via Google Sign-In
        user = await User.create({
          name,
          email,
          googleId: sub,
          profilePicture: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
        });
        // Send welcome email
        sendWelcomeEmail(user.email, user.name).catch(err => console.error('Error sending welcome email:', err));
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        skills: user.skills,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Google OAuth controller error:', error);
    return res.status(500).json({ success: false, message: 'Server error during Google OAuth' });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      skills: req.body.skills,
    };

    if (req.body.profilePicture) {
      fieldsToUpdate.profilePicture = req.body.profilePicture;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
