const path = require("path");
const {
   notFound,
   getProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,
} = require("../Controller/controller.js");

function api(req, res) {
   if (req.url === "/api/products" && req.method === "GET") {
      getProducts(req, res);
   } else if (req.url.match(/\/api\/products\/\w+/) && req.method === "GET") {
      const id = req.url.split("/")[3];
      getProduct(req, res, id);
   } else if (req.url === "/api/products" && req.method === "POST") {
      createProduct(req, res);
   } else if (req.url.match(/\/api\/products\/\w+/) && req.method === "PUT") {
      const id = req.url.split("/")[3];
      updateProduct(req, res, id);
   } else if (
      req.url.match(/\/api\/products\/[0-9]+/) &&
      req.method === "DELETE"
   ) {
      const id = req.url.split("/")[3];
      deleteProduct(req, res, id);
   } else {
      return false;
   }
   return true;
}

module.exports = api;
