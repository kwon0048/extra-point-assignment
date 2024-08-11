// Data: List of products and categories
const products = [
    { id: 1, title: 'Blue T-Shirt', image: 'blue-t-shirt.jpg', price: 7.99, stock: 4, quantity: 1 },
    { id: 2, title: 'Bright Purple T-Shirt', image: 'bright-purple-t-shirt.jpg', price: 5.99, stock: 1, quantity: 1, size: 'M' },
    { id: 3, title: 'Cobalt Blue T-Shirt', image: 'cobalt-blue-t-shirt.jpg', price: 9.99, stock: 5, quantity: 1 },
    { id: 4, title: 'Green T-Shirt', image: 'green-t-shirt.jpg', price: 6.99, stock: 0, quantity: 1 },
    { id: 5, title: 'Grey T-Shirt', image: 'blue-t-shirt.jpg', price: 4.99, stock: 2, quantity: 1 },
    { id: 6, title: 'Light Green T-Shirt', image: 'light-green-t-shirt.jpg', price: 7.99, stock: 4, quantity: 1, size: 'M' },
    { id: 7, title: 'Purple T-Shirt', image: 'purple-t-shirt.jpg', price: 7.99, stock: 0, quantity: 1 },
    { id: 8, title: 'Red T-Shirt', image: 'red-t-shirt.jpg', price: 6.99, stock: 3, quantity: 1 },
    { id: 9, title: 'Teal T-Shirt', image: 'teal-t-shirt.jpg', price: 7.99, stock: 2, quantity: 1, size: 'M' }
];
const categories = ['All', 'T-shirts', 'Electronics', 'Furniture'];
let selectedCategory = 'All';
let cart = [];
let currentSortOption = 'default';
let searchTerm = '';

// Function to display categories
function displayCategories() {
    const $categories = document.getElementById('categories');
    $categories.innerHTML = ''; // Clear existing categories
    const templates = [];

    // Create category elements and add to templates array
    categories.forEach(category => templates.push(`
        <li class="nav-item">
            <a href="#" class="nav-link btn btn-light btn-sm rounded-0 mx-1 ${category === selectedCategory ? 'active' : ''}">
                ${category}
            </a>
        </li>
    `));

    // Add category elements to the DOM
    $categories.innerHTML = templates.join('');
}

// Function to sort products
function sortProducts(products, sortOption) {
    switch (sortOption) {
        case 'priceLowToHigh':
            return [...products].sort((a, b) => a.price - b.price);
        case 'priceHighToLow':
            return [...products].sort((a, b) => b.price - a.price);
        case 'nameAZ':
            return [...products].sort((a, b) => a.title.localeCompare(b.title));
        case 'nameZA':
            return [...products].sort((a, b) => b.title.localeCompare(a.title));
        default:
            return products;
    }
}

// Function to display products
function displayProducts() {
    const $products = document.getElementById('products');
    $products.innerHTML = ''; // Clear existing products

    let filteredProducts = products;

    // Filter products based on search term
    if (searchTerm) {
        filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Sort the filtered products
    const sortedProducts = sortProducts(filteredProducts, currentSortOption);

    // Create product elements
    sortedProducts.forEach(product => {
        const $product = document.createElement('div');
        $product.className = "product col col-12 col-md-6 col-lg-4 p-3 bg-light d-flex flex-column";

        // Create image button for the product
        const $imageButton = document.createElement('button');
        $imageButton.type = 'button';
        $imageButton.className = 'btn image-button';
        $imageButton.setAttribute('data-bs-toggle', 'modal');
        $imageButton.setAttribute('data-bs-target', '#exampleModal');

        // Create image element for the product
        const $image = document.createElement('img');
        $image.className = "img-fluid image-product";
        $image.src = `images/${product.image}`;
        $image.alt = product.title;
        $image.dataset.productId = product.id;
        $image.dataset.productTitle =  product.title;
        $imageButton.appendChild($image);
        $product.appendChild($imageButton);

        // Create title element for the product
        const $title = document.createElement('h2');
        $title.textContent = product.title;

        // Create details container
        const $details = document.createElement('div');
        $details.className = "d-flex flex-column justify-content-between flex-grow-1";
        $details.appendChild($title);

        // Create price container
        const $priceContainer = document.createElement('div');
        $priceContainer.className = "d-flex justify-content-between";

        // Create price element
        const $price = document.createElement('p');
        const $strong = document.createElement('strong');
        const $em = document.createElement('em');
        $em.textContent = '$' + product.price.toFixed(2); // Ensure price has two decimal places
        $strong.appendChild($em);
        $price.appendChild($strong);
        $priceContainer.appendChild($price);

        // Create buy button for the product
        const $buyButton = document.createElement('button');
        $buyButton.className = "btn btn-secondary rounded-0 buy-button";
        $buyButton.textContent = "Buy";
        $buyButton.dataset.productTitle = product.title;
        $buyButton.dataset.productPrice = product.price;

        $priceContainer.appendChild($buyButton);
        $details.appendChild($priceContainer);
        $product.appendChild($details);
        $products.appendChild($product);
    });

    // Display a message if no products are found
    if (sortedProducts.length === 0) {
        $products.innerHTML = '<p class="col-12">No products found.</p>';
    }
}

// Function to display product on the cart
function displayCart() {
    const htmlTemplate = [];
    let total = 0;

    // Create cart item elements
    cart.forEach((item, index) => {
        htmlTemplate.push(`
            <li class="list-group-item d-flex justify-content-between">
            ${item.title}:
            <div>
                <em>$${item.price.toFixed(2)}</em>
                <button type="button" class="btn btn-light btn-sm round-0 text-danger delete-button" data-index="${index}">x</button>
            </div>
            </li>
        `);
        total += item.price;
    });

    // Create total price element
    htmlTemplate.push(`
        <li class="list-group-item d-flex justify-content-between">
            Total:<strong><em>$${total.toFixed(2)}</em></strong>
        </li>
    `);
    document.getElementById('cart').innerHTML = htmlTemplate.join('');
}

// Function to add a product to the cart
function addToCart(title, price) {
    cart.push({ title, price });
    displayCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to populate the modal with product details
function populateModal(product) {
    const $modalBody = document.querySelector('.modal-body');
    const htmlTemplate = [];

    // Create input fields for each product property (except title and image)
    Object.entries(product).forEach(([key, value]) => {
        if (key !== 'image') {
            htmlTemplate.push(`
                <div class="input-group mb-3">
                    <span class="input-group-text w-25">${key}</span>
                    <input type="text" class="form-control" name="${key}" value="${value}" ${key === 'id'?'disabled':''}>
                </div>
            `);
        }
    });

    // Add product property fields to the modal body
    $modalBody.innerHTML = htmlTemplate.join('');
}

// Function to handle modal form submission
function handleModalFormSubmit(event) {
    event.preventDefault();
    const $modalForm = document.getElementById('modalForm');
    // Update product properties based on form inputs
    const foundProduct = products.find(item => item.id == $modalForm.elements.id.value);
    console.log($modalForm.elements.id.value);
    for (const element of $modalForm.elements) {
        if (element.name) {
            if (element.name === 'price' || element.name === 'id') {
                foundProduct[element.name] = parseFloat(element.value); // Ensure price is a number
            } else {
                foundProduct[element.name] = element.value;
            }
        }
    }

    // Re-render products and reinitialize event listeners
    displayProducts();
}

// Function to save sort option to localStorage
function saveSortOption(option) {
    localStorage.setItem('sortOption', option);
}

// Function to load sort option from localStorage
function loadSortOption() {
    const savedOption = localStorage.getItem('sortOption');
    if (savedOption) {
        currentSortOption = savedOption;
        document.getElementById('sortSelect').value = savedOption;
    }
}

// Function to handle search input
function handleSearch(e) {
    searchTerm = e.target.value;
    displayProducts();
}

// Initialize the app
function initializeApp() {
    displayCategories();
    loadSortOption();
    displayProducts();
    
    // Load cart from localStorage
    const loadCartFromLocalStorage = JSON.parse(localStorage.getItem('cart'));
    if (loadCartFromLocalStorage) {
        cart = loadCartFromLocalStorage;
        displayCart();
    }

    // Add event listener for search input
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for modal form submission
    const $modalForm = document.getElementById('modalForm');
    $modalForm.addEventListener('submit', handleModalFormSubmit);

    // Event listener for products section
    const $products = document.getElementById('products');
    $products.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-button')) {
            addToCart(e.target.dataset.productTitle, parseFloat(e.target.dataset.productPrice));
        }

        if (e.target.classList.contains('image-product')) {
            const foundProduct = products.find(item => item.id == e.target.dataset.productId);
            populateModal(foundProduct);
        }
    });

    // Event listener for cart section
    const $cartSection = document.getElementById('cart');
    $cartSection.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-button')) {
            const indexToRemove = e.target.dataset.index;
            cart.splice(indexToRemove, 1);
            displayCart();
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    });

    // Event listener for sort select
    document.getElementById('sortSelect').addEventListener('change', function(e) {
        currentSortOption = e.target.value;
        saveSortOption(currentSortOption);
        displayProducts();
    });

    // Initialize the app
    initializeApp();
});