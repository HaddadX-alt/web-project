// Global variables following your basic array logic
var total = 0;
var x = 0;
var cart = []; // Flat array of names
var prices = []; // Flat array of prices
var images = []; // Flat array of images

// Load existing data from Local Storage on page load
if (localStorage.getItem("voguefa_cart_names")) {
    cart = JSON.parse(localStorage.getItem("voguefa_cart_names"));
    prices = JSON.parse(localStorage.getItem("voguefa_cart_prices"));
    images = JSON.parse(localStorage.getItem("voguefa_cart_images"));
    total = parseFloat(localStorage.getItem("voguefa_total")) || 0;
    x = parseInt(localStorage.getItem("voguefa_index")) || 0;
}

function addToCart(price, name, image) {
    // Your basic logic
    total += price;
    cart[x] = name;
    prices[x] = price;
    images[x] = image;
    x += 1;

    // Save to Local Storage to persist across pages
    localStorage.setItem("voguefa_cart_names", JSON.stringify(cart));
    localStorage.setItem("voguefa_cart_prices", JSON.stringify(prices));
    localStorage.setItem("voguefa_cart_images", JSON.stringify(images));
    localStorage.setItem("voguefa_total", total);
    localStorage.setItem("voguefa_index", x);
    
    // Refresh display if on the cart page
    if (document.getElementById("cart-items-body")) {
        display_cart();
    }
}

// assets/js/cart.js

// ... (Keep your existing variable initialization and addToCart logic) ...

function display_cart() {
    var cartTableBody = document.getElementById("cart-items-body"); // For cart.html
    var checkoutSummary = document.getElementById("checkout-summary-list"); // For checkout.html
    var totalArea = document.getElementById("cart-total-amount");
    
    // If neither element exists, we aren't on a cart/checkout page
    if (!cartTableBody && !checkoutSummary) return;

    // Clear previous contents
    if (cartTableBody) cartTableBody.innerHTML = "";
    if (checkoutSummary) checkoutSummary.innerHTML = "";
    
    var currentTotal = 0;

    // STACKING LOGIC: Group identical items for the summary
    var stacked = {};
    for (var i = 0; i < cart.length; i++) {
        var name = cart[i];
        if (stacked[name]) {
            stacked[name].qty += 1;
            stacked[name].subtotal += prices[i];
        } else {
            stacked[name] = { 
                qty: 1, 
                price: prices[i], 
                image: images[i], 
                subtotal: prices[i] 
            };
        }
    }

    // RENDER: Loop through stacked items and display based on which page we are on
    for (var itemName in stacked) {
        var item = stacked[itemName];
        currentTotal += item.subtotal;

        // Logic for cart.html (Table View)
        if (cartTableBody) {
            cartTableBody.innerHTML += `
                <tr>
                    <td style="display:flex; align-items:center; gap:15px; padding:15px;">
                        <img src="${item.image}" style="width:70px; border-radius:8px;">
                        <strong>${itemName}</strong>
                    </td>
                    <td>${item.price.toFixed(2)} JOD</td>
                    <td>${item.qty}</td>
                    <td>${item.subtotal.toFixed(2)} JOD</td>
                    <td>
                        <button onclick="clearItem('${itemName}')" style="color:red; background:none; border:none; cursor:pointer;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }

        // Logic for checkout.html (Summary List View)
        if (checkoutSummary) {
            checkoutSummary.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:14px; padding-bottom:10px; border-bottom:1px solid #eee;">
                    <span><strong>${item.qty}x</strong> ${itemName}</span>
                    <span>${item.subtotal.toFixed(2)} JOD</span>
                </div>`;
        }
    }

    // Update the total display on either page
    if (totalArea) {
        totalArea.innerText = currentTotal.toFixed(2) + " JOD";
    }
}

// Ensure display_cart runs when the page loads
document.addEventListener("DOMContentLoaded", display_cart);
function clearItem(itemName) {
    // Re-build arrays without the deleted item
    var newCart = [], newPrices = [], newImages = [];
    var newTotal = 0;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i] !== itemName) {
            newCart.push(cart[i]);
            newPrices.push(prices[i]);
            newImages.push(images[i]);
            newTotal += prices[i];
        }
    }

    cart = newCart; prices = newPrices; images = newImages;
    total = newTotal; x = cart.length;

    localStorage.setItem("voguefa_cart_names", JSON.stringify(cart));
    localStorage.setItem("voguefa_cart_prices", JSON.stringify(prices));
    localStorage.setItem("voguefa_cart_images", JSON.stringify(images));
    localStorage.setItem("voguefa_total", total);
    localStorage.setItem("voguefa_index", x);

    display_cart();
}

document.addEventListener("DOMContentLoaded", display_cart);