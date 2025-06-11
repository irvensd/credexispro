import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testQuery } from './config/db';
import authRouter from './modules/auth/routes';
import inviteRouter from './modules/invite/routes';
import userRouter from './modules/user/routes';
import orgRouter from './modules/org/routes';
import auditRouter from './modules/audit/routes';
import apikeyRouter from './modules/apikey/routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/invites', inviteRouter);
app.use('/users', userRouter);
app.use('/org', orgRouter);
app.use('/audit', auditRouter);
app.use('/apikeys', apikeyRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await testQuery();
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err as Error).message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 