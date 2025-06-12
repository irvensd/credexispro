import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare a password with a hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (userId: number): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId: number): string => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string): { userId: number } => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { userId: number } => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}; 