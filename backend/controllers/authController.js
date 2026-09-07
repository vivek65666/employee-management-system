import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function tokenFor(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  if (role && !['admin', 'employee'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
  if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: 'Email is already registered' });
  const user = await User.create({ name, email, password, role: role || 'employee' });
  res.status(201).json({ success: true, message: 'Registration successful', data: { user: publicUser(user), token: tokenFor(user) } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  res.json({ success: true, message: 'Login successful', data: { user: publicUser(user), token: tokenFor(user) } });
}

export function me(req, res) {
  res.json({ success: true, data: { user: publicUser(req.user) } });
}
