document.addEventListener('DOMContentLoaded', function() {
    const username = sessionStorage.getItem('username');
    document.getElementById('username-display').textContent = username;

    async function loadItems(type = 'all') {
        let url = '/items';
        if (type !== 'all') {
            url += `/${type}`;
        }

        const response = await fetch(url);
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = '';

        if (response.ok) {
            const items = await response.json();
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.textContent = `Type: ${item.type}, Found Date: ${item.found_date}, Location: ${item.location}, Description: ${item.description}`;
                itemDiv.onclick = () => {
                    if (item.finder_id === parseInt(sessionStorage.getItem('userId'), 10)) {
                        alert("You cannot claim an item that you have found.");
                    } else {
                        const confirmClaim = confirm("Are you sure you want to claim this item?");
                        if (confirmClaim) {
                            claimItem(item.item_id);
                        }
                    }
                };
                itemsList.appendChild(itemDiv);
            });
        } else {
            itemsList.textContent = 'Failed to load items.';
        }
    }

    // 当物品被点击，提交 claim
    async function claimItem(itemId) {
        const userId = sessionStorage.getItem('userId');
        const response = await fetch('/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId, claimer_id: userId })
        });

        if (response.ok) {
            loadItems();
        } else {
            alert('Failed to submit claim.');
        }
    }

    document.getElementById('type-selector').addEventListener('change', function() {
        const selectedType = this.value;
        loadItems(selectedType);
    });

    document.getElementById('add-item-button').addEventListener('click', function() {
        window.location.href = 'add-item.html';
    });

    document.getElementById('user-items-button').addEventListener('click', function() {
        window.location.href = 'user-items.html';
    });

    document.getElementById('my-claims-button').addEventListener('click', function() {
        window.location.href = 'user-claims.html';
    });
    

    document.getElementById('logout-button').addEventListener('click', function() {
        if (confirm("Are you sure you want to logout?")) {
            fetch('/logout', {
                method: 'GET'
            }).then(response => {
                if (response.ok) {
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                } else {
                    alert("Logout failed.");
                }
            }).catch(error => {
                console.error('Error:', error);
                alert("An error occurred during logout.");
            });
        }
    });

    loadItems();
});
