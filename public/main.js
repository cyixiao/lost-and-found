document.addEventListener("DOMContentLoaded", function () {
  loadQuote();
  const username = sessionStorage.getItem("username");
  document.getElementById("username-display").textContent = username;

  async function loadItems(type = "all") {
    let url = "/items";
    if (type !== "all") {
      url += `/${type}`;
    }

    const response = await fetch(url);
    const itemsList = document.getElementById("items-list");
    itemsList.innerHTML = "";

    if (response.ok) {
      const items = await response.json();
      const itemsList = document.getElementById("items-list");
      itemsList.innerHTML = "";

      items.forEach((item) => {
        const row = document.createElement("tr");

        const typeCell = document.createElement("td");
        typeCell.textContent = item.type;
        row.appendChild(typeCell);

        const foundDateCell = document.createElement("td");
        foundDateCell.textContent = item.found_date;
        row.appendChild(foundDateCell);

        const locationCell = document.createElement("td");
        locationCell.textContent = item.location;
        row.appendChild(locationCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = item.description;
        row.appendChild(descriptionCell);

        row.onclick = () => {
          if (
            item.finder_id === parseInt(sessionStorage.getItem("userId"), 10)
          ) {
            alert("You cannot claim an item that you have found.");
          } else {
            const confirmClaim = confirm(
              "Are you sure you want to claim this item?"
            );
            if (confirmClaim) {
              claimItem(item.item_id);
            }
          }
        };

        itemsList.appendChild(row);
      });
    } else {
      itemsList.textContent = "Failed to load items.";
    }
  }

  async function claimItem(itemId) {
    const userId = sessionStorage.getItem("userId");
    const response = await fetch("/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId, claimer_id: userId }),
    });

    if (response.ok) {
      loadItems();
    } else {
      alert("Failed to submit claim.");
    }
  }

  document
    .getElementById("type-selector")
    .addEventListener("change", function () {
      const selectedType = this.value;
      loadItems(selectedType);
    });

  document
    .getElementById("add-item-button")
    .addEventListener("click", function () {
      window.location.href = "add-item.html";
    });

  document
    .getElementById("user-items-button")
    .addEventListener("click", function () {
      window.location.href = "user-items.html";
    });

  document
    .getElementById("my-claims-button")
    .addEventListener("click", function () {
      window.location.href = "user-claims.html";
    });

  document
    .getElementById("logout-button")
    .addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        fetch("/logout", {
          method: "GET",
        })
          .then((response) => {
            if (response.ok) {
              sessionStorage.clear();
              window.location.href = "login.html";
            } else {
              alert("Logout failed.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred during logout.");
          });
      }
    });

  loadItems();
});

function loadQuote() {
  const category = "inspirational";
  fetch(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
    method: "GET",
    headers: { "X-Api-Key": "tp/4HJkuaUgYMvSIQsmOxQ==JzafWD6Lv80OKbrS" },
  })
    .then((response) => response.json())
    .then((quotes) => {
      if (quotes.length > 0) {
        const quote = quotes[0];
        document.getElementById(
          "inspirational-quote"
        ).textContent = `"${quote.quote}" - ${quote.author}`;
      } else {
        document.getElementById("inspirational-quote").textContent =
          "No quotes available.";
      }
    })
    .catch((error) => {
      console.error("Error fetching inspirational quote:", error);
      document.getElementById("inspirational-quote").textContent =
        "Failed to load inspirational quote.";
    });
}
