document.addEventListener("DOMContentLoaded", function () {
  const userId = sessionStorage.getItem("userId");

  async function loadClaims() {
    const response = await fetch(`/items/claim/${userId}`);
    const claimsList = document.getElementById("claims-list");
    claimsList.innerHTML = "";

    if (response.ok) {
      const claims = await response.json();
      claims.forEach((claim) => {
        const claimContainer = document.createElement("div");
        claimContainer.textContent = `Type: ${claim.type}, Found Date: ${claim.found_date}, Location: ${claim.location}, Description: ${claim.description}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.onclick = () => deleteClaim(claim.item_id);
        claimContainer.appendChild(deleteBtn);

        claimsList.appendChild(claimContainer);
      });
    } else {
      claimsList.textContent = "Failed to load claims.";
    }
  }

  async function deleteClaim(itemId) {
    if (confirm("Are you sure you want to delete this claim?")) {
      const response = await fetch(`/claim/return/${itemId}`, {
        method: "POST",
      });
      if (response.ok) {
        loadClaims();
      } else {
        alert("Failed to delete claim.");
      }
    }
  }

  document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "main.html";
  });

  loadClaims();
});
