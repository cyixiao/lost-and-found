document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const result = await response.json();
      sessionStorage.setItem("userId", result.userId);
      sessionStorage.setItem("username", username);
      window.location.href = "main.html";
    } else {
      const error = await response.text();
      alert(error);
    }
  });
