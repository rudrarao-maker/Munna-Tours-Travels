import { Router } from 'express';
import { generateETicket, getETicketByBooking, getETicketByNumber, scanETicket } from '../controllers/eticketController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/generate', protect, generateETicket);
router.get('/booking/:bookingId', getETicketByBooking);
router.get('/:ticketNumber', getETicketByNumber);
router.post('/scan', protect, scanETicket);

export default router;
