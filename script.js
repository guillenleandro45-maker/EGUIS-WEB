
"use strict";

/* =========================
   CONFIGURACIÓN
========================= */

const WHATSAPP_NUMBER = "51940225816";
const BELT_PRICE_DOZEN = 100;
const BUCKLE_PRICE_UNIT = 5;
const BELT_UNITS_PER_DOZEN = 12;

let cart = [];
let selectedColor = "todos";

/*
  Los cinturones se cobran por docena.
  Las hebillas se cobran por unidad.
*/

const productCatalog = {
  "cinturon-negro": {
    name: "Cinturón Clásico Negro - Hombre",
    price: BELT_PRICE_DOZEN,
    unit: "docena",
    unitsPerPack: BELT_UNITS_PER_DOZEN
  },

  "cinturon-marron": {
    name: "Cinturón Marrón - Hombre",
    price: BELT_PRICE_DOZEN,
    unit: "docena",
    unitsPerPack: BELT_UNITS_PER_DOZEN
  },

  "cinturon-mujer-negro": {
    name: "Cinturón Dama Negro",
    price: BELT_PRICE_DOZEN,
    unit: "docena",
    unitsPerPack: BELT_UNITS_PER_DOZEN
  },

  "cinturon-mujer-beige": {
    name: "Cinturón Dama Beige",
    price: BELT_PRICE_DOZEN,
    unit: "docena",
    unitsPerPack: BELT_UNITS_PER_DOZEN
  },

  "hebilla-lisa-plata": {
    name: "Hebilla Lisa Plateada",
    price: BUCKLE_PRICE_UNIT,
    unit: "unidad"
  },

  "hebilla-lisa-negra": {
    name: "Hebilla Lisa Negra",
    price: BUCKLE_PRICE_UNIT,
    unit: "unidad"
  },

  "hebilla-giratoria-plata": {
    name: "Hebilla Giratoria Plateada",
    price: BUCKLE_PRICE_UNIT,
    unit: "unidad"
  },

  "hebilla-giratoria-negra": {
    name: "Hebilla Giratoria Negra",
    price: BUCKLE_PRICE_UNIT,
    unit: "unidad"
  }
};

/* =========================
   AGREGAR PRODUCTOS
========================= */

function addProduct(id) {
  const product = productCatalog[id];
  const input = document.getElementById("qty-" + id);

  if (!product || !input) {
    alert("No se encontró el producto seleccionado.");
    return;
  }

  const quantity = Number(input.value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    alert("Ingresa una cantidad válida, como mínimo 1.");
    input.focus();
    return;
  }

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      unitsPerPack: product.unitsPerPack || 1,
      quantity
    });
  }

  updateCart();

  // Confirmación discreta; no abre el carrito.
  const button = document.querySelector(
    `.product[data-id="${id}"] .add-button`
  );

  if (button) {
    const originalText = "AGREGAR AL PEDIDO";
    button.textContent = "AGREGADO ✓";
    button.classList.add("added");

    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("added");
    }, 1200);
  }
}

/* =========================
   CARRITO
========================= */

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.replaceChildren();

  let total = 0;
  let totalUnits = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;

    total += subtotal;

    totalUnits += item.quantity * item.unitsPerPack;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");

    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = item.name;

    const info = document.createElement("div");
    info.className = "cart-item-info";

    if (item.unit === "docena") {
      info.textContent =
        `${item.quantity} docena(s) · ` +
        `${item.quantity * item.unitsPerPack} unidades · ` +
        `S/ ${item.price.toFixed(2)} por docena`;
    } else {
      info.textContent =
        `${item.quantity} unidad(es) · ` +
        `S/ ${item.price.toFixed(2)} por unidad`;
    }

    const subtotalText = document.createElement("div");
    subtotalText.className = "cart-subtotal";
    subtotalText.textContent = `Subtotal: S/ ${subtotal.toFixed(2)}`;

    details.append(title, info, subtotalText);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-item";
    removeButton.textContent = "✕";
    removeButton.setAttribute("aria-label", `Eliminar ${item.name}`);
    removeButton.addEventListener("click", () => removeFromCart(index));

    row.append(details, removeButton);
    cartItems.appendChild(row);
  });

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "Todavía no has agregado productos.";
    cartItems.appendChild(empty);
  }

  cartCount.textContent = totalUnits;
  cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

/* =========================
   ABRIR / CERRAR CARRITO
========================= */

function openCart() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("overlay").classList.add("active");
  document.body.classList.add("panel-open");
}

function toggleCart() {
  const panel = document.getElementById("cart-panel");

  if (panel.classList.contains("open")) {
    closePanels();
  } else {
    openCart();
  }
}

function closePanels() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("filters").classList.remove("open");
  document.getElementById("overlay").classList.remove("active");
  document.body.classList.remove("panel-open");
}

/* =========================
   FINALIZAR POR WHATSAPP
========================= */

function sendWhatsApp() {
  if (cart.length === 0) {
    alert("Agrega productos antes de finalizar tu pedido.");
    return;
  }

  let total = 0;

  let message =
    "Hola EGUIS, deseo realizar este pedido:\n\n";

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;

    total += subtotal;

    if (item.unit === "docena") {
      message +=
        `Producto: ${item.name}\n` +
        `Cantidad: ${item.quantity} docena(s) ` +
        `(${item.quantity * item.unitsPerPack} unidades)\n` +
        `Precio: S/ ${item.price.toFixed(2)} por docena\n` +
        `Subtotal: S/ ${subtotal.toFixed(2)}\n\n`;
    } else {
      message +=
        `Producto: ${item.name}\n` +
        `Cantidad: ${item.quantity} unidad(es)\n` +
        `Precio: S/ ${item.price.toFixed(2)} por unidad\n` +
        `Subtotal: S/ ${subtotal.toFixed(2)}\n\n`;
    }
  });

  message +=
    `TOTAL DEL PEDIDO: S/ ${total.toFixed(2)}\n\n` +
    "Por favor, confirmen disponibilidad, envío y forma de pago.";

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

/* =========================
   FILTROS DE CATEGORÍA
========================= */

document.querySelectorAll('input[name="categoria"]').forEach(radio => {
  radio.addEventListener("change", applyFilters);
});

document.querySelectorAll('input[name="tipoHebilla"]').forEach(radio => {
  radio.addEventListener("change", applyFilters);
});

function showCategory(category) {
  const radio = document.querySelector(
    `input[name="categoria"][value="${category}"]`
  );

  if (radio) {
    radio.checked = true;
    applyFilters();
  }
}

function filterColor(color) {
  selectedColor = color;
  applyFilters();
}

function clearColorFilter() {
  selectedColor = "todos";
  applyFilters();
}

function applyFilters() {
  const category = document.querySelector(
    'input[name="categoria"]:checked'
  )?.value || "todos";

  const buckleType = document.querySelector(
    'input[name="tipoHebilla"]:checked'
  )?.value || "todos";

  document.querySelectorAll(".product").forEach(product => {
    const categoryMatch =
      category === "todos" ||
      product.dataset.category === category;

    const colorMatch =
      selectedColor === "todos" ||
      product.dataset.color === selectedColor;

    const type = product.dataset.buckle || "todos";

    const buckleMatch =
      buckleType === "todos" ||
      type === buckleType ||
      product.dataset.type !== "hebilla";

    product.hidden = !(
      categoryMatch &&
      colorMatch &&
      buckleMatch
    );
  });

  const titles = {
    todos: "Nuestra colección",
    hombre: "Cinturones para hombre",
    mujer: "Cinturones para mujer",
    hebillas: "Hebillas para hombre"
  };

  document.getElementById("catalog-title").textContent =
    titles[category] || titles.todos;
}

/* =========================
   ORDENAR PRODUCTOS
========================= */

document.getElementById("sort-products").addEventListener("change", function () {
  const grid = document.getElementById("products-grid");

  const products = Array.from(grid.querySelectorAll(".product"));

  if (this.value === "price-low") {
    products.sort((a, b) =>
      Number(a.dataset.price) - Number(b.dataset.price)
    );
  } else if (this.value === "price-high") {
    products.sort((a, b) =>
      Number(b.dataset.price) - Number(a.dataset.price)
    );
  } else if (this.value === "name") {
    products.sort((a, b) =>
      a.querySelector("h3").textContent.localeCompare(
        b.querySelector("h3").textContent,
        "es"
      )
    );
  }

  products.forEach(product => grid.appendChild(product));
});

/* =========================
   FILTROS MÓVILES
========================= */

function toggleFilters() {
  const filters = document.getElementById("filters");

  if (filters.classList.contains("open")) {
    closePanels();
  } else {
    closePanels();
    filters.classList.add("open");
    document.getElementById("overlay").classList.add("active");
    document.body.classList.add("panel-open");
  }
}

/* =========================
   MENÚ MÓVIL
========================= */

function toggleMobileMenu() {
  document.getElementById("mobile-menu").classList.toggle("open");
}

/* =========================
   VISOR DE IMÁGENES
========================= */

const visor = document.getElementById("zoomImagen");
const imagenAmpliada = document.getElementById("imagenAmpliada");

document.querySelectorAll(".product-image img").forEach(img => {
  img.addEventListener("click", () => {
    imagenAmpliada.src = img.src;
    imagenAmpliada.alt = img.alt;
    visor.classList.add("activo");
  });

  img.addEventListener("error", () => {
    img.classList.add("image-missing");
  });

  img.addEventListener("load", () => {
    img.classList.remove("image-missing");
  });
});

function closeZoom() {
  visor.classList.remove("activo");
  imagenAmpliada.src = "";
}

visor.addEventListener("click", event => {
  if (event.target === visor) {
    closeZoom();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeZoom();
    closePanels();
    document.getElementById("mobile-menu").classList.remove("open");
  }
});

/* =========================
   INICIALIZAR
========================= */

updateCart();
applyFilters();
