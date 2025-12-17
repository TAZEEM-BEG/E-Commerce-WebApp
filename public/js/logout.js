document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();           // default link behavior prevent
      localStorage.removeItem("userToken"); // remove token
      localStorage.removeItem("cart");      // remove cart if chahiye
      window.location.href = "/login";      // redirect to login
    });
  }
});
