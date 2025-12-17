// function loadPage(page) {
//   const token = localStorage.getItem("userToken");

//   // Protect cart page
//   if (page === "cart" && !token) {
//     alert("Please login first!");
//     loadPage("login");
//     return;
//   }

//   fetch(`/partials/${page}`)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("contentArea").innerHTML = html;
//     })
//     .catch(err => {
//       document.getElementById("contentArea").innerHTML = `<p>Error loading page: ${err.message}</p>`;
//     });
// }

// // Load default page on startup
// document.addEventListener("DOMContentLoaded", () => {
//   loadPage("fruits"); // or any default page
// });

// Page navigation
function loadPage(page) {
    // Cart protection: agar user login nahi hai, cart page ko open na kare
    const token = localStorage.getItem("userToken");
    if (page === "cart" && !token) {
        alert("Please login first!");
        window.location.href = "/login";
        return;
    }

    // Normal page redirect
    window.location.href = `/${page}`;
}

// Logout function
function logout() {
    localStorage.removeItem("userToken");  // remove token
    localStorage.removeItem("cart");       // clear cart if needed
    alert("Logged out successfully!");
    window.location.href = "/login";       // redirect to login
}

// Optional: run on DOM load if you want
document.addEventListener("DOMContentLoaded", () => {
    // Example: hide/show logout link based on login status
    const logoutBtn = document.getElementById("logoutBtn");
    const token = localStorage.getItem("userToken");

    if (logoutBtn) {
        if (token) {
            logoutBtn.style.display = "inline-block"; // show logout
        } else {
            logoutBtn.style.display = "none";         // hide logout
        }

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
});
