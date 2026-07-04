import express from 'express';
import { generateTripPlan } from '../controllers/aiController';

const router = express.Router();

router.route('/trip-plan')
  .post(generateTripPlan);

export default router;
