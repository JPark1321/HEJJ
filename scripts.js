// Cart functionality
let cart = [];
        
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
    
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 100);
}

function goHome() {
    window.location.href = 'index.html';
}


// Load cart from localStorage on page load
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
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
    let size = document.querySelector('input[name="size"]:checked').value;
    let crust = document.querySelector('input[name="crust"]:checked').value;
    let sauce = document.querySelector('input[name="sauce"]:checked').value;
    let cheese = document.querySelector('input[name="cheese"]:checked').value;
    
    let basePrice = parseFloat(document.querySelector('input[name="size"]:checked').dataset.price);
    
    // Add cheese price modifier if any
    let cheeseElement = document.querySelector('input[name="cheese"]:checked');
    if(cheeseElement.dataset.price) {
        basePrice += parseFloat(cheeseElement.dataset.price);
    }
    
    // Calculate toppings
    let selectedToppings = [];
    let toppingPrice = 0;
    
    toppingInputs.forEach(input => {
        if(input.checked) {
            selectedToppings.push(input.value);
            toppingPrice += parseFloat(input.dataset.price);
        }
    });
    
    // Update summary text
    let summaryHTML = `<p>${size} ${crust} Crust Pizza with ${sauce} Sauce and ${cheese} Cheese</p>`;
    
    if(selectedToppings.length > 0) {
        summaryHTML += `<p>Toppings: ${selectedToppings.join(', ')}</p>`;
    } else {
        summaryHTML += `<p>Toppings: None</p>`;
    }
    
    pizzaSummary.innerHTML = summaryHTML;
    
    // Update price
    let totalPrice = basePrice + toppingPrice;
    pizzaPrice.textContent = `$${totalPrice.toFixed(2)}`;
    
    return {
        size,
        crust,
        sauce,
        cheese,
        toppings: selectedToppings,
        price: totalPrice
    };
}

// Add event listeners to all inputs
sizeInputs.forEach(input => {
    input.addEventListener('change', updatePizzaSummary);
});

crustInputs.forEach(input => {
    input.addEventListener('change', updatePizzaSummary);
});

sauceInputs.forEach(input => {
    input.addEventListener('change', updatePizzaSummary);
});

cheeseInputs.forEach(input => {
    input.addEventListener('change', updatePizzaSummary);
});

toppingInputs.forEach(input => {
    input.addEventListener('change', updatePizzaSummary);
});

// Add custom pizza to cart
addCustomPizzaBtn.addEventListener('click', () => {
    const customPizza = updatePizzaSummary();
    addToCart(`Custom ${customPizza.size} Pizza`, customPizza.price);
});

// Initialize summary
updatePizzaSummary();

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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

    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    // Add each item to the page
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

    // Calculate tax (let's assume 10% sales tax)
    const tax = subtotal * 0.10;
    // Delivery fee (fixed from your HTML)
    const deliveryFee = 3.99;

    // Calculate total
    const total = subtotal + tax + deliveryFee;

    // Update the page
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    deliveryFeeEl.textContent = `$${deliveryFee.toFixed(2)}`; // Always $3.99
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// When page loads, render the cart
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('checkout.html')) {
        renderCart();
    }
});


// Call renderCart when the checkout page loads
if (window.location.pathname.includes('checkout.html')) {
    renderCart();
}