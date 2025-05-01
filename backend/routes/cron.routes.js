// routes/cronRoute.js
import express from 'express';

const router = express.Router();

router.get('/cron-task', (req, res) => {
  console.log('Ping received at /cron-task to keep server awake');
  res.send('OK');
});

export default router;
