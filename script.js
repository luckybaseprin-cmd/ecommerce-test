// Products Data
const products = [
    {
        id: 1,
        name: "Sudadera Premium Essential",
        price: 89.99,
        image: "assets/products/sudadera.png",
        description: "Cortada a mano en algodón egipcio de alto gramaje para una caída perfecta. Diseñada y estructurada de forma minimalista, sin logotipos visibles, solo lujo silencioso en cada puntada."
    },
    {
        id: 2,
        name: "Camiseta Oversize Off-White",
        price: 45.00,
        image: "assets/products/camiseta.png",
        description: "Nuestra icónica camiseta de silueta relajada, confeccionada con hilo premium. El tono hueso lavado aporta un look desgastado y sofisticado, ideal para layering o looks monocromáticos."
    },
    {
        id: 3,
        name: "Chaqueta Bomber Urbana",
        price: 129.50,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Inspiración militar con acabado sartorial. Cremalleras termoselladas, tacto mate e interior relleno para máxima calidez, todo manteniendo una estructura hiper limpia."
    },
    {
        id: 4,
        name: "Pantalones Cargo Techwear",
        price: 75.00,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Utilidad extrema fusionada con alta costura urbana. Múltiples bolsillos invisibles de acceso rápido y tela de secado rápido que repele líquidos."
    },
    {
        id: 5,
        name: "Zapatillas L'Édition",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Piel italiana y silueta contundente. Diseñadas obsesivamente para soportar la vida diaria en la gran ciudad entregando comodidad suprema en cada pisada."
    },
    {
        id: 6,
        name: "Mochila Minimal",
        price: 110.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Capacidad inteligente en un chasis monocasco. Perfecta para nómadas de oficina, incorpora funda acolchada para portátil y un diseño de cremallera anti-hurto."
    }
];

// Cart State
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const header = document.getElementById('header');
const toastContainer = document.getElementById('toast-container');
const cartCountElements = document.querySelectorAll('.cart-count'); 

// Product Page DOM Elements
const singleProductContainer = document.getElementById('single-product-container');

// Cart Page DOM Elements
const cartPageItemsContainer = document.getElementById('cart-page-items');
const cartPageSubtotal = document.getElementById('cart-page-subtotal');
const cartPageTotal = document.getElementById('cart-page-total');
const cartEmptyMsg = document.getElementById('cart-empty-msg');
const cartContent = document.getElementById('cart-content');

// Checkout Page DOM Elements
const checkoutForm = document.getElementById('checkout-form');
const checkoutSummaryItems = document.getElementById('checkout-summary-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const payBtn = document.getElementById('pay-btn');
const payBtnText = document.getElementById('pay-btn-text');
const payLoader = document.getElementById('pay-loader');
const checkoutFormContainer = document.getElementById('checkout-form-container');
const checkoutSuccessWrap = document.getElementById('checkout-success-wrap');
const paymentMethodRadios = document.querySelectorAll('input[name="payment_method"]');
const creditCardDetails = document.getElementById('credit-card-details');
const paypalDetails = document.getElementById('paypal-details');

// Format Currency
const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Initialize App
const init = () => {
    loadCart();

    if (productGrid) renderProducts();
    if (singleProductContainer) renderProductDetailPage();
    if (cartPageItemsContainer) renderCartPage();
    if (checkoutForm) {
        renderCheckoutPage();
        setupCheckoutListeners();
    }
    
    // Header Scroll Effect
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }
};

// Render Products (Index & Shop)
const renderProducts = () => {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('a'); // Make card an anchor
        card.className = 'product-card';
        card.href = `product.html?id=${product.id}`;
        card.style.textDecoration = 'none';
        card.style.color = 'inherit';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" loading="lazy" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-price">${formatMoney(product.price)}</span>
                <button class="add-to-cart-btn" onclick="addToCart(event, ${product.id})">Añadir a la Cesta</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
};

// Render Dynamic Single Product Page
const renderProductDetailPage = () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        singleProductContainer.innerHTML = `<div style="text-align:center; padding: 5rem 0;"><h2>Producto no encontrado.</h2><a href="shop.html" class="btn-outline" style="margin-top:2rem;">Volver a la tienda</a></div>`;
        return;
    }

    // Set Document Title
    document.title = `Lucky Wear | ${product.name}`;

    singleProductContainer.innerHTML = `
        <div class="product-detail-layout">
            <div class="product-detail-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <nav class="breadcrumb">
                    <a href="index.html">Inicio</a> &gt; <a href="shop.html">Tienda</a> &gt; <span>${product.name}</span>
                </nav>
                <h1 class="product-detail-title">${product.name}</h1>
                <p class="product-detail-price">${formatMoney(product.price)}</p>
                <p class="product-detail-desc">${product.description}</p>
                
                <div class="product-detail-options">
                    <p>Talla: <strong>Única / Oversize</strong></p>
                </div>

                <button class="btn-primary product-detail-add" onclick="addToCart(event, ${product.id}); window.location.href='cart.html'">Añadir y Ver Cesta</button>
                
                <div class="product-detail-meta">
                    <ul>
                        <li><i class="fa-solid fa-truck"></i> Envío Express Gratuito Global</li>
                        <li><i class="fa-regular fa-clock"></i> Política de Devolución de 30 Días</li>
                        <li><i class="fa-solid fa-leaf"></i> Materiales 100% Sostenibles / LuckyBase Core</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
};


// Add to Cart Logic
window.addToCart = (event, productId) => {
    if(event) event.preventDefault(); // Prevent navigating if clicked from card button
    if(event) event.stopPropagation();

    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    saveCart();
    updateGlobalCartCount();
    showToast(`${product.name} añadido a la cesta.`);
};

// Remove & Update Quantity functions
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateGlobalCartCount();
    if(cartPageItemsContainer) renderCartPage();
    if(checkoutSummaryItems) renderCheckoutPage();
};

window.updateQuantity = (productId, change) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(productId);
        else {
            saveCart();
            updateGlobalCartCount();
            if(cartPageItemsContainer) renderCartPage();
            if(checkoutSummaryItems) renderCheckoutPage();
        }
    }
};

// Sync global cart nav badges
const updateGlobalCartCount = () => {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);
};

// Persist Cart
const saveCart = () => localStorage.setItem('luckyWearCart', JSON.stringify(cart));
const loadCart = () => {
    const savedCart = localStorage.getItem('luckyWearCart');
    if (savedCart) cart = JSON.parse(savedCart);
    updateGlobalCartCount();
};

/* --- DEDICATED PAGE LOGIC --- */

const renderCartPage = () => {
    cartPageItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContent.style.display = 'none';
        cartEmptyMsg.style.display = 'block';
        return;
    }

    cartContent.style.display = 'grid'; 
    cartEmptyMsg.style.display = 'none';

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-page-row';
        itemRow.innerHTML = `
            <div class="cart-product-cell">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-product-desc">
                    <a href="product.html?id=${item.id}" style="color:inherit; text-decoration:none;"><h4>${item.name}</h4></a>
                    <p class="cart-price-mv">${formatMoney(item.price)}</p>
                    <button class="cart-remove-text" onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
            </div>
            <div class="cart-price-cell">${formatMoney(item.price)}</div>
            <div class="cart-qty-cell">
                <div class="cart-quantity border-qty">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-total-cell">${formatMoney(item.price * item.quantity)}</div>
        `;
        cartPageItemsContainer.appendChild(itemRow);
    });

    cartPageSubtotal.textContent = formatMoney(subtotal);
    cartPageTotal.textContent = formatMoney(subtotal);
};

const renderCheckoutPage = () => {
    checkoutSummaryItems.innerHTML = '';
    
    if(cart.length === 0) {
        window.location.href = 'cart.html'; 
        return;
    }

    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const sumItem = document.createElement('div');
        sumItem.className = 'checkout-sum-item';
        sumItem.innerHTML = `
            <div class="sum-item-img-wrapper">
                <img src="${item.image}" alt="${item.name}">
                <span class="sum-item-badge">${item.quantity}</span>
            </div>
            <div class="sum-item-info">
                <h4>${item.name}</h4>
            </div>
            <div class="sum-item-price">${formatMoney(item.price * item.quantity)}</div>
        `;
        checkoutSummaryItems.appendChild(sumItem);
    });

    checkoutSubtotal.textContent = formatMoney(subtotal);
    checkoutTotal.textContent = formatMoney(subtotal);
};

// Handle Checkout Form Logic & Validation
const setupCheckoutListeners = () => {
    // Payment Method Selection Toggle
    const mainPayBtn = document.getElementById('pay-btn');
    const paypalSubmitBtn = document.getElementById('paypal-submit-btn');

    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'card') {
                creditCardDetails.style.display = 'block';
                paypalDetails.style.display = 'none';
                mainPayBtn.style.display = 'flex';
                if(paypalSubmitBtn) paypalSubmitBtn.style.display = 'none';
                // Demand exact format for card
                document.getElementById('card-owner').required = true;
                document.getElementById('card-number').required = true;
                document.getElementById('card-exp').required = true;
                document.getElementById('card-cvc').required = true;
            } else {
                creditCardDetails.style.display = 'none';
                paypalDetails.style.display = 'flex';
                mainPayBtn.style.display = 'none';
                if(paypalSubmitBtn) paypalSubmitBtn.style.display = 'flex';
                // Remove required status for Paypal bypass
                document.getElementById('card-owner').required = false;
                document.getElementById('card-number').required = false;
                document.getElementById('card-exp').required = false;
                document.getElementById('card-cvc').required = false;
            }
        });
    });

    const executeMockPayment = (e) => {
        if(e) e.preventDefault();
        
        let activeBtn = creditCardDetails.style.display === 'none' ? paypalSubmitBtn : mainPayBtn;
        let originalContent = activeBtn.innerHTML;
        
        activeBtn.disabled = true;
        activeBtn.innerHTML = '<div class="loader" style="display:block; margin:auto;"></div>';

        setTimeout(() => {
            activeBtn.disabled = false;
            activeBtn.innerHTML = originalContent;
            
            checkoutFormContainer.style.display = 'none';
            checkoutSuccessWrap.style.display = 'flex';
            
            cart = [];
            saveCart();
            updateGlobalCartCount();
        }, 1500);
    };

    // Form Submit
    checkoutForm.addEventListener('submit', executeMockPayment);
    if(paypalSubmitBtn) paypalSubmitBtn.addEventListener('click', executeMockPayment);

    // Credit Card Formats
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for(let i = 0; i < value.length; i++) {
                if(i > 0 && i % 4 === 0) formattedValue += ' ';
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });
    }
    const cardExpInput = document.getElementById('card-exp');
    if (cardExpInput) {
        cardExpInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = value.substring(0,2) + '/' + value.substring(2,4);
            e.target.value = value;
        });
    }
};

// Toast
const showToast = (message) => {
    if(!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

init();
