const { createServer } = require("http");
const path = require("path");
const api = require("./api/products.js");
const {
   notFound,
   showHomePage,
   giveFile,
} = require("./Controller/controller.js");

const PORT = process.env.PORT || 5000;

const server = createServer((req, res) => {
   if (!api(req, res)) {
      if (req.url === "/" && req.method === "GET") {
         showHomePage(req, res);
      } else if (
         path.extname(req.url) === ".js" ||
         path.extname(req.url) === ".css"
      ) {
         giveFile(req, res);
      } else {
         notFound(res);
      }
   }
});

server.listen(5000, () => {
   console.log(`!!Server Running At PORT : ${PORT}!!`);
});
