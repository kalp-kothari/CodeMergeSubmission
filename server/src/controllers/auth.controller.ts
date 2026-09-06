import { Request, Response, NextFunction } from 'express';
import { supabaseAuth } from '../config/supabase';
import { loginSchema } from '../schemas/auth.schema';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
  email,
  password
});

    if (error) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      token: data.session.access_token,
      user: { email: data.user?.email }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Logged out' });
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ email: req.user.email, id: req.user.id });
};
