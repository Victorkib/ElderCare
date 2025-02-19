import User from '../models/auth.model.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs';

//register user
export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNo,
    dateOfBirth,
    profession,
    password,
  } = req.body;

  // Basic input validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNo ||
    !dateOfBirth ||
    !profession ||
    !password
  ) {
    return res.status(400).json({ message: 'All fields must be filled!' });
  }

  // Validate email format using validator
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate phone number (10-15 digits) using validator
  if (!validator.isMobilePhone(phoneNo, 'any', { strictMode: false })) {
    return res
      .status(400)
      .json({ message: 'Phone number must be between 9 and 15 digits' });
  }

  // Validate password strength using validator's isStrongPassword
  const passwordOptions = {
    minLength: 6, // Minimum length of 6 characters
    minLowercase: 1, // At least 1 lowercase letter
    minUppercase: 1, // At least 1 uppercase letter (optional)
    minNumbers: 1, // At least 1 number
    minSymbols: 0, // No symbols required (set to 1 if needed)
  };

  if (!validator.isStrongPassword(password, passwordOptions)) {
    return res.status(400).json({
      message:
        'Password must be at least 6 characters long, with at least one letter (uppercase and lowercase), and one number.',
    });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNo,
      dateOfBirth,
      profession,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({ message: 'Error creating User' });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Error registering user' });
  }
};

const age = 1000 * 60 * 60 * 24 * 30;
//login user
export const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: rememberMe ? age : '1h', // 30 days if rememberMe, 1 hour if not
      }
    );

    // Send cookie based on rememberMe
    res
      .cookie('authToken', token, {
        httpOnly: true,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 30 days or 1 hour
        secure: true, // Only send cookie over HTTPS
        sameSite: 'None', // Required for cross-site cookies
      })
      .status(200)
      .json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error logging in' });
  }
};

//Logout
export const logout = (req, res) => {
  res
    .cookie('authToken', '', { maxAge: new Date(0) })
    .status(200)
    .json({ msg: 'success logout' });
};

//get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Error retrieving users' });
  }
};

//get single user by Id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error retrieving user' });
  }
};

//update single user
export const updateUser = async (req, res) => {
  const allowedUpdates = [
    'firstName',
    'lastName',
    'email',
    'phoneNo',
    'dateOfBirth',
    'profession',
  ];
  const updates = Object.keys(req.body);

  // Check if all requested updates are allowed
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Validate and return the updated document
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating user' });
  }
};

//delete single user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting user' });
  }
};

//update user password
export const updatePassword = async (req, res) => {
  try {
    const userId = req.decodedToken.id; // Get user ID from token
    const { currentPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

//deactivate account
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.decodedToken.id; // Get user ID from token

    // Delete user from the database
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Account successfully deactivated.' });
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

//get logged in user details
export const getUserProfile = async (req, res) => {
  try {
    // Extract user ID from the JWT token (from the middleware)
    const userId = req.decodedToken.id;

    // Find user by ID, excluding password
    const user = await User.findById(userId).select(
      'firstName lastName profession phoneNo email'
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Return user profile data
    res.status(200).json({
      success: true,
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        profession: user.profession,
        phoneNumber: user.phoneNo,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//update the user profile data
export const updateUserProfile = async (req, res) => {
  try {
    // Extract user ID from JWT token
    const userId = req.decodedToken.id;

    // Extract fields from request body
    const { firstName, lastName, profession, phoneNumber } = req.body;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, profession, phoneNo: phoneNumber }, // Ensure correct field mapping
      { new: true, runValidators: true } // Return updated document & apply validation
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Respond with updated data
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profession: updatedUser.profession,
        phoneNumber: updatedUser.phoneNo,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
