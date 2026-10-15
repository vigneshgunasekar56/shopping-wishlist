// Your code goes here
import formatMoney from "./formatMoney.js";

let state = [];
let editingId=null;
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

function updateItem(id, name, price, note) {
  const item = state.find(item => item.id === id);

  if (!item) return;

  item.name = name;
  item.price = price;
  item.note = note;

  saveState();
}

function createActionRow(item) {
  const actions = document.createElement("div");
  actions.className = "item-actions";

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.type = "button";

  editButton.addEventListener("click", function () {
    startEditing(item.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.type = "button";
  deleteButton.className = "delete-button";

  deleteButton.addEventListener("click", function () {
    deleteItem(item.id);

    if (editingId === item.id) {
      stopEditing();
    }

    render();
  });

  actions.append(editButton, deleteButton);
  return actions;
}

function toggleBought(id) {
  const item = state.find(item => item.id === id);

  if (!item) return;

  item.bought = !item.bought;
  saveState();
  render();
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
});

  label.append(input, "Bought");

  return label;
}

function createItemCard(item) {
  const card = document.createElement("div");
  card.className = item.bought ? "item-card bought" : "item-card";

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

  card.append(createActionRow(item));
  return card;
}

function startEditing(id) {
  const item = state.find(item => item.id === id);
  if (!item) return;

  editingId = id;

  document.querySelector("#name-input").value = item.name;
  document.querySelector("#price-input").value = item.price;
  document.querySelector("#form-title").textContent = "Edit item";
  document.querySelector("#submit-button").textContent = "Save changes";
  document.querySelector("#cancel-button").classList.remove("hidden");
  document.querySelector("#name-input").focus();
}

function stopEditing() {
  editingId = null;

  document.querySelector("#add-form").reset();
  document.querySelector("#form-title").textContent = "Add an item";
  document.querySelector("#submit-button").textContent = "Add to list";
  document.querySelector("#cancel-button").classList.add("hidden");
}

function deleteItem(id) {
  state = state.filter(item => item.id !== id);
  saveState();
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

 if (editingId !== null) {
  const item = state.find(item => item.id === editingId);

  if (!item) return;

  const note = item.note;
  updateItem(editingId, name, price, note);
  stopEditing();
} else {
  addItem(name, price, "");
  document.querySelector("#add-form").reset();
}

render();
console.log(state);
}

function setUpEvents() {
  document
    .querySelector("#add-form")
    .addEventListener("submit", handleFormSubmit);

  document
    .querySelector("#cancel-button")
    .addEventListener("click", stopEditing);
}

function startApp() {
  loadState();
  render();
  setUpEvents();
}

startApp();
