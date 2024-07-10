document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const bookList = document.getElementById('books');
    const searchInput = document.getElementById('search');
    const historyList = document.getElementById('history');

    let books = [];
    let borrowHistory = [];

    // Load books and history from localStorage
    if(localStorage.getItem('books')) {
        books = JSON.parse(localStorage.getItem('books'));
        renderBooks(books);
    }

    if(localStorage.getItem('borrowHistory')) {
        borrowHistory = JSON.parse(localStorage.getItem('borrowHistory'));
        renderHistory(borrowHistory);
    }

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const category = document.getElementById('category').value;

        const book = { title, author, category };
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks(books);
        
        bookForm.reset();
    });

    bookList.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            const title = e.target.dataset.title;
            books = books.filter(book => book.title !== title);
            localStorage.setItem('books', JSON.stringify(books));
            renderBooks(books);

            const date = new Date().toLocaleString();
            borrowHistory.push({ title, date });
            localStorage.setItem('borrowHistory', JSON.stringify(borrowHistory));
            renderHistory(borrowHistory);
        }
    });

    historyList.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON') {
            const index = e.target.dataset.index;
            borrowHistory.splice(index, 1);
            localStorage.setItem('borrowHistory', JSON.stringify(borrowHistory));
            renderHistory(borrowHistory);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
        renderBooks(filteredBooks);
    });

    function renderBooks(books) {
        bookList.innerHTML = books.map(book => `
            <li>
                <span>${book.title} by ${book.author} [${book.category}]</span>
                <button data-title="${book.title}">Borrow</button>
            </li>
        `).join('');
    }

    function renderHistory(history) {
        historyList.innerHTML = history.map((record, index) => `
            <li>
                <span>${record.title} borrowed on ${record.date}</span>
                <button data-index="${index}">Delete</button>
            </li>
        `).join('');
    }
});
