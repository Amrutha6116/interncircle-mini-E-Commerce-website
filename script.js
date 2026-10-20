const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        description: "Enjoy your favorite music with rich sound.",
        image: "headphone.jpeg",
        background: "#e8edff"
    },
    {
        id: 2,
        name: "Classic Wrist Watch",
        category: "Accessories",
        price: 999,
        description: "A timeless design for every occasion.",
        image: "watch.jpeg",
        background: "#f8eadf"
    },
    {
        id: 3,
        name: "Everyday Backpack",
        category: "Lifestyle",
        price: 1299,
        description: "Carry your essentials in style.",
        image: "bag.jpeg",
        background: "#e5f3e9"
    },
    {
        id: 4,
        name: "Smart Water Bottle",
        category: "Lifestyle",
        price: 499,
        description: "A reusable companion for busy days.",
        image: "bottle.jpeg",
        background: "#f4e8ff"
    },
    {
        id: 5,
        name: "Running Sneakers",
        category: "Footwear",
        price: 1799,
        description: "Comfort and support for every step.",
        image: "Sneakers.jpeg",
        background: "#fff0dc"
    },
    {
        id: 6,
        name: "Desk Lamp",
        category: "Home",
        price: 699,
        description: "Brighten your desk or study corner.",
        image: "lamp.jpeg",
        background: "#e5efff"
    },
    {
        id: 7,
        name: "Travel Mug",
        category: "Accessories",
        price: 399,
        description: "Take your favorite drink on the go.",
        image: "travelmug.jpeg",
        background: "#ffebee"
    },
    {
        id: 8,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 599,
        description: "A compact mouse for work and study.",
        image: "mouse.jpeg",
        background: "#e6f7f5"
    }
];

const productGrid = document.getElementById("product-grid");
const productCount = document.getElementById("product-count");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-button");
const cartToggle = document.getElementById("cart-toggle");

const checkoutModal = document.getElementById("checkout-modal");
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const closeModalButton = document.getElementById("close-modal");
const continueShoppingButton = document.getElementById("continue-shopping");
const placeOrderButton = document.getElementById("place-order");
const toast = document.getElementById("toast");

let cart = [];
let toastTimer;

// Format prices consistently in Indian rupees.
function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

// Create elements safely instead of inserting user-controlled HTML.
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

// Render all products from the JavaScript objects.
function renderProducts() {
    productGrid.replaceChildren();
    productCount.textContent = `${products.length} products`;

    products.forEach((product) => {
        const card = createElement("article", "product-card");

        const imageWrapper = createElement("div", "product-image");
        imageWrapper.style.setProperty("--product-bg", product.background);

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.removeAttribute("src");
            imageWrapper.textContent = product.name;
        }, { once: true });

        imageWrapper.append(image);

        const info = createElement("div", "product-info");
        const category = createElement("p", "product-category", product.category);
        const name = createElement("h3", "", product.name);
        const description = createElement("p", "product-description", product.description);
        const bottom = createElement("div", "product-bottom");
        const price = createElement("span", "product-price", formatPrice(product.price));
        const addButton = createElement("button", "add-button", "＋ Add to Cart");

        addButton.type = "button";
        addButton.addEventListener("click", () => addToCart(product.id));

        bottom.append(price, addButton);
        info.append(category, name, description, bottom);
        card.append(imageWrapper, info);
        productGrid.append(card);
    });
}

// Add a product or increase its quantity.
function addToCart(productId) {
    const product = products.find((item) => item.id === productId);

    if (!product) return;

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    showToast(`${product.name} added to cart!`);
}

// Calculate the number of individual items.
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Calculate the full cart price.
function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Update the shopping cart and all totals.
function renderCart() {
    cartItems.replaceChildren();

    const itemCount = getCartCount();
    const total = getCartTotal();

    cartCount.textContent = itemCount;
    cartTotal.textContent = formatPrice(total);
    checkoutButton.disabled = cart.length === 0;
    clearCartButton.disabled = cart.length === 0;
    clearCartButton.style.opacity = cart.length === 0 ? "0.45" : "1";

    if (cart.length === 0) {
        cartItems.append(
            createElement("p", "empty-message", "Your cart is empty. Add something you love!")
        );
        return;
    }

    cart.forEach((item) => {
        const row = createElement("article", "cart-item");

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        image.addEventListener("error", () => image.removeAttribute("src"), { once: true });

        const details = createElement("div");
        details.append(
            createElement("h3", "", item.name),
            createElement("p", "cart-item-price", `${formatPrice(item.price)} each`)
        );

        const quantityControls = createElement("div", "quantity-controls");
        const decreaseButton = createElement("button", "", "−");
        decreaseButton.type = "button";
        decreaseButton.setAttribute("aria-label", `Decrease ${item.name} quantity`);
        decreaseButton.addEventListener("click", () => changeQuantity(item.id, -1));

        const quantity = createElement("span", "", item.quantity);

        const increaseButton = createElement("button", "", "+");
        increaseButton.type = "button";
        increaseButton.setAttribute("aria-label", `Increase ${item.name} quantity`);
        increaseButton.addEventListener("click", () => changeQuantity(item.id, 1));

        quantityControls.append(decreaseButton, quantity, increaseButton);

        const subtotal = createElement("strong", "", formatPrice(item.price * item.quantity));

        const removeButton = createElement("button", "remove-button", "×");
        removeButton.type = "button";
        removeButton.setAttribute("aria-label", `Remove ${item.name}`);
        removeButton.addEventListener("click", () => removeFromCart(item.id));

        row.append(image, details, quantityControls, subtotal, removeButton);
        cartItems.append(row);
    });
}

// Increase or decrease an item's quantity.
function changeQuantity(productId, change) {
    const item = cart.find((product) => product.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter((product) => product.id !== productId);
    }

    renderCart();
}

// Remove an item entirely.
function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    renderCart();
    showToast("Item removed from cart.");
}

// Clear every cart item.
clearCartButton.addEventListener("click", () => {
    if (cart.length === 0) return;

    cart = [];
    renderCart();
    showToast("Your cart has been cleared.");
});

// Scroll to the cart section.
cartToggle.addEventListener("click", () => {
    document.getElementById("cart-section").scrollIntoView({
        behavior: "smooth"
    });
});

// Build the checkout preview using the current cart.
function openCheckout() {
    if (cart.length === 0) return;

    checkoutItems.replaceChildren();

    cart.forEach((item) => {
        const row = createElement("div", "checkout-item");
        const description = createElement(
            "span",
            "",
            `${item.name} × ${item.quantity}`
        );
        const subtotal = createElement(
            "strong",
            "",
            formatPrice(item.price * item.quantity)
        );

        row.append(description, subtotal);
        checkoutItems.append(row);
    });

    checkoutTotal.textContent = formatPrice(getCartTotal());
    checkoutModal.showModal();
}

checkoutButton.addEventListener("click", openCheckout);

function closeCheckout() {
    checkoutModal.close();
}

closeModalButton.addEventListener("click", closeCheckout);
continueShoppingButton.addEventListener("click", closeCheckout);

// Close the modal if the user clicks outside its panel.
checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
        closeCheckout();
    }
});

// Simulated order only; no payment or real order is created.
placeOrderButton.addEventListener("click", () => {
    if (cart.length === 0) {
        closeCheckout();
        return;
    }

    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    cart = [];
    renderCart();
    closeCheckout();

    showToast(`Demo order #${orderNumber} placed successfully!`);
});

// Display a temporary status message.
function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

// Set the current year and initialize the app.
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();