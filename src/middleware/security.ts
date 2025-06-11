import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Helmet configuration
export const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
};

// Security middleware
export const securityMiddleware = [
  // Rate limiting
  rateLimiter,

  // Security headers
  helmet(helmetConfig),

  // CORS
  cors(corsOptions),

  // Additional security headers
  (req: Request, res: Response, next: NextFunction) => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  },
];

// Request validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map((detail: any) => detail.message),
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// API key validation middleware
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// IP whitelist middleware
export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [];
  const clientIP = req.ip;
  
  if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
    return res.status(403).json({ error: 'IP not allowed' });
  }
  next();
}; 