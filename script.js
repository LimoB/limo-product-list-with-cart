const cart = {};
const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartSummary = document.getElementById("cart-summary");

let products = [];

async function loadProducts() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    products = data.map((item, index) => ({
      id: `product-${index}`,
      title: item.name,
      category: item.category,
      price: item.price,
      image: item.image.desktop,
    }));
    renderProducts();
  } catch (error) {
    console.error("Failed to load products:", error);
  }
}

function renderProducts() {
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `card-${product.id}`;

    card.innerHTML = `
      <div class="image-container">
        <img src="${product.image}" alt="${product.title}" />
        <div class="add-to-cart-container" id="add-${product.id}">
          <button class="add-button" onclick="addToCart('${product.id}')">
            <img src="assets/images/icon-add-to-cart.svg" alt="Add to Cart" />
            Add to Cart
          </button>
        </div>
      </div>
      <div class="details">
        <div class="subtitle">${product.category}</div>
        <div class="title">${product.title}</div>
        <div class="price">$${product.price.toFixed(2)}</div>
      </div>
    `;
    productList.appendChild(card);
  });
}

function updateCartUI() {
  const totalItems = Object.values(cart).reduce((a, b) => a + b.quantity, 0);
  cartCount.textContent = totalItems;

  if (totalItems === 0) {
    cartItems.classList.add("empty");
    cartItems.innerHTML = `
      <img src="assets/images/empty-cart.png" alt="Empty cart" />
      <p>Your added items will appear here</p>
    `;
    cartSummary.classList.add("hidden");
    return;
  }

  cartItems.classList.remove("empty");
  cartItems.innerHTML = "";
  let total = 0;

  Object.entries(cart).forEach(([id, item]) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const itemEl = document.createElement("div");
    itemEl.innerHTML = `
      <p>${item.title} <strong>${item.quantity}x</strong> - $${subtotal.toFixed(2)}</p>
    `;
    cartItems.appendChild(itemEl);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartSummary.classList.remove("hidden");
}

function addToCart(id) {
  if (!cart[id]) {
    const product = products.find((p) => p.id === id);
    cart[id] = { ...product, quantity: 1 };
  }

  const addDiv = document.getElementById(`add-${id}`);
  addDiv.innerHTML = `
    <div class="in-cart">
      <span>${cart[id].quantity} in Cart</span>
      <div class="counter">
        <button onclick="decrease('${id}')">
          <img src="assets/images/icon-decrement-quantity.svg" alt="Decrease" />
        </button>
        <span id="qty-${id}">${cart[id].quantity}</span>
        <button onclick="increase('${id}')">
          <img src="assets/images/icon-increment-quantity.svg" alt="Increase" />
        </button>
      </div>
    </div>
  `;
  updateCartUI();
}

function increase(id) {
  cart[id].quantity++;
  document.getElementById(`qty-${id}`).textContent = cart[id].quantity;

  const container = document.getElementById(`add-${id}`);
  if (container) {
    const label = container.querySelector(".in-cart span");
    if (label) {
      label.textContent = `${cart[id].quantity} in Cart`;
    }
  }

  updateCartUI();
}

function decrease(id) {
  cart[id].quantity--;
  if (cart[id].quantity === 0) {
    delete cart[id];
    const addDiv = document.getElementById(`add-${id}`);
    addDiv.innerHTML = `
      <button class="add-button" onclick="addToCart('${id}')">
        <img src="assets/images/icon-add-to-cart.svg" alt="Add to Cart" />
        Add to Cart
      </button>
    `;
  } else {
    document.getElementById(`qty-${id}`).textContent = cart[id].quantity;
    const container = document.getElementById(`add-${id}`);
    if (container) {
      const label = container.querySelector(".in-cart span");
      if (label) {
        label.textContent = `${cart[id].quantity} in Cart`;
      }
    }
  }
  updateCartUI();
}

loadProducts();
