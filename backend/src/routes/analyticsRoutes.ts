import express from 'express';
import { getAnalytics } from '../controllers/analyticsController';

const router = express.Router();

router.route('/')
  .get(getAnalytics);

export default router;
