import { Router } from 'express';
import { generateInvoice, getInvoices, getInvoiceById, getInvoiceByBookingId, downloadInvoicePDF } from '../controllers/invoiceController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/generate', protect, generateInvoice);
router.get('/', protect, authorize('admin', 'manager'), getInvoices);
router.get('/:id', protect, getInvoiceById);
router.get('/:id/download', protect, downloadInvoicePDF);
router.get('/booking/:bookingId', protect, getInvoiceByBookingId);

export default router;
