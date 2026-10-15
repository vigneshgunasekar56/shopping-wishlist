// Your code goes here
let state = [];
const STORAGE_KEY = "wishlistLockerItems";

function makeId() {
  return crypto.randomUUID();
}

function saveState() {
  const text = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, text);
}

function loadState() {
  const text = localStorage.getItem(STORAGE_KEY);

  if (text) {
    const savedItems = JSON.parse(text);
    state.push(...savedItems);
  }
}

function addItem(name, price, note) {
  const item = {
    id: makeId(),
    name: name,
    price: price,
    note: note,
    bought: false,
  };

  state.push(item);
  saveState();
}

function toggleBought(id) {
  const item = state.find((item) => item.id === id);

  if (!item) return;

  item.bought = !item.bought;
  saveState();
}

function formatMoney(amount) {
  return "₹" + amount.toFixed(2);
}

function renderTotals() {
  const left = state.filter((item) => !item.bought);
  const cost = left.reduce((total, item) => total + item.price, 0);

  const totals = document.querySelector("#totals");
  if (!totals) return;

  totals.innerHTML = "";

  const itemsBox = document.createElement("div");
  itemsBox.className = "total-box";
  itemsBox.innerHTML = `
    <span>Items left</span>
    <strong>${left.length}</strong>
  `;

  const costBox = document.createElement("div");
  costBox.className = "total-box";
  costBox.innerHTML = `
    <span>Still to spend</span>
    <strong>${formatMoney(cost)}</strong>
  `;

  totals.append(itemsBox, costBox);
}

function render() {
  renderTotals();
  renderList();
}

function createBoughtCheckbox(item) {
  const label = document.createElement("label");
  label.className = "bought-label";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "bought-check";
  input.checked = item.bought;

  input.addEventListener("change", function () {
    toggleBought(item.id);
    render();
  });

  label.append(input, "Bought");

  return label;
}

function createItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";

  card.append(createBoughtCheckbox(item));

  const top = document.createElement("div");
  top.className = "item-top";

  const name = document.createElement("span");
  name.className = "item-name";
  name.textContent = item.name;

  const price = document.createElement("span");
  price.className = "item-price";
  price.textContent = formatMoney(item.price);

  top.append(name, price);
  card.append(top);

  return card;
}

function renderList() {
  const list = document.querySelector("#item-list");
  list.innerHTML = "";

  if (state.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Your wishlist is empty. Add something you want!";
    list.appendChild(empty);
    return;
  }

  state.forEach(function (item) {
    list.append(createItemCard(item));
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name-input").value.trim();
  const price = parseFloat(document.getElementById("price-input").value);

  if (name === "" || isNaN(price)) {
    return;
  }

  console.log(name, price);

  addItem(name, price, "");

  render();

  console.log(state);

  document.getElementById("name-input").value = "";
  document.getElementById("price-input").value = "";
}

function setUpEvents() {
  document.getElementById("add-form").addEventListener("submit", handleFormSubmit);
}

function startApp() {
  loadState();
  render();
  setUpEvents();
}

startApp();
