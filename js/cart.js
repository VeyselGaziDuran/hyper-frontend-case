let cart = [];

function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error("Error loading cart from localStorage:", e);
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    if (!product || !product.id) {
        console.error("Invalid product", product);
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showAddedToCartNotification(product.name);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartUI();
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + (price * item.quantity);
    }, 0);
}

// Update cart UI
function updateCartUI() {
    const cartBadge = document.querySelector('.cart-badge');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.dropdown-menu .border-top small.text-orange');
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    
    // Update cart badge
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        // Show/hide badge based on cart count
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
    
    // Update cart dropdown header
    const cartHeader = document.querySelector('.dropdown-menu .dropdown-header');
    if (cartHeader) {
        cartHeader.textContent = `Your Cart (${cartCount})`;
    }
    
    // Update cart items list
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="text-center py-3"><p class="mb-0">Your cart is empty</p></div>';
        } else {
            let html = '';
            cart.forEach(item => {
                const itemTotal = (parseFloat(item.price) * item.quantity).toLocaleString('tr-TR');
                html += `
                <div class="cart-item d-flex align-items-center mb-2">
                    <img src="${item.image}" class="cart-item-img rounded me-2" alt="${item.name}" 
                         onerror="this.src='https://picsum.photos/40'">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 text-truncate cart-item-title">${item.name}</h6>
                        <div class="d-flex justify-content-between mt-1">
                            <small class="text-orange">₺${item.price}</small>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm p-0 me-2 decrease-qty" data-id="${item.id}">-</button>
                                <small>x${item.quantity}</small>
                                <button class="btn btn-sm p-0 ms-2 increase-qty" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-sm text-danger ms-2 remove-item-btn" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>`;
            });
            cartItemsContainer.innerHTML = html;
            
            // Add event listeners for removing items
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    removeFromCart(productId);
                });
            });
            
            // Add event listeners for quantity buttons
            document.querySelectorAll('.decrease-qty').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    const item = cart.find(item => item.id === productId);
                    if (item) updateQuantity(productId, item.quantity - 1);
                });
            });
            
            document.querySelectorAll('.increase-qty').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    const item = cart.find(item => item.id === productId);
                    if (item) updateQuantity(productId, item.quantity + 1);
                });
            });
        }
    }
    
    if (totalElement) {
        const total = getCartTotal().toLocaleString('tr-TR');
        totalElement.textContent = `₺${total}`;
    }
}

function showAddedToCartNotification(productName) {
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show';
    notification.role = 'alert';
    notification.innerHTML = `
        <strong>Added to cart:</strong> ${productName}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 150);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    initCart();
    
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            cart = [];
            saveCart();
            updateCartUI();
        });
    }
});
