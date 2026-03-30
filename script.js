let cart = [];
let total = 0;

function addToCart(name, price) {
    cart.push({name, price});
    total += price;
    displayCart();
}

function displayCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";

    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item.name + " - $" + item.price;
        cartList.appendChild(li);
    });

    document.getElementById("total").textContent = total;
}

function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Order placed successfully! 🍕");
        cart = [];
        total = 0;
        displayCart();
    }
}






























