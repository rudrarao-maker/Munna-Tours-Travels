import express from 'express';
import { 
  getAllPackages, 
  getPackageByIdOrSlug, 
  createPackage, 
  updatePackage, 
  deletePackage 
} from '../controllers/packageController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getAllPackages);
router.get('/:id', getPackageByIdOrSlug);

// Admin only
router.post('/', protect, authorize('admin'), createPackage);
router.put('/:id', protect, authorize('admin'), updatePackage);
router.delete('/:id', protect, authorize('admin'), deletePackage);

export default router;
