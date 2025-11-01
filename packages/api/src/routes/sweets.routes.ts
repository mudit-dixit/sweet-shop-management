import { Router } from 'express';
import { getAllSweets } from '../controllers/sweet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Apply the authMiddleware to this route
router.get('/', authMiddleware, getAllSweets);

export default router;