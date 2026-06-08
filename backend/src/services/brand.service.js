import { v4 as uuidv4 } from 'uuid';
import * as brandStore from '../store/brandStore.js';

class BrandService {
  createBrand(name) {
    const id = uuidv4();
    return brandStore.createBrand(id, name.trim());
  }

  getAllBrands() {
    return brandStore.getAllBrands();
  }

  getBrandById(id) {
    return brandStore.getBrand(id);
  }

  brandExists(id) {
    return brandStore.brandExists(id);
  }
}

export default new BrandService();
