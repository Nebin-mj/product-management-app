# Product Management App

Added front end for the [Node Js only API](https://github.com/Nebin-mj/NodeJs-Only-API).  
Front end rendering using Handlebars templating engine.  
Styling using **Bootstrap** and **Custom CSS**

## To Start The App

`npm i` (to install required node modules)  
`npm run dev` (to start it with nodemon)  
`npm start` (to start it with node)
App will be available on http://localhost:5000

## Routes

**GET** `/api/products` - Returns all products.  
**GET** `/api/products/:id` - Returns product with given `id`.  
**PUT** `/api/products/:id` - Updates the product with `id` with the new data in the request body.  
**POST** `/api/products` - Adds new product with the given name, description and price from the requst body.  
**DELETE** `api/products/:id` - Removes product with `id`.
