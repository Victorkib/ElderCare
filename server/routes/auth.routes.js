import express from 'express';
import {
  deactivateAccount,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  login,
  logout,
  register,
  updatePassword,
  updateUser,
  updateUserProfile,
} from '../controllers/auth.controller.js';
import { verifyJWT, verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

//verify user
router.post('/verifyToken', verifyToken);

router.patch('/updatePassword', verifyJWT, updatePassword);
router.delete('/deactivate', verifyJWT, deactivateAccount);
router.get('/getUserProfile', verifyJWT, getUserProfile);
router.patch('/updateUserProfile', verifyJWT, updateUserProfile);

router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers', getAllUsers);
router.get('/getUserById/:id', getUserById);
router.patch('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.get('/logout', logout);

export default router;
