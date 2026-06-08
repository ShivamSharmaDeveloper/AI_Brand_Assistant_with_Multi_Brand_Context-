import { Router } from 'express';
import brandRoutes from './brand.routes.js';
import chatRoutes from './chat.routes.js';

const router = Router();

router.use('/brands', brandRoutes);
router.use('/chat', chatRoutes);

export default router;
