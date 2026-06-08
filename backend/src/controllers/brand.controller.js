import brandService from '../services/brand.service.js';

export async function createBrand(req, res, next) {
  try {
    const { name } = req.body;
    const brand = brandService.createBrand(name);
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
}

export async function listBrands(req, res, next) {
  try {
    const brands = brandService.getAllBrands();
    res.json(brands);
  } catch (error) {
    next(error);
  }
}

export async function getBrand(req, res, next) {
  try {
    const { id } = req.params;
    const brand = brandService.getBrandById(id);

    if (!brand) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Brand not found',
      });
    }

    res.json(brand);
  } catch (error) {
    next(error);
  }
}
