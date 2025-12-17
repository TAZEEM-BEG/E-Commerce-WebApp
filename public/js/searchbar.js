const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  console.log("QUERY:", query);

  if (!query) {
    renderProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter(item => {
  return item.name &&
    item.name.toString().trim().toLowerCase().includes(query);
});


  console.log("MATCHED:", filtered.length);
  renderProducts(filtered);
}

// Events
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") handleSearch();
});
