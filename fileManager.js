const fs = require("fs");

class FileManager {
  constructor(filename) {
    this.filename = filename;
    this.elements = [];
    this.length = 0;
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync(this.filename, "utf8");
      this.elements = JSON.parse(data);
      this.length = this.elements.length;
    } catch (error) {
      this.elements = [];
      this.length = 0;
    }
  }

  getData() {
    return this.elements;
  }

  save() {
    fs.writeFileSync(this.filename, JSON.stringify(this.elements, null, 2));
  }

  validateProduct(product, res) {
    const errorMsg = "Estos campos son obligatorios: title, description, price, code, status, stock, category"

    if (!product.title || typeof product.title !== "string") {
      res
        .status(400)
        .json({
          error:
            `${errorMsg}. Title debe ser string`,
        });
      return;
    }
    if (!product.description || typeof product.description !== "string") {
      res
        .status(400)
        .json({ error:  `${errorMsg}. Description debe ser string` });
      return;
    }
    if (!product.price || typeof product.price !== "number") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Price debe ser number` });
      return;
    }
    if (!product.code || typeof product.code !== "string") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Code debe ser string` });
      return;
    }
    if (!product.stock || typeof product.stock !== "number") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Stock debe ser number` });
      return;
    }
    if (!product.category || typeof product.category !== "string") {
      res
        .status(400)
        .json({ error: `${errorMsg}. Category debe ser string` });
      return;
    }
    return
  }

  addProduct(product, res) {
    const found = this.elements.find((x) => x.code === product.code);
    if (found) {
      res.status(409).json({ error: "El producto ya existe" });
      return;
    }

    this.validateProduct(product, res)

    if (product.status === undefined || product.status === null || product.status === 0) {
      product.status = true
    }

    this.length += 1;
    product.id = this.length;

    this.elements.push(product);
    this.save();
    return product;
  }

  
  getProducById(id) {
    const found = this.elements.filter((x) => x.id === id);
    if (found.length === 0) {
      console.error("Not found");
      return;
    }
    return found;
  }

  
  updateProduct(id, productUpdate, res) {
    const indexToUpdate = this.elements.findIndex(
      (product) => product.id === id
    );
    if (indexToUpdate !== -1) {
      this.elements[indexToUpdate] = {
        ...this.elements[indexToUpdate],
        ...productUpdate,
        id: this.elements[indexToUpdate].id,
      };
      this.save();
      res.json({ message: "Producto actualizado exitosamente"})
      return;
    } else {
      res.status(404).json({ error: "No se encontró el producto con el ID dado" });
      return;
    }
  }

  deleteProduct(id, res) {
    const indexToDelete = this.elements.findIndex(
      (product) => product.id === id
    );

    if (indexToDelete !== -1) {
      this.elements.splice(indexToDelete, 1);
      res.json({ message: "Producto eliminado exitosamente"})
    } else {
      res.status(404).json({ error: "No se encontró el producto con el ID dado" });
    }
    this.save();
  }

  createCart() {
    const newCart = {}
    this.length += 1;
    newCart.id = this.length;
    newCart.products = []

    this.elements.push(newCart);
    this.save();
    return newCart;
  }
}

module.exports = FileManager;
