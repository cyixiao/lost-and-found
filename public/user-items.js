document.addEventListener("DOMContentLoaded", function () {
  const userId = sessionStorage.getItem("userId");

  async function loadUserItems() {
    const response = await fetch(`/items/user/${userId}`);
    const itemsList = document.getElementById("user-items-list");
    itemsList.innerHTML = "";

    if (response.ok) {
      const items = await response.json();
      for (const item of items) {
        const itemContainer = document.createElement("div");
        itemContainer.className = "item-container";

        // Item details
        const itemDetails = document.createElement("div");
        itemDetails.textContent = `Type: ${item.type}, Found Date: ${item.found_date}, Location: ${item.location}, Description: ${item.description}`;
        itemContainer.appendChild(itemDetails);

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.onclick = () => deleteItem(item.item_id);
        itemContainer.appendChild(deleteBtn);

        // Claimant contact info
        if (item.status === 1) {
          const claimInfoResponse = await fetch(`/claim/info/${item.item_id}`);
          if (claimInfoResponse.ok) {
            const claimInfo = await claimInfoResponse.json();
            const contactInfoDiv = document.createElement("div");
            contactInfoDiv.textContent = `${claimInfo.username}: ${claimInfo.contact_info}`;
            itemContainer.appendChild(contactInfoDiv);
          }
        } else {
          const noClaimantDiv = document.createElement("div");
          noClaimantDiv.textContent = "No claimant yet";
          itemContainer.appendChild(noClaimantDiv);
        }

        // Return confirmation button
        if (item.status === 1) {
          const confirmReturnBtn = document.createElement("button");
          confirmReturnBtn.textContent = "✅";
          confirmReturnBtn.onclick = () => confirmReturn(item.item_id);
          itemContainer.appendChild(confirmReturnBtn);

          const returnItemBtn = document.createElement("button");
          returnItemBtn.textContent = "Return";
          returnItemBtn.onclick = () => returnItem(item.item_id);
          itemContainer.appendChild(returnItemBtn);
        }

        itemsList.appendChild(itemContainer);
      }
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
