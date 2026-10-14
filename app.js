// Your code goes here
const state=[];

function makeId() {
    return crypto.randomUUID();
}

function addItem(name, price, note) {
  const item = {
    id: makeId(),
    name: name,
    price: price,
    note: note,
    bought: false
  };

  state.push(item);
}

function renderList() {
    const list = document.querySelector("#item-list");
    list.innerHTML = "";
    
    const empty=document.createElement("p");
    empty.className="empty-message";
    empty.textContent = "Your wishlist is empty. Add something you want!";
    list.appendChild(empty);
}

//handleformsubmit prevents the empty form submission and saves the data in the form.

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name-input").value.trim();
  const price = parseFloat(document.getElementById("price-input").value);

  if (name === "" || isNaN(price)) {
    return;
  }

  console.log(name, price);

  addItem(name, price, "");

  console.log(state);

  document.getElementById("name-input").value = "";
  document.getElementById("price-input").value = "";
}

function setUpEvents() {
    document.getElementById("add-form").addEventListener("submit", handleFormSubmit);
}

function startApp() {
    renderList();
    setUpEvents();
}

startApp();