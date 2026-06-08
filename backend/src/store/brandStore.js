/**
 * In-memory brand storage.
 * Each brand maintains an isolated message history for context isolation.
 */
const brands = new Map();

export function createBrand(id, name) {
  const brand = {
    id,
    name,
    messages: [],
  };
  brands.set(id, brand);
  return brand;
}

export function getBrand(id) {
  return brands.get(id) ?? null;
}

export function getAllBrands() {
  return Array.from(brands.values()).map(({ id, name }) => ({ id, name }));
}

export function addMessage(brandId, role, content) {
  const brand = brands.get(brandId);
  if (!brand) {
    return null;
  }
  const message = { role, content };
  brand.messages.push(message);
  return message;
}

export function getMessageContext(brandId) {
  const brand = brands.get(brandId);
  if (!brand) {
    return null;
  }
  return [...brand.messages];
}

export function brandExists(id) {
  return brands.has(id);
}
