/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/auth.model.js';

dotenv.config();

// Route for verifying JWT validity (used by the frontend)
export const verifyToken = async (req, res) => {
  try {
    // Ensure JWT_SECRET_KEY is set
    if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT_SECRET_KEY is not defined in the environment.');
      return res
        .status(500)
        .json({ message: 'Server error. Please try again later.' });
    }

    // Get the token from cookies
    const token = req.cookies.authToken
      ? req.cookies.authToken
      : req.body.token;

    // If no token is found, return a 403 (Forbidden) response
    if (!token) {
      return res
        .status(403)
        .json({ message: 'Access denied. No token provided. Please log in.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err.message);

        // Return 401 (Unauthorized) if the token is invalid or expired
        return res.status(401).json({
          message:
            err.name === 'TokenExpiredError'
              ? 'Token has expired. Please log in again.'
              : 'Invalid token. Please log in again.',
        });
      }

      // Ensure the decoded token has required fields
      if (!decoded || !decoded.id) {
        return res.status(400).json({
          message: 'Malformed token. Required user information is missing.',
        });
      }

      // Check if the user exists in the database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(404)
          .json({ message: 'User not found. Please log in again.' });
      }

      user.password = undefined;
      // Return success response with user details
      return res.status(200).json({
        message: 'Token is valid',
        isValid: true,
        user,
      });
    });
  } catch (error) {
    console.error('Error in verifyToken:', error.message);

    // Return 500 (Internal Server Error) for unexpected issues
    return res.status(500).json({
      message: 'Server error. Please try again later.',
    });
  }
};
