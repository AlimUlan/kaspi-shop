// Firebase Configuration
const firebaseConfig = {
  apiKey: "ВАШ_КЛЮЧ_ИЗ_ФАЙРБЕЙСА",
  authDomain: "ВАШ_ПРОЕКТ.firebaseapp.com",
  databaseURL: "https://ВАШ_ПРОЕКТ.firebaseio.com",
  projectId: "ВАШ_ПРОЕКТ_ID",
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts(filter = "all") {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>₸${p.price.toLocaleString()}</p>
      <button onclick="addToCart(${p.id})">В корзину</button>
    `;
    container.appendChild(card);
  });
}

function filterProducts(category) {
  renderProducts(category);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  updateCart();
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  document.getElementById("cart-count").innerText = cart.length;

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.title} — ₸${item.price}`;
    total += item.price;
    cartItems.appendChild(li);
  });

  document.getElementById("cart-total").innerText = `₸${total.toLocaleString()}`;
}

function toggleCart() {
  document.getElementById("cart-modal").classList.toggle("hidden");
}

function clearCart() {
  cart = [];
  updateCart();
}

function fetchProducts() {
  db.ref("products").once("value").then(snapshot => {
    const data = snapshot.val();
    Object.keys(data).forEach(id => {
      products.push({ id, ...data[id] });
    });
    renderProducts();
    updateCart();
  });
}

function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(query));
  renderProducts(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});