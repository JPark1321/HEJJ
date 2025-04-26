// Cart functionality
let cart = [];

// Load cart from localStorage on page load
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
    
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 100);
}

function goHome() {
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 100);
}

// Custom pizza builder
const sizeInputs = document.querySelectorAll('input[name="size"]');
const crustInputs = document.querySelectorAll('input[name="crust"]');
const sauceInputs = document.querySelectorAll('input[name="sauce"]');
const cheeseInputs = document.querySelectorAll('input[name="cheese"]');
const toppingInputs = document.querySelectorAll('input[name="toppings"]');

const pizzaSummary = document.getElementById('pizza-summary');
const pizzaPrice = document.getElementById('pizza-price');
const addCustomPizzaBtn = document.getElementById('add-custom-pizza');

// Update pizza summary and price
function updatePizzaSummary() {
    const sizeElement = document.querySelector('input[name="size"]:checked');
    const crustElement = document.querySelector('input[name="crust"]:checked');
    const sauceElement = document.querySelector('input[name="sauce"]:checked');
    const cheeseElement = document.querySelector('input[name="cheese"]:checked');
    
    if (!sizeElement || !crustElement || !sauceElement || !cheeseElement) {
        return;
    }

    let size = sizeElement.value;
    let crust = crustElement.value;
    let sauce = sauceElement.value;
    let cheese = cheeseElement.value;
    
    let basePrice = parseFloat(sizeElement.dataset.price) || 0;

    if (cheeseElement.dataset.price) {
        basePrice += parseFloat(cheeseElement.dataset.price);
    }
    
    let selectedToppings = [];
    let toppingPrice = 0;
    
    toppingInputs.forEach(input => {
        if (input.checked) {
            selectedToppings.push(input.value);
            toppingPrice += parseFloat(input.dataset.price) || 0;
        }
    });

    if (pizzaSummary && pizzaPrice) {
        let summaryHTML = `<p>${size} ${crust} Crust Pizza with ${sauce} Sauce and ${cheese} Cheese</p>`;
        
        if (selectedToppings.length > 0) {
            summaryHTML += `<p>Toppings: ${selectedToppings.join(', ')}</p>`;
        } else {
            summaryHTML += `<p>Toppings: None</p>`;
        }
        
        pizzaSummary.innerHTML = summaryHTML;

        let totalPrice = basePrice + toppingPrice;
        pizzaPrice.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    return {
        size,
        crust,
        sauce,
        cheese,
        toppings: selectedToppings,
        price: basePrice + toppingPrice
    };
}

// Add event listeners to pizza builder inputs
[...sizeInputs, ...crustInputs, ...sauceInputs, ...cheeseInputs, ...toppingInputs].forEach(input => {
    input.addEventListener('change', updatePizzaSummary);
});

// Add custom pizza to cart
if (addCustomPizzaBtn) {
    addCustomPizzaBtn.addEventListener('click', () => {
        const customPizza = updatePizzaSummary();
        if (customPizza) {
            addToCart(`Custom ${customPizza.size} Pizza`, customPizza.price);
        }
    });
}

// Initialize summary if possible
if (pizzaSummary && pizzaPrice) {
    updatePizzaSummary();
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Simple script to toggle the delivery option selection
document.querySelectorAll('.delivery-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.delivery-option').forEach(el => {
            el.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});

// Checkout page functionality
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const deliveryFeeEl = document.getElementById('delivery-fee');
    const totalEl = document.getElementById('total');

    if (!cartItemsContainer || !subtotalEl || !taxEl || !deliveryFeeEl || !totalEl) {
        return;
    }

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');
        
        const nameDiv = document.createElement('div');
        nameDiv.textContent = item.name;
        
        const priceDiv = document.createElement('div');
        priceDiv.textContent = `$${item.price.toFixed(2)}`;

        itemDiv.appendChild(nameDiv);
        itemDiv.appendChild(priceDiv);

        cartItemsContainer.appendChild(itemDiv);

        subtotal += item.price;
    });

    const tax = subtotal * 0.10;
    const deliveryFee = 3.99;
    const total = subtotal + tax + deliveryFee;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    deliveryFeeEl.textContent = `$${deliveryFee.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Render cart only when the DOM is ready and on checkout page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('checkout.html')) {
        renderCart();
    }
});

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
    alert('Cart cleared!');
}