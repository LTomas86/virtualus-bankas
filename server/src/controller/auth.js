import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Neteisingi prisijungimo duomenys' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Neteisingi prisijungimo duomenys' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Serverio klaida' });
  }
};

export const register = async (req, res) => {
  const { name, email, password, photo, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Toks el. paštas jau registruotas' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, photo, role: role || 'user' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Serverio klaida' });
  }
};

router.post('/login', login);
router.post('/register', register);

export default router;
