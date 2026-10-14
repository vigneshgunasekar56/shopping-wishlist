// Your code goes here

function renderList() {
    const list = document.querySelector("#item-list");
    list.innerHTML = "";
    
    const empty=document.createElement("p");
    empty.className="empty-message";
    empty.textContent = "Your wishlist is empty. Add something you want!";
    list.appendChild(empty);
}

function startApp() {
    renderList();
}

startApp();