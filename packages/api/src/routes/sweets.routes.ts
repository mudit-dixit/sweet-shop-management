import { Router } from 'express';
// Import both controllers
import { getAllSweets, createSweet } from '../controllers/sweet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// --- Routes ---
router.get('/', getAllSweets);
router.post('/', createSweet);

export default router;