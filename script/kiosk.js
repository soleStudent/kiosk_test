const checkout = document.querySelector("#checkout");
const cartbutton = document.querySelector("#cartbutton");
const categories = document.querySelectorAll(".category");
const products = document.querySelectorAll(".product-item");
const cart = document.querySelector("#cart");
const subtotalBox = document.querySelector("#subtotal");
const discountBox = document.querySelector("#discount");
const totalBox = document.querySelector("#total");
const searchBar = document.querySelector("#search input");
const initialCartItem = cart.querySelector(".cart-item");
const cartItemTemplate = initialCartItem.cloneNode(true);
const promotionCodes = {
    discount10 : 0.1,
    discount25 : 0.25,
    discount50 : 0.5,
    discount80 : 0.8,
    discount100 : 1.0
}
// Price
let subtotal = 0;
let discount = 0;
let discountValue = 0;
let total = 0;
// States
let categoryMenu = document.querySelector(".category.setmenu");
let menulist = {
    bread1 : { price : 5.50, count : 0 },
    bread2 : { price : 3.75, count : 0 },
    bread3 : { price : 4.25, count : 0 },
    bread4 : { price : 5.25, count : 0 },
    cake1 : { price : 3.00, count : 0 },
    cake2 : { price : 5.00, count : 0 },
    cake3 : { price : 5.00, count : 0 },
    donut1 : { price : 4.50, count : 0 },
    donut2 : { price : 5.50, count : 0 },
    pastry1 : { price : 4.00, count : 0 },
    pastry2 : { price : 4.75, count : 0 },
    sandwich1 : { price : 5.50, count : 0 },
    sandwich2 : { price : 5.00, count : 0 },
    sandwich3 : { price : 4.00, count : 0 },
};

// Timer, Cart Initialize
tikClock();
setInterval(tikClock, 1000);
cart.removeChild(initialCartItem);

// Event Settings
cartbutton.addEventListener("click", () => {
    checkout.classList.toggle("fold");
    cartbutton.classList.toggle("fold");
});

for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    category.addEventListener("click", () => {
        setCategory(category);
    });
}

for (let i = 0; i < products.length; i++) {
    const product = products[i];
    product.addEventListener("click", () => {
        buy(product);
    });
}

document.querySelector("#clear-cart").addEventListener("click", () => {
    clearCart();
});

document.querySelector("#place-order").addEventListener("click", () => {
    endMessage();
});

searchBar.addEventListener("change", () => {
    searchChange();
});

document.querySelector("#apply").addEventListener("click", () => {
    updateDiscount();
});

// Functions
function endMessage() {
    if (subtotal <= 0) {
        alert("No Products Selected.");
    } else if (confirm(`Total price is ${total} USD. Do you Want Purchase?`)) {
        alert("Thanks for buying!");
        clearCart();
    }
}

function clearCart() {
    const cartitem = cart.querySelectorAll(".infobox .trash");
    for (let i = 0; i < cartitem.length; i++) {
        const element = cartitem[i];
        element.dispatchEvent(new Event("click"));
    }
    updateDiscount();
    updatePriceTotal();
}

function tikClock() {
    const today = new Date();
    const dmy = document.querySelector("#day-month-year");
    const hm = document.querySelector("#hour-minute");
    dmy.textContent = today.toLocaleDateString("en-US");
    hm.textContent = today.toLocaleTimeString("en-US");
}

function setCategory(category) {
    if (!category.classList.contains("setmenu")) {
        categoryMenu.classList.toggle("setmenu");
        category.classList.toggle("setmenu");
        categoryMenu = category;
    }
    viewChange();
}

function viewChange() {
    const items = document.querySelectorAll(".product-item");

    if (categoryMenu.id === "category-all") {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.classList.remove("hidden");
        }
    } else {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.classList.contains(categoryMenu.id)) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        }
    }

    if (searchBar.value !== "") {
        searchChange();
    }
}

function searchChange() {
    const str = searchBar.value.toLowerCase();
    const items = document.querySelectorAll(".product-item");
    
    if (str !== "") {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemname = item.querySelector(".product-name").innerText.toLowerCase();

            if ((categoryMenu.id === "category-all" || item.classList.contains(categoryMenu.id)) && itemname.includes(str)) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        }
    } else {
        viewChange();
    }
}

function buy(product) {
    const item = product.id;

    subtotal += menulist[item].price;
    menulist[item].count++;
    updatePriceTotal();

    const exist = cart.querySelector("." + item);
    if (exist) { 
        exist.querySelector(".quantity").innerText = menulist[item].count;
        return;
    }
    const newitem = cartItemTemplate.cloneNode(true);
    newitem.classList.remove("invisible");
    newitem.classList.add(item);

    newitem.querySelector(".imagebox img").src = product.querySelector(".imagebox img").src;
    newitem.querySelector(".product-name").innerText = product.querySelector(".product-name").innerText;
    newitem.querySelector(".price").innerText = product.querySelector(".price").innerText;
    newitem.querySelector(".quantity").innerText = menulist[item].count;
    
    newitem.querySelector(".quantity-option .minus").addEventListener("click", () => {
        subtotal -= menulist[item].price;
        menulist[item].count--;
        newitem.querySelector(".quantity").innerText = menulist[item].count;
        updatePriceTotal();
        if (menulist[item].count <= 0) {
            menulist[item].count = 0;
            cart.removeChild(newitem);
        }
    });

    newitem.querySelector(".quantity-option .plus").addEventListener("click", () => {
        subtotal += menulist[item].price;
        menulist[item].count++;
        newitem.querySelector(".quantity").innerText = menulist[item].count;
        updatePriceTotal();
    });

    newitem.querySelector(".infobox .trash").addEventListener("click", () => {
        subtotal -= menulist[item].price * menulist[item].count;
        menulist[item].count = 0;
        newitem.querySelector(".quantity").innerText = menulist[item].count;
        updatePriceTotal();
        cart.removeChild(newitem);
    });

    cart.appendChild(newitem);
}

function updatePriceTotal() {
    discount = Math.ceil(subtotal * discountValue * 100) / 100.0
    total = subtotal - discount;
    subtotalBox.innerText = subtotal.toFixed(2);
    discountBox.innerText = discount.toFixed(2);
    totalBox.innerText = total.toFixed(2);
}

function updateDiscount() {
    const codeText = document.querySelector("#promotion input");
    if (codeText.value in promotionCodes) {
        discountValue = promotionCodes[codeText.value];
    } else {
        discountValue = 0;
    }
    codeText.value = "";
    updatePriceTotal();
}