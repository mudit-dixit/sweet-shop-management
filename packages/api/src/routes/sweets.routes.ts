import { Router } from 'express';
// Import all three controllers
import {
  getAllSweets,
  createSweet,
  searchSweets,
} from '../controllers/sweet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Apply the authMiddleware to all routes in this file
router.use(authMiddleware);

// --- Routes ---
router.get('/', getAllSweets);
router.post('/', createSweet);
router.get('/search', searchSweets); 

export default router;