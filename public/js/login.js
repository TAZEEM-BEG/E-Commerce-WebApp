console.log("Auth Script Loaded");

// Common function to get box safely
function getBox(id) {
  return document.getElementById(id) || { innerText: "" };
}

/*********************************
 🚀 REGISTER FORM
**********************************/
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Boxes (optional)
    const errorBox = getBox("errorBox");
    const successBox = getBox("successBox");

    if (!username || !email || !password) {
      errorBox.innerText = "All fields are required!";
      successBox.innerText = "";
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorBox.innerText = "Invalid email format!";
      successBox.innerText = "";
      return;
    }

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered Successfully! Please login.");
        registerForm.reset();
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      alert("Error registering user");
    }
  });
}


/*********************************
 🚀 LOGIN FORM
**********************************/
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const errorBox = getBox("errorBox");
    const successBox = getBox("successBox");

    if (!email || !password) {
      errorBox.innerText = "Both email and password are required!";
      successBox.innerText = "";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorBox.innerText = "Invalid email format!";
      successBox.innerText = "";
      return;
    }

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("cart", JSON.stringify([])); // reset cart

        alert("Login Successful!");
        window.location.href = "/fruits";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      alert("Error logging in");
    }
  });
}


/*********************************
 🚀 RESET PASSWORD FORM
**********************************/
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!newEmail || !newPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password Reset Successfully!");
        window.location.href = "/login";
      } else {
        alert(data.message || "Reset failed");
      }
    } catch (err) {
      console.error("ERROR:", err);
      alert("Something went wrong!");
    }
  });
}
