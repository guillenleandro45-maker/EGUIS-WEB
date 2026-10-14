
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
 "hebilla-giratoria-yin yan": {
    name: "Hebilla Giratoria - Yin Yan",
    price: 5,
    unit: "unidad"
  },
  "hebilla-giratoria-caballo": {
    name: "Hebilla Giratoria - caballo",
    price: 5,
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

  if (!cartItems || !cartCount || !cartTotal) return;

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
    subtotalText.textContent =
      `Subtotal: S/ ${subtotal.toFixed(2)}`;

    details.append(title, info, subtotalText);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-item";
    removeButton.textContent = "✕";
    removeButton.setAttribute(
      "aria-label",
      `Eliminar ${item.name}`
    );

    removeButton.addEventListener("click", () => {
      removeFromCart(index);
    });

    row.append(details, removeButton);
    cartItems.appendChild(row);
  });

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent =
      "Todavía no has agregado productos.";

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
  document.getElementById("cart-panel")
    ?.classList.add("open");

  document.getElementById("overlay")
    ?.classList.add("active");

  document.body.classList.add("panel-open");
}

function toggleCart() {
  const panel = document.getElementById("cart-panel");

  if (!panel) return;

  if (panel.classList.contains("open")) {
    closePanels();
  } else {
    openCart();
  }
}

function closePanels() {
  document.getElementById("cart-panel")
    ?.classList.remove("open");

  document.getElementById("filters")
    ?.classList.remove("open");

  document.getElementById("overlay")
    ?.classList.remove("active");

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
   FILTROS DEL CATÁLOGO
========================= */

function getCheckedValue(name, fallback = "todos") {
  return document.querySelector(
    `input[name="${name}"]:checked`
  )?.value || fallback;
}

function setRadioValue(name, value) {
  const radio = document.querySelector(
    `input[name="${name}"][value="${value}"]`
  );

  if (radio) radio.checked = true;
}

function showCategory(category) {
  /*
    Compatible con los enlaces del menú actual:
    HOMBRE, MUJER y HEBILLAS.
  */

  if (category === "hombre") {
    setRadioValue("categoria", "cinturones");
    setRadioValue("publico", "hombre");
  } else if (category === "mujer") {
    setRadioValue("categoria", "cinturones");
    setRadioValue("publico", "mujer");
  } else if (category === "hebillas") {
    setRadioValue("categoria", "hebillas");
    setRadioValue("publico", "todos");
  } else {
    setRadioValue("categoria", "todos");
    setRadioValue("publico", "todos");
  }

  selectedColor = "todos";
  setRadioValue("tipoHebilla", "todos");

  updateColorButtons();
  applyFilters();
  closeMobileMenu();
}

function filterColor(color) {
  selectedColor = color;
  updateColorButtons();
  applyFilters();
}

function clearColorFilter() {
  selectedColor = "todos";
  updateColorButtons();
  applyFilters();
}

function updateColorButtons() {
  document.querySelectorAll(".color-options .color")
    .forEach(button => {
      const title = (button.title || "").toLowerCase();

      const buttonColor =
        title === "negro" ? "negro" :
        title === "marrón" || title === "marron" ? "marron" :
        title === "beige" ? "beige" : "";

      button.classList.toggle(
        "selected",
        selectedColor !== "todos" &&
        buttonColor === selectedColor
      );
    });

  document.querySelectorAll(".clear-color")
    .forEach(button => {
      button.classList.toggle(
        "selected",
        selectedColor === "todos"
      );
    });
}

function resetFilters() {
  setRadioValue("categoria", "todos");
  setRadioValue("publico", "todos");
  setRadioValue("tipoHebilla", "todos");

  selectedColor = "todos";

  updateColorButtons();
  applyFilters();
}

function applyFilters() {
  const category = getCheckedValue("categoria");
  const audience = getCheckedValue("publico");
  const buckleType = getCheckedValue("tipoHebilla");

  const buckleGroup =
    document.getElementById("buckle-filter-group");

  /*
    Oculta el filtro de hebillas si se eligieron
    cinturones o el público mujer.
  */
  const showBuckleFilter =
    category !== "cinturones" &&
    audience !== "mujer";

  if (buckleGroup) {
    buckleGroup.hidden = !showBuckleFilter;
  }

  let visibleCount = 0;

  document.querySelectorAll(".product").forEach(product => {
    const productType = product.dataset.type || "";
    const productCategory = product.dataset.category || "";
    const productColor = product.dataset.color || "";
    const productBuckle = product.dataset.buckle || "";

    const isBelt = productType === "cinturon";
    const isBuckle = productType === "hebilla";

    // Categoría: cinturones o hebillas.
    const categoryMatch =
      category === "todos" ||
      (category === "cinturones" && isBelt) ||
      (category === "hebillas" && isBuckle);

    // Público: los cinturones tienen categoría hombre/mujer.
    // Las hebillas se consideran de hombre en este catálogo.
    const audienceMatch =
      audience === "todos" ||
      (audience === "hombre" &&
        (productCategory === "hombre" || isBuckle)) ||
      (audience === "mujer" &&
        productCategory === "mujer" && isBelt);

    // Color.
    const colorMatch =
      selectedColor === "todos" ||
      productColor === selectedColor;

    /*
      Cuando se selecciona Lisa o Giratoria,
      se muestran únicamente hebillas de ese tipo.
    */
    const buckleMatch =
      buckleType === "todos" ||
      (isBuckle && productBuckle === buckleType);

    const visible =
      categoryMatch &&
      audienceMatch &&
      colorMatch &&
      buckleMatch;

    product.hidden = !visible;

    if (visible) visibleCount++;
  });

  const titles = {
    todos: "Nuestra colección",
    cinturones: "Nuestros cinturones",
    hebillas: "Nuestras hebillas"
  };

  const titleElement = document.getElementById("catalog-title");

  if (titleElement) {
    if (audience === "hombre" && category === "cinturones") {
      titleElement.textContent = "Cinturones para hombre";
    } else if (
      audience === "mujer" &&
      category === "cinturones"
    ) {
      titleElement.textContent = "Cinturones para mujer";
    } else {
      titleElement.textContent = titles[category] || titles.todos;
    }
  }

  const countElement = document.getElementById("filter-results-count");

  if (countElement) {
    countElement.textContent =
      `${visibleCount} producto(s) encontrado(s)`;
  }
}

/* =========================
   FILTROS MÓVILES
========================= */

function toggleFilters() {
  const filters = document.getElementById("filters");

  if (!filters) return;

  if (filters.classList.contains("open")) {
    closePanels();
  } else {
    closePanels();
    filters.classList.add("open");

    document.getElementById("overlay")
      ?.classList.add("active");

    document.body.classList.add("panel-open");
  }
}

/* =========================
   MENÚ MÓVIL
========================= */

function toggleMobileMenu() {
  document.getElementById("mobile-menu")
    ?.classList.toggle("open");
}

function closeMobileMenu() {
  document.getElementById("mobile-menu")
    ?.classList.remove("open");
}

/* =========================
   VISOR DE IMÁGENES
========================= */

const visor = document.getElementById("zoomImagen");
const imagenAmpliada = document.getElementById("imagenAmpliada");

document.querySelectorAll(".product-image img").forEach(img => {
  img.addEventListener("click", () => {
    if (!visor || !imagenAmpliada) return;

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
  visor?.classList.remove("activo");

  if (imagenAmpliada) {
    imagenAmpliada.src = "";
  }
}

visor?.addEventListener("click", event => {
  if (event.target === visor) {
    closeZoom();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeZoom();
    closePanels();
    closeMobileMenu();
  }
});

/* =========================
   INICIALIZAR
========================= */

document.querySelectorAll(
  'input[name="categoria"], input[name="publico"], input[name="tipoHebilla"]'
).forEach(radio => {
  radio.addEventListener("change", () => {
    const category = getCheckedValue("categoria");
    const audience = getCheckedValue("publico");

    if (
      category === "cinturones" ||
      audience === "mujer"
    ) {
      setRadioValue("tipoHebilla", "todos");
    }

    applyFilters();
  });
});

updateCart();
updateColorButtons();
applyFilters();
