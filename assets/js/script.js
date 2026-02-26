// script.js - TechFix Center Global Scripts

// ==========================================
// 1. Shopping Cart System (LocalStorage)
// ==========================================

// Initialize cart from localStorage or create an empty array
let cart = JSON.parse(localStorage.getItem('techfix_cart')) || [];

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('techfix_cart', JSON.stringify(cart));
    updateCartBadge();
}

// Function to add item to cart
function addToCart(product) {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        // Increment quantity if exists
        cart[existingItemIndex].quantity += (product.quantity || 1);
    } else {
        // Add new item
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price, // ensure price is a number
            image: product.image,
            category: product.category,
            quantity: product.quantity || 1
        });
    }
    
    saveCart();
    showToast();
}

// Function to update item quantity
function updateQuantity(productId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            // Remove if quantity is 0 or less
            cart.splice(itemIndex, 1);
        }
        saveCart();
        // Optional: Trigger a custom event so the cart page can re-render
        if(typeof renderCartItems === 'function') {
            renderCartItems();
        }
    }
}

// Function to remove item completely
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    if(typeof renderCartItems === 'function') {
        renderCartItems();
    }
}

// Function to calculate total items
function getCartTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to calculate cart subtotal
function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to update the small red badge on all cart icons
function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = getCartTotalItems();
    
    badges.forEach(badge => {
        badge.textContent = totalItems;
        // Optionally hide badge if 0
        if (totalItems > 0) {
            badge.style.display = 'flex';
            // Simple pop animation when updated
            badge.classList.remove('scale-100');
            badge.classList.add('scale-125');
            setTimeout(() => {
                badge.classList.remove('scale-125');
                badge.classList.add('scale-100');
            }, 200);
        } else {
            badge.style.display = 'none';
        }
    });
}

// ==========================================
// 2. Toast Notification System
// ==========================================

function showToast(message = "✅ เพิ่มสินค้าลงตะกร้าแล้ว!", duration = 3000) {
    // Check if toast container exists, if not create it
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'bg-white border-l-4 border-green-500 shadow-xl rounded-lg p-4 flex items-center space-x-3 transform transition-all duration-300 translate-x-full opacity-0 pointer-events-auto';
    
    toast.innerHTML = `
        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
            <i class="fas fa-check"></i>
        </div>
        <div>
            <p class="text-sm font-medium text-slate-800">${message}</p>
        </div>
        <button class="ml-auto text-slate-400 hover:text-slate-600 focus:outline-none" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to container
    toastContainer.appendChild(toast);

    // Trigger animation in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    // Trigger animation out
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        
        // Remove from DOM after transition
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// ==========================================
// 3. Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Update badge on initial load
    updateCartBadge();
});
