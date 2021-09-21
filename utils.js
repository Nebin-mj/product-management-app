function getReqBody(req) {
   return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", data => {
         body = `${data}`;
         resolve(data);
      });
      req.on("error", err => {
         reject(err);
      });
   });
}

module.exports = {
   getReqBody,
};
