export function validateCreateBrand(req, res, next) {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Brand name is required and cannot be empty',
    });
  }

  next();
}

export function validateChatMessage(req, res, next) {
  const { brandId, message } = req.body;

  if (!brandId || typeof brandId !== 'string' || !brandId.trim()) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'brandId is required',
    });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Message is required and cannot be empty',
    });
  }

  next();
}
