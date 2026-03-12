import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Sign Up
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'User created successfully', data });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: 'Login successful', session: data.session });
});

// Get current user profile (Protected Route)
router.get('/me', requireAuth, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

export default router;
