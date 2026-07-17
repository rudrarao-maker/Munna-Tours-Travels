import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * Auth rate limiter (login/register)
 * 5 attempts per 15 minutes per IP — protects against brute force
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased for testing/demo purposes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login/register attempts. Please try again after 15 minutes.',
  },
});

/**
 * Payment rate limiter
 * 10 requests per 15 minutes per IP
 */
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many payment requests. Please try again after 15 minutes.',
  },
});
