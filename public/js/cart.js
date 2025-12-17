const cartContainer = document.getElementById("cartContainer");
const checkoutBtn = document.getElementById("checkoutBtn");

// Load cart from localStorage (guest cart)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render cart
function renderCart() {
  if (!cart || cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    checkoutBtn.style.display = "none";
    return;
  }

  checkoutBtn.style.display = "inline-block";

  cartContainer.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <p>Quantity: ${item.qty}</p>
      <p>Subtotal: ₹${item.price * item.qty}</p>
      <button onclick="removeItem('${item.id}')">Remove</button>
    </div>
  `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalEl = document.createElement("h3");
  totalEl.textContent = `Total: ₹${total}`;
  cartContainer.appendChild(totalEl);
}

// Remove item
function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// -------------------- CHECKOUT --------------------
checkoutBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    alert("Please login to continue checkout.");
    window.location.href = "login";
    return;
  }

  try {
    // 1️⃣ Merge guest cart to backend
    let localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length > 0) {
      const mergeRes = await fetch("http://localhost:3000/api/cart/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: localCart.map((i) => ({ fruitId: i.id, quantity: i.qty })),
        }),
      });
      const mergeData = await mergeRes.json();
      console.log("Guest cart merged:", mergeData);
      localStorage.setItem("cart", JSON.stringify([])); // clear guest cart
    }

    // 2️⃣ Fetch backend cart for logged-in user
    const cartRes = await fetch("http://localhost:3000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const backendCart = await cartRes.json();
    if (!backendCart || !backendCart.items || backendCart.items.length === 0)
      return alert("Cart is empty!");

    // 3️⃣ Update frontend cart variable
    cart = backendCart.items.map((i) => ({
      id: i.fruitId._id,
      name: i.fruitId.name,
      price: i.fruitId.price,
      qty: i.quantity,
    }));
    renderCart();

    // 4️⃣ Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // 5️⃣ Create Razorpay order
    const orderRes = await fetch("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: total }),
    });
    const orderData = await orderRes.json();

    // 6️⃣ Razorpay checkout
    const options = {
      key: "rzp_test_RhWh0hL79A9Wfl",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Fruits Store",
      description: "Purchase Fruits",
      order_id: orderData.id,
      handler: async function (response) {
        try {
          const verifyRes = await fetch("http://localhost:3000/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment verified & order saved!");
            cart = [];
            localStorage.setItem("cart", JSON.stringify([]));
            renderCart();
          } else {
            alert("Payment verification failed. Order not saved.");
          }
        } catch (err) {
          console.log(err);
          alert("Payment verification error.");
        }
      },
      prefill: { name: "User", email: "user@example.com" },
      theme: { color: "#3399cc" },
    };
    new Razorpay(options).open();
  } catch (err) {
    console.log(err);
    alert("Checkout failed. Try again.");
  }
});

// Initial render
renderCart();
