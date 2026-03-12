import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase';

// Extend Express Request to include user data
export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Verify token via Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: 'Unauthorized', details: error?.message });
    return;
  }

  // Attach user to the request object for downstream routes to use
  req.user = user;
  next();
};
