import express from 'express';
import { getReviews, createReview, updateReviewStatus, deleteReview } from '../controllers/reviewController';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(createReview);

router.route('/:id')
  .put(updateReviewStatus)
  .delete(deleteReview);

export default router;
