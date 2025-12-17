const fruitsContainer = document.getElementById("fruitsContainer");
const vegetablesContainer = document.getElementById("vegetablesContainer");

// Cart array in localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// fruits.js
let allProducts = []; // global


// 🔹 Split by category

    function renderProducts(products){
      console.log("Rendering products:", products.length);
    const fruits = products.filter(p => p.category && p.category.toLowerCase() === "fruit");      // 🔹 NEW
    const vegetables = products.filter(p => p.category && p.category.toLowerCase() === "vegetable"); // 🔹 NEW

    // 🔹 Render fruits
    fruitsContainer.innerHTML = fruits.map(p => cardHTML(p)).join(""); // 🔹 MODIFIED (was only fruits before)

    // 🔹 Render vegetables
    vegetablesContainer.innerHTML = vegetables.map(p => cardHTML(p)).join(""); // 🔹 NEW
    }


// Fetch fruits from backend
async function loadProducts() {
   try {
  //   const token = localStorage.getItem("userToken"); // JWT token stored in localStorage
  //   if (!token) {
  //     fruitsContainer.innerHTML = "<p>Please bhai login kro na login to see fruits.</p>";
  //     return;
  //   

    const res = await fetch("http://localhost:3000/api/fruits", {

      method: "GET",
      headers: {
        // "Authorization": `Bearer ${token}`, // send token properly
        "Content-Type": "application/json"
      }
    });
   


    if (!res.ok) {
      console.error("Failed to fetch fruits:", fruits.message || fruits);
      fruitsContainer.innerHTML = "<p>Please login to see fruits.</p>";
      return;
    }

    const products = await res.json();

  console.log("RAW PRODUCTS:", products);
console.log("PRODUCT NAMES:", products.map(p => p.name));

    allProducts = products;
    
    console.log(
  allProducts.map(p => `"${p.name}"`)
);

    renderProducts(allProducts); // initial render


    if (!Array.isArray(products)) {
      console.error("Fruits is not an array:", fruits);
      return;
    }
    

    } catch (error) {
    console.log(error);
  }
}

    // Reusable card HTML
function cardHTML(item) {
  return `
    <div class="fruit-card">
      <img src="${item.image}" alt="${item.name}" width="100">
      <h3>${item.name}</h3>
      <p>${item.description || ""}</p>
      <p>Price: ₹${item.price}</p>
      <div>
        <button onclick="decreaseQty('${item._id}')">-</button>
        <span id="qty-${item._id}">1</span>
        <button onclick="increaseQty('${item._id}')">+</button>
      </div>
      <button onclick="addToCart('${item._id}','${item.name}',${item.price})">Add to Cart</button>
    </div>
  `;
}
   
// Quantity functions
function increaseQty(id) {
  const qtyEl = document.getElementById(`qty-${id}`);
  qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
}

function decreaseQty(id) {
  const qtyEl = document.getElementById(`qty-${id}`);
  if (parseInt(qtyEl.textContent) > 1) {
    qtyEl.textContent = parseInt(qtyEl.textContent) - 1;
  }
}

// Add to cart
function addToCart(id, name, price) {
  const qty = parseInt(document.getElementById(`qty-${id}`).textContent);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

// Load fruits on page load
loadProducts();