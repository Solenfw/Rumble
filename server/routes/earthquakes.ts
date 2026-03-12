import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { supabase } from '../db/supabase';

const router = Router();

// Get saved earthquakes for the logged-in user
router.get('/saved', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user.id;
  
  // Example Supabase Query assuming you have a table named 'saved_earthquakes'
  const { data, error } = await supabase
    .from('saved_earthquakes')
    .select('*')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

// Save a specific earthquake to the user's account
router.post('/save', requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const { earthquakeId, properties, geometry } = req.body;

  const { data, error } = await supabase
    .from('saved_earthquakes')
    .insert([
      { user_id: userId, earthquake_id: earthquakeId, properties, geometry }
    ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Earthquake saved successfully', data });
});

export default router;
