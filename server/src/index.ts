import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

import teamRoutes from './routes/team.routes';
import submissionRoutes from './routes/submission.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan('short'));
app.use(express.json({ limit: '1mb' }));
app.use(generalLimiter);

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);
});
