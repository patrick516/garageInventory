// backend/controllers/authController.js
require('dotenv').config();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate input
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Hashed Password:', hashedPassword); // Debugging line

    // Create user with hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in user' });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('Forgot password request received for email:', email);

  try {
    const user = await User.findOne({ where: { email } });
    console.log('User found for forgot password:', user);

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log('Reset token generated:', resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log('User updated with reset token and expiration time');

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('Error with email configuration:', error);
        return res.status(500).json({ message: 'Error with email configuration' });
      } else {
        console.log('Email configuration is working:', success);
        
        const mailOptions = {
          to: user.email,
          from: process.env.EMAIL_USERNAME,
          subject: 'Password Reset',
          text: `You requested a password reset. Please use the following link to reset your password: http://${req.headers.host}/reset/${resetToken}`
        };

        transporter.sendMail(mailOptions)
          .then(() => {
            console.log('Password reset email sent to:', user.email);
            res.status(200).json({ message: 'Password reset link sent to email' });
          })
          .catch(err => {
            console.error('Error sending password reset email:', err);
            res.status(500).json({ message: 'Error sending password reset email' });
          });
      }
    });

  } catch (error) {
    console.error('Error processing forgot password request:', error);
    res.status(500).json({ message: 'Error processing forgot password request' });
  }
};

exports.resetPassword = async (req, res) => {
  console.log('Reset password request received with token:', req.params.token);
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() } // Check if token is not expired
      }
    });
    console.log('User found for password reset:', user);

    if (!user) {
      console.log('Password reset token is invalid or has expired:', token);
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    user.password = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully for reset');

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    console.log('User password reset successfully and token cleared');

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
