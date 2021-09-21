let products = require("../data/data.json");
const fs = require("fs");
const path = require("path");
const { resolve } = require("path");

function findAll() {
   return new Promise((resolve, reject) => {
      if (!products) reject("err occured");
      else resolve(products);
   });
}

function findById(id) {
   return new Promise((resolve, reject) => {
      const product = products.find(p => p.id == id);
      resolve(product);
   });
}

function add(product) {
   return new Promise((resolve, reject) => {
      const id =
         products.reduce((prev, val) => {
            if (prev < val.id) return val.id;
            else return prev;
         }, 0) + 1;
      const newProduct = { id, ...product };
      products.push(newProduct);
      fs.writeFileSync(
         path.join(__dirname, "..", "data", "data.json"),
         JSON.stringify(products)
      );
      resolve(newProduct);
   });
}

function update(id, updProduct) {
   return new Promise((resolve, reject) => {
      let pos = products.findIndex(p => p.id == id);
      products[pos] = { id: parseInt(id), ...updProduct };
      fs.writeFileSync(
         path.join(__dirname, "..", "data", "data.json"),
         JSON.stringify(products)
      );
      resolve(products[pos]);
   });
}

function remove(id) {
   return new Promise((resolve, reject) => {
      products = products.filter(p => p.id != id);
      fs.writeFileSync(
         path.join(__dirname, "..", "data", "data.json"),
         JSON.stringify(products)
      );
      resolve();
   });
}

module.exports = {
   findAll,
   findById,
   add,
   update,
   remove,
};
