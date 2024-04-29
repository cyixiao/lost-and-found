document.addEventListener("DOMContentLoaded", function () {
  const userId = sessionStorage.getItem("userId");

  async function loadUserItems() {
    const response = await fetch(`/items/user/${userId}`);
    const itemsList = document.getElementById("user-items-list");

    if (response.ok) {
      const items = await response.json();
      const table = document.createElement("table");
      const thead = table.createTHead();
      const tbody = table.createTBody();
      const headerRow = thead.insertRow();

      const headers = [
        "Delete",
        "Type",
        "Found Date",
        "Location",
        "Description",
        "Claimer",
        "Confirm Return",
        "Dispute Claim",
      ];
      headers.forEach((headerText) => {
        let header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
      });

      for (const item of items) {
        let row = tbody.insertRow();

        let deleteCell = row.insertCell();
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.classList.add("delete-btn");
        deleteButton.onclick = () => deleteItem(item.item_id);
        deleteCell.appendChild(deleteButton);

        let typeCell = row.insertCell();
        typeCell.textContent = item.type;
        let foundDateCell = row.insertCell();
        foundDateCell.textContent = item.found_date;
        let locationCell = row.insertCell();
        locationCell.textContent = item.location;
        let descriptionCell = row.insertCell();
        descriptionCell.textContent = item.description;
        let claimerCell = row.insertCell();
        let claimerInfo;

        if (item.status === 1) {
          const claimInfoResponse = await fetch(`/claim/info/${item.item_id}`);
          if (claimInfoResponse.ok) {
            const claimInfo = await claimInfoResponse.json();
            claimerInfo = `${claimInfo.username}: ${claimInfo.contact_info}`;
          } else {
            claimerInfo = "Failed to load claimer info";
          }
        } else {
          claimerInfo = "No claimer yet";
        }
        claimerCell.textContent = claimerInfo;

        let confirmReturnCell = row.insertCell();
        let confirmReturnButton = document.createElement("button");
        confirmReturnButton.textContent = "Returned";
        confirmReturnButton.classList.add("confirm-btn");
        confirmReturnButton.onclick = () => confirmReturn(item.item_id);
        confirmReturnCell.appendChild(confirmReturnButton);

        let returnItemCell = row.insertCell();
        let returnItemButton = document.createElement("button");
        returnItemButton.textContent = "Dispute";
        returnItemButton.classList.add("return-btn");
        returnItemButton.onclick = () => returnItem(item.item_id);
        returnItemCell.appendChild(returnItemButton);

        if (item.status !== 1) {
          confirmReturnButton.disabled = true;
          returnItemButton.disabled = true;
        }
      }

      itemsList.innerHTML = "";
      itemsList.appendChild(table);
    } else {
      itemsList.textContent = "Failed to load items.";
    }
  }

  async function deleteItem(itemId) {
    if (confirm("Are you sure you want to delete this item?")) {
      const response = await fetch(`/item/delete/${itemId}`, {
        method: "POST",
      });
      if (response.ok) {
        loadUserItems();
      } else {
        alert("Failed to delete item.");
      }
    }
  }

  async function confirmReturn(itemId) {
    if (confirm("Are you sure the item has been returned to the owner?")) {
      const response = await fetch(`/claim/end/${itemId}`, { method: "POST" });
      if (response.ok) {
        loadUserItems();
      } else {
        alert("Failed to confirm return.");
      }
    }
  }

  async function returnItem(itemId) {
    if (
      confirm(
        "Are you sure this is not the owner? This will make the item available for claims again."
      )
    ) {
      const response = await fetch(`/claim/return/${itemId}`, {
        method: "POST",
      });
      if (response.ok) {
        loadUserItems();
      } else {
        alert("Failed to return the item to the claimable pool.");
      }
    }
  }

  document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "main.html";
  });

  loadUserItems();
});
