const showButton = document.getElementById("showDialog");
const addBookDialog = document.getElementById("addBookDialog");
const output = document.querySelector("#output");
const form = document.querySelector("form");
const cancelBtn = addBookDialog.querySelector("#cancelBtn");

const lib = [];

function Book(title, author, pages, read){
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read === true || read === "Yes";
    this.info = () => {
        let m = this.title + " by " + this.author + ", " + this.pages + " pages, ";
        m += this.read? "Already read" : "not read yet";
        return m;
    }
}

Book.prototype.toggleReadStatus = function(){
    this.read = !this.read;
}

function addBookToLibrary(sub){
    lib.push(new Book(sub.bookName, sub.author, sub.pages, sub.readOption));
}

const esc = s => String(s).replace(/[&<>"']/g, c => (
    {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));

function displayLibrary(){
    output.innerHTML = lib.length ? lib.map(book => `
        <article class="book ${book.read ? "is-read" : ""}" data-id="${book.id}">
            <h2 class="book-title">${esc(book.title)}</h2>
            <p class="book-author">by ${esc(book.author)}</p>
            <p class="book-pages">${esc(book.pages)} pages</p>
            <span class="stamp">${book.read ? "read" : "not read"}</span>
            <div class="book-actions">
                <button class="btn" data-action="toggle">${book.read ? "Mark unread" : "Mark read"}</button>
                <button class="btn" data-action="remove">Remove</button>
            </div>
        </article>`).join("") : '<p class="empty">no books yet. seriously none.</p>';
}

output.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-action]");
    if (!btn) return;
    const book = lib.find(b => b.id === btn.closest(".book").dataset.id);
    if (!book) return;
    if (btn.dataset.action === "remove") lib.splice(lib.indexOf(book), 1);
    else book.toggleReadStatus();
    displayLibrary();
});


form.addEventListener("submit", () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    form.reset();
    addBookToLibrary(data);
    displayLibrary();
    addBookDialog.close();
});

showButton.addEventListener("click", () => {
    addBookDialog.showModal();
});

cancelBtn.addEventListener("click", () => {
    form.reset();
    addBookDialog.close();
});

addBookToLibrary({ bookName: "Diary of a Wimpy Kid", author: "Jeff Kinney", pages: 224, readOption: "Yes" });
addBookToLibrary({ bookName: "A Game of Thrones", author: "George R.R. Martin", pages: 835, readOption: "Yes" });
displayLibrary();

