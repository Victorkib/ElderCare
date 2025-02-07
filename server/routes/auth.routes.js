import express from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  login,
  logout,
  register,
  updateUser,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

//verify user
router.get('/verifyToken', verifyToken);

router.post('/register', register);
router.post('/login', login);
router.get('/getAllUsers', getAllUsers);
router.get('/getUserById/:id', getUserById);
router.patch('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.get('/logout', logout);

export default router;
