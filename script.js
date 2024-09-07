const baseURL = "https://api.nytimes.com/svc/books/v3/lists/2019-01-20/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b";
let booklist = [];
let currentPage = 1;
const booksPerPage = 5;

window.onload = () => {
    const fetchButton = document.getElementById("fetchButton");
    const sortSelect = document.getElementById("sortSelect");
    const filterInput = document.getElementById("filterInput");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");

    fetchButton.addEventListener('click', fetchBooks);
    sortSelect.addEventListener('change', renderBooks);
    filterInput.addEventListener('input', renderBooks);
    prevPageButton.addEventListener('click', () => changePage(-1));
    nextPageButton.addEventListener('click', () => changePage(1));
};

async function fetchBooks() {
    try {
        document.getElementById("loading").style.display = "block";
        document.getElementById("errorMessage").innerText = "";
        const response = await fetch(baseURL);
        const data = await response.json();
        booklist = data.results.books;
        renderBooks();
    } catch (error) {
        console.error(error);
        document.getElementById("errorMessage").innerText = "Failed to fetch data. Please try again later.";
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

function renderBooks() {
    const sortBy = document.getElementById("sortSelect").value;
    const filterText = document.getElementById("filterInput").value.toLowerCase();
    const filteredBooks = booklist
        .filter(book => book.title.toLowerCase().includes(filterText) || book.author.toLowerCase().includes(filterText))
        .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const paginatedBooks = filteredBooks.slice(start, end);

    document.getElementById("booklist").innerHTML = paginatedBooks.map(createBookHTML).join('');
    updatePagination(filteredBooks.length);
}

function createBookHTML(book) {
    return `
        <div class="single-book">
            <img src="${book.book_image}" class="book-image" alt="${book.title}">
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-desc">${book.description}</div>
            </div>
        </div>
    `;
}

function updatePagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    document.getElementById("pageInfo").innerText = `Page ${currentPage}`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;
    
    // Generate page number buttons
    const pageNumbersContainer = document.getElementById("pageNumbers");
    pageNumbersContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = 'page-number';
        pageButton.disabled = i === currentPage;
        pageButton.addEventListener('click', () => goToPage(i));
        pageNumbersContainer.appendChild(pageButton);
    }
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    renderBooks();
}

function changePage(delta) {
    currentPage += delta;
    renderBooks();
}
