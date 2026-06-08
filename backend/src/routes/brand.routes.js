import { Router } from 'express';
import { createBrand, listBrands, getBrand } from '../controllers/brand.controller.js';
import { validateCreateBrand } from '../middleware/validation.js';

const router = Router();

router.post('/', validateCreateBrand, createBrand);
router.get('/', listBrands);
router.get('/:id', getBrand);

export default router;
