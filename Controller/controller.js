const { findAll, findById, add, update, remove } = require("../Modal/modal.js");
const { getReqBody } = require("../utils.js");
const { readFile } = require("fs").promises;
const path = require("path");

//Error not found
function notFound(res) {
   res.writeHead(404, { "Content-Type": "application/json" });
   res.end(JSON.stringify({ msg: "error not found" }));
}

// @desc    Gets All Products
// @route   GET /api/products
async function getProducts(req, res) {
   try {
      const products = await findAll();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(products));
   } catch (err) {
      console.log(err);
   }
}

// @desc    Gets a specific Product by id
// @route   GET /api/products/:id
async function getProduct(req, res, id) {
   try {
      const product = await findById(id);
      if (!product) {
         notFound(res);
      } else {
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify(product));
      }
   } catch (err) {
      console.log(err);
   }
}

// @desc    Adds a new product
// @route   POST /api/products
async function createProduct(req, res) {
   try {
      const body = await getReqBody(req);
      const { name, description, price } = JSON.parse(body);
      const product = { name, description, price };
      const newProduct = await add(product);

      if (!newProduct) {
         console.log("error resource not found");
      } else {
         res.writeHead(201, { "Content-Type": "application/json" });
         res.end(JSON.stringify(newProduct));
      }
   } catch (err) {
      console.log(err);
   }
}

// @desc    Update an existing product
// @route   PUT /api/products/:id
async function updateProduct(req, res, id) {
   try {
      let product = await findById(id);

      if (!product) {
         notFound(res);
      } else {
         const body = await getReqBody(req);
         const { name, description, price } = JSON.parse(body);
         product = {
            name: name || product.name,
            description: description || product.description,
            price: price || product.price,
         };
         const updProduct = await update(id, product);
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify(updProduct));
      }
   } catch (err) {
      console.log(err);
   }
}

// @desc    Deletes an existing product
// @route   DELETE /api/products/:id
async function deleteProduct(req, res, id) {
   try {
      const product = await findById(id);
      if (!product) {
         notFound(res);
      } else {
         await remove(id);
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ message: `Removed item with ID:${id}` }));
      }
   } catch (err) {
      console.log(err);
   }
}

//show home page
async function showHomePage(req, res) {
   try {
      const page = await readFile(
         path.join(__dirname, "..", "View", "layouts", "home.html"),
         "utf8"
      );
      if (page) {
         res.writeHead(200, { "Content-Type": "text/html" });
         res.end(page);
      } else {
         notFound(res);
      }
   } catch (err) {
      console.log(err);
   }
}

async function giveFile(req, res) {
   const filePath = path.join(__dirname, "..", "View", req.url);
   let contentType = "text/js";
   switch (path.extname(req.url)) {
      case ".css":
         contentType = "text/css";
         break;
   }
   try {
      const file = await readFile(filePath, "utf8");
      res.writeHead(200, { "Content-Type": contentType });
      res.end(file);
   } catch (err) {
      notFound(res);
      console.log(`The file:${req.url} not found`);
   }
}

module.exports = {
   notFound,
   getProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,
   showHomePage,
   giveFile,
};
