const API_BASE = 'http://localhost:8000/api';
let currentUser = null;

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products/`);
        const products = await response.json();
        const container = document.getElementById('products-container');
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" class="product-image" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn" onclick="toggleFavorite(${product.id})">♥</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function addToCart(productId) {
    if (!checkAuth()) return;
    
    try {
        const response = await fetch(`${API_BASE}/cart/items/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

async function loginUser(event) {
    event.preventDefault();
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch(`${API_BASE}/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        window.location.href = '/';
    } catch (error) {
        alert('Login failed');
    }
}

function checkAuth() {
    if (!localStorage.getItem('access_token')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('access_token')) {
        document.getElementById('auth-buttons').innerHTML = `
            <a href="profile.html">Profile</a>
            <button class="btn" onclick="logout()">Logout</button>
        `;
    }
    loadProducts();
    updateCartCount();
});