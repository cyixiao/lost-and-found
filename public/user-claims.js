document.addEventListener("DOMContentLoaded", function () {
  const userId = sessionStorage.getItem("userId");

  async function loadClaims() {
    const response = await fetch(`/items/claim/${userId}`);
    const claimsList = document.getElementById("claims-list");
    claimsList.innerHTML = "";

    if (response.ok) {
      const claims = await response.json();
      const claimsList = document.getElementById("claims-list");
      claimsList.innerHTML = "";

      if (claims.length > 0) {
        const table = document.createElement("table");
        table.id = "claims-table";

        const headerRow = document.createElement("tr");
        ["Type", "Found Date", "Location", "Description", "Delete"].forEach(
          (headerText) => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
          }
        );
        table.appendChild(headerRow);

        claims.forEach((claim) => {
          const row = document.createElement("tr");
          ["type", "found_date", "location", "description"].forEach((key) => {
            const cell = document.createElement("td");
            cell.textContent = claim[key];
            row.appendChild(cell);
          });

          const deleteCell = document.createElement("td");
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "❌";
          deleteBtn.onclick = () => deleteClaim(claim.item_id);
          deleteCell.appendChild(deleteBtn);
          row.appendChild(deleteCell);

          table.appendChild(row);
        });

        claimsList.appendChild(table);
      } else {
        claimsList.textContent = "No claims found.";
      }
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
