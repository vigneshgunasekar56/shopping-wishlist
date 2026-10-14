// Your code goes here

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
}

function setUpEvents() {
    document.getElementById("add-form").addEventListener("submit", handleFormSubmit);
}

function startApp() {
    renderList();
    setUpEvents();
}

startApp();