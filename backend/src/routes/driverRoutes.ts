import express from 'express';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../controllers/driverController';

const router = express.Router();

router.route('/')
  .get(getDrivers)
  .post(createDriver);

router.route('/:id')
  .put(updateDriver)
  .delete(deleteDriver);

export default router;
