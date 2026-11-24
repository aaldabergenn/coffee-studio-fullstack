
let cart = [];
let currentCoffee = null;
let currentUser = "";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Login error");
        return;
    }

    loginSuccess(data.user);
}

function loginSuccess(user) {
    localStorage.setItem("userName", user.name);

    document.getElementById("authPage").classList.add("hidden");
    document.getElementById("menuPage").classList.remove("hidden");
}

async function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Register error");
        return;
    }

    loginSuccess(data.user);
}


function showMenuPage() {
    document.getElementById("authPage").classList.add("hidden");
    document.getElementById("menuPage").classList.remove("hidden");
}

function showAuthPage() {
    document.getElementById("menuPage").classList.add("hidden");
    document.getElementById("authPage").classList.remove("hidden");
}

function openCoffeeModal(name, price, image) {
    currentCoffee = { name, price };

    document.getElementById("coffeeName").innerText = name;
    document.getElementById("coffeePrice").innerText = price + " ₸";
    document.getElementById("coffeeImage").src = image;

    document
        .querySelectorAll('input[name="syrup"]')
        .forEach(r => r.checked = false);

    document.getElementById("coffeeModal").classList.remove("hidden");
}

function closeCoffeeModal() {
    document.getElementById("coffeeModal").classList.add("hidden");
}

function addCoffeeWithSyrup() {
    const syrupInput = document.querySelector('input[name="syrup"]:checked');
    const syrup = syrupInput && syrupInput.value
        ? ` + ${syrupInput.value} syrup`
        : "";

    cart.push({
        name: currentCoffee.name + syrup,
        price: currentCoffee.price
    });

    updateCartButton();
    closeCoffeeModal();
}

function addItem(name, price) {
    cart.push({ name, price });
    updateCartButton();
}

function updateCartButton() {
    const total = cart.reduce((s, i) => s + i.price, 0);
    const btn = document.getElementById("cartBtn");

    btn.innerText = `🧺 ${total} ₸`;
    btn.style.display = total > 0 ? "block" : "none";
}
async function openCartModal() {
    const list = document.getElementById("cartList");
    list.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const qty = item.quantity || 1;
        total += item.price * qty;

        const li = document.createElement("li");
        li.innerText = `${item.name} — ${item.price} ₸`;
        list.appendChild(li);
    });

    const name = localStorage.getItem("userName") || "Guest";
    document.getElementById("userName").innerText = name;

    document.getElementById("totalKZT").innerText = total;

    try {
        const res = await fetch(`/api/currency/convert?from=KZT&to=USD&amount=${total}`);
        const data = await res.json();
        document.getElementById("totalUSD").innerText = data.result.toFixed(2);
    } catch {
        document.getElementById("totalUSD").innerText = "—";
    }

    document.getElementById("cartModal").classList.remove("hidden");
}

async function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const items = cart.map(item => ({
        productName: item.name,
        price: item.price,
        quantity: 1
    }));


    closeCartModal();

    try {
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Server error");
            return;
        }

        cart = [];
        updateCartButton();

        alert("Order successfully created!");

    } catch (err) {
        alert("Network error");
    }
}

function closeCartModal() {
    const modal = document.getElementById("cartModal");
    modal.classList.add("hidden");
}

async function logout() {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch (e) {}
    currentUser = null;
    localStorage.removeItem("userName");
    cart = [];
    updateCartButton?.();

    document.getElementById("cartModal")?.classList.add("hidden");
    document.getElementById("coffeeModal")?.classList.add("hidden");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    document.getElementById("authPage").classList.remove("hidden");
    document.getElementById("menuPage").classList.add("hidden");
}

window.onload = () => {
    // A previous name in localStorage is not proof of an authenticated session.
    document.getElementById("menuPage").classList.add("hidden");
    document.getElementById("authPage").classList.remove("hidden");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
};

function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({behavior: "smooth"}); }
