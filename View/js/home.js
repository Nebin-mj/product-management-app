function addGlobalListener(id, event, handler) {
   document.addEventListener("click", e => {
      if (
         e.target == document.querySelector(id) ||
         Array.from(document.querySelectorAll(id)).includes(e.target) ||
         document.querySelector(id).contains(e.target)
      )
         handler(e);
   });
}

let template = document.querySelector("template");

addGlobalListener(".find-btn", "click", async () => {
   const idField = document.querySelector("#find-id");
   if (idField.value === "") {
      document
         .querySelector("#find-id")
         .setAttribute("placeholder", "This field is required");
   } else {
      let findBtn = document.querySelector(".find-btn");
      toggleLoadingAnimation(findBtn, "Find Product");
      const response = await findProduct(idField.value);
      if (!response.err) {
         const formParent = document.querySelector("#pills-find");
         toggleLoadingAnimation(findBtn, "Find Product");
         let card = document.querySelector("#pills-find .card");
         if (card) card.remove();
         formParent.innerHTML += renderTemplate(response.product);
      } else {
         toggleLoadingAnimation(findBtn, "Find Product");
         idField.value = "";
         idField.setAttribute("placeholder", response.err);
         console.error(response.err);
      }
   }
});

addGlobalListener(".add-btn", "click", () => {
   let flag = true;
   const name = document.querySelector("#add-name");
   const description = document.querySelector("#add-description");
   const price = document.querySelector("#add-price");
   let product = { name: "", description: "", price: "" };
   [name, description, price].forEach((val, i) => {
      if (val.value == "") {
         val.setAttribute("placeholder", "This value is required");
         flag = false;
      } else {
         if (i === 0) product.name = val.value;
         else if (i === 1) product.description = val.value;
         else if (i === 2) product.price = val.value;
      }
   });
   if (flag) {
      let addBtn = document.querySelector(".add-btn");
      toggleLoadingAnimation(addBtn, "Add Product");
      const response = fetch(`${location.href}api/products`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(product),
      });
      response
         .then(data => data.json())
         .then(jsonData => {
            const formParent = document.querySelector("#pills-add");
            toggleLoadingAnimation(addBtn, "Add Product");
            let card = document.querySelector("#pills-add .card");
            if (card) {
               card.remove();
            }
            formParent.innerHTML += renderTemplate(jsonData);
            showProducts();
         })
         .catch(err => {
            toggleLoadingAnimation(addBtn, "Add Product");
            console.error(err);
         });
   }
});

addGlobalListener(".upd-find-btn", "click", async () => {
   const idField = document.querySelector("#update-id");
   if (idField.value === "") {
      idField.setAttribute("placeholder", "This field is required");
   } else {
      const response = await findProduct(
         document.querySelector("#update-id").value
      );
      if (!response.err) {
         const findFormParent = document.querySelector("#pills-update");
         let card = document.querySelector("#pills-update .card");
         if (card) card.remove();
         findFormParent.innerHTML += renderTemplate(response.product);
         document.querySelectorAll(".update-form [disabled]").forEach(val => {
            val.removeAttribute("disabled");
         });
         document.querySelector(".update-btn").removeAttribute("disabled");
         fillUpdateForm(response.product);
      } else {
         idField.setAttribute("placeholder", response.err);
         console.error(response.err);
      }
   }
});

addGlobalListener(".fas.fa-edit", "click", async e => {
   document.querySelector("#pills-update-tab").click();
   const updateIdField = document.querySelector("#update-id");
   updateIdField.value =
      e.target.closest("span").previousElementSibling.innerText;
   if (updateIdField.value === "") {
      updateIdField.setAttribute("placeholder", "This field is required");
   } else {
      const response = await findProduct(updateIdField.value);
      if (!response.err) {
         const formParent = document.querySelector("#pills-update");
         let card = document.querySelector("#pills-update .card");
         if (card) card.remove();
         formParent.innerHTML += renderTemplate(response.product);
         document.querySelectorAll(".update-form [disabled]").forEach(val => {
            val.removeAttribute("disabled");
         });
         document.querySelector(".update-btn").removeAttribute("disabled");
         fillUpdateForm(response.product);
      } else {
         document.querySelector("#update-id").value = "";
         updateIdField.setAttribute("placeholder", response.err);
         console.error(response.err);
      }
      document.querySelector(".container").scrollIntoView();
   }
});

addGlobalListener(".update-btn", "click", () => {
   const searchId = document.querySelector(
      "#pills-update .card li span:first-child"
   ).innerText;
   let name = document.querySelector("#update-name").value;
   let description = document.querySelector("#update-description").value;
   let price = document.querySelector("#update-price").value;
   const productData = {
      name: name === "" ? undefined : name,
      description: description === "" ? undefined : description,
      price: price === "" ? undefined : price,
   };
   const response = fetch(`${location.href}api/products/${searchId}`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
   });
   response
      .then(data => data.json())
      .then(jsonData => {
         const cardParent = document.querySelector("#pills-update");
         let card = document.querySelector("#pills-update .card");
         if (card) {
            card.remove();
         }
         cardParent.innerHTML += renderTemplate(jsonData);
         showProducts();
      })
      .catch(err => {
         console.error(err);
      });
});

addGlobalListener(".fas.fa-trash", "click", e => {
   const deleteId = e.target.closest("span").previousElementSibling.innerText;
   if (
      !confirm(`ARE YOU SURE YOU WANT TO DELETE PRODUCT WITH ID:${deleteId}`)
   ) {
      alert(`DELETE OPERATION OF PRODUCT WITH ID ${deleteId} CANCELED`);
      return;
   }

   const response = fetch(`${location.href}api/products/${deleteId}`, {
      method: "DELETE",
   });
   response
      .then(data => data.json())
      .then(jsonData => {
         showProducts();
         const card = e.target.closest("div.card");
         if (card) {
            card.remove();
         }
         alert(jsonData.message);
      });
});

async function showProducts() {
   try {
      const productsDiv = document.querySelector(".products");
      const render = Handlebars.compile(template.innerHTML);
      const response = await fetch(`${location.href}api/products`);
      const products = await response.json();
      productsDiv.innerHTML = render({ products });
   } catch (err) {
      console.error(err);
   }
}

//Request and find the product of id from the API route api/products/:id
async function findProduct(id) {
   let result = {};
   try {
      const response = await fetch(`${location.href}api/products/${id}`);
      const product = await response.json();
      result.product = product;
   } catch (err) {
      result.err = err;
      console.log(err);
   }
   return result;
}

//Renders card template for every product
function renderTemplate(dataObj) {
   const render = Handlebars.compile(template.innerHTML);
   let products;
   try {
      products = [...dataObj];
   } catch (err) {
      products = [dataObj];
   }
   return render({ products });
}

//update form fields are pre populated with product details passed as 'product' object
function fillUpdateForm(product) {
   document.querySelector("#update-name").value = product.name;
   document.querySelector("#update-description").value = product.description;
   document.querySelector("#update-price").value = product.price;
}

//Toggles loading animation on button
function toggleLoadingAnimation(btn, btnText) {
   btn.children[0].classList.toggle("hidden");
   if (btn.children[1].innerText === btnText) {
      btn.children[1].innerText = "Loading...";
      return;
   }
   btn.children[1].innerText = btnText;
}

showProducts();
