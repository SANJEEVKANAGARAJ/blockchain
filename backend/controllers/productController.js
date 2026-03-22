let products = [];

/// @desc Add a new product to the e-commerce catalog
exports.addProduct = (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "name and price are required" });
  }
  const product = {
    id: products.length + 1,
    name,
    price,
    description: description || "",
    imageUrl: imageUrl || "",
    createdAt: new Date()
  };
  products.push(product);
  res.status(201).json(product);
};

/// @desc Get all products
exports.getProducts = (req, res) => {
  res.json(products);
};

/// @desc Delete a product by id
exports.deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(idx, 1);
  res.json({ message: "Product deleted" });
};
