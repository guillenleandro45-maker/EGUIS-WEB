let cart = [];


/* AGREGAR PRODUCTO */

function addToCart(name, price) {

  const existingProduct =
    cart.find(item => item.name === name);


  if (existingProduct) {

    existingProduct.quantity++;

  } else {

    cart.push({
      name: name,
      price: price,
      quantity: 1
    });

  }


  updateCart();

}


/* ACTUALIZAR CARRITO */

function updateCart() {

  const cartItems =
    document.getElementById("cart-items");

  const cartCount =
    document.getElementById("cart-count");

  const cartTotal =
    document.getElementById("cart-total");


  cartItems.innerHTML = "";


  let total = 0;

  let totalProducts = 0;


  cart.forEach((item, index) => {

    total +=
      item.price * item.quantity;

    totalProducts +=
      item.quantity;


    const element =
      document.createElement("div");


    element.classList.add("cart-item");


    element.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <br>
        ${item.quantity} x S/ ${item.price.toFixed(2)}
      </div>

      <button
        onclick="removeFromCart(${index})"
      >
        ✕
      </button>
    `;


    cartItems.appendChild(element);

  });


  cartCount.textContent =
    totalProducts;


  cartTotal.textContent =
    total.toFixed(2);

}


/* ELIMINAR PRODUCTO */

function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();

}


/* ABRIR / CERRAR CARRITO */

function toggleCart() {

  const panel =
    document.getElementById("cart-panel");


  panel.classList.toggle("open");

}


/* WHATSAPP */

function sendWhatsApp() {

  if (cart.length === 0) {

    alert(
      "Primero agrega productos al carrito."
    );

    return;

  }


  let message =
    "Hola EGUIS, quiero realizar el siguiente pedido:%0A%0A";


  let total = 0;


  cart.forEach(item => {

    const subtotal =
      item.price * item.quantity;


    total += subtotal;


    message +=
      `${item.quantity} x ${item.name} - S/ ${subtotal.toFixed(2)}%0A`;

  });


  message +=
    `%0ATotal: S/ ${total.toFixed(2)}`;


  /*
    CAMBIA ESTE NÚMERO POR TU WHATSAPP

    Perú:
    51 + número celular

    ejemplo:
    51987654321
  */

  const phone =
    "51999999999";


  const url =
    `https://wa.me/${phone}?text=${message}`;


  window.open(
    url,
    "_blank"
  );

}


/* FILTRO POR GÉNERO */

const genderRadios =
  document.querySelectorAll(
    'input[name="genero"]'
  );


genderRadios.forEach(radio => {

  radio.addEventListener(
    "change",
    filterProducts
  );

});


function filterProducts() {

  const selectedGender =
    document.querySelector(
      'input[name="genero"]:checked'
    ).value;


  const products =
    document.querySelectorAll(
      ".product"
    );


  products.forEach(product => {

    const gender =
      product.dataset.gender;


    if (
      selectedGender === "todos" ||
      selectedGender === gender
    ) {

      product.style.display = "block";

    } else {

      product.style.display = "none";

    }

  });

}


/* FILTRAR COLOR */

function filterColor(color) {

  const products =
    document.querySelectorAll(
      ".product"
    );


  products.forEach(product => {

    if (
      product.dataset.color === color
    ) {

      product.style.display = "block";

    } else {

      product.style.display = "none";

    }

  });

}


/* ORDENAR PRECIOS */

document
  .getElementById("sort-products")
  .addEventListener(
    "change",
    function () {

      const grid =
        document.getElementById(
          "products-grid"
        );


      const products =
        Array.from(
          grid.querySelectorAll(
            ".product"
          )
        );


      if (
        this.value === "price-low"
      ) {

        products.sort(
          (a, b) =>
            Number(a.dataset.price) -
            Number(b.dataset.price)
        );

      }


      if (
        this.value === "price-high"
      ) {

        products.sort(
          (a, b) =>
            Number(b.dataset.price) -
            Number(a.dataset.price)
        );

      }


      products.forEach(product => {

        grid.appendChild(product);

      });

    }
  );