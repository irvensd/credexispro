import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { testQuery } from './config/db';
import { securityMiddleware, developmentMiddleware } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import logger from './config/logger';
import { initSentry } from './config/sentry';
import authRouter from './modules/auth/routes';
import inviteRouter from './modules/invite/routes';
import userRouter from './modules/user/routes';
import orgRouter from './modules/org/routes';
import auditRouter from './modules/audit/routes';
import apikeyRouter from './modules/apikey/routes';
import roleRouter from './modules/role/routes';
import sessionRouter from './modules/session/routes';
import fileRouter from './modules/file/routes';
import notificationRouter from './modules/notification/routes';
import clientRouter from './modules/client/routes';
import disputeRouter from './modules/dispute/routes';
import taskRouter from './modules/task/routes';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Sentry
const Sentry = initSentry(app);

// Apply security middleware
app.use(securityMiddleware);

// Apply development middleware in development environment
if (process.env.NODE_ENV === 'development') {
  app.use(developmentMiddleware);
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/invites', inviteRouter);
app.use('/api/users', userRouter);
app.use('/api/orgs', orgRouter);
app.use('/api/audit', auditRouter);
app.use('/api/apikeys', apikeyRouter);
app.use('/api/roles', roleRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/files', fileRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/clients', clientRouter);
app.use('/api/disputes', disputeRouter);
app.use('/api/tasks', taskRouter);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
}); 