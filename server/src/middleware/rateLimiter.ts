import rateLimit from 'express-rate-limit';

const createLimiter = (max: number, windowMs: number = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests. Please try again later.' }
  });
};

export const generalLimiter = createLimiter(100);
export const submissionLimiter = createLimiter(5);
export const loginLimiter = createLimiter(10);
