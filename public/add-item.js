const submitButton = document.getElementById('submit-item');
const cancelButton = document.getElementById('cancel-item');
const form = document.getElementById('add-item-form');

submitButton.addEventListener('click', function() {
    const type = document.getElementById('item-type').value;
    const location = document.getElementById('item-location').value;
    const foundDate = document.getElementById('item-found-date').value;
    const description = document.getElementById('item-description').value;
    const userId = sessionStorage.getItem('userId');

    if (type && location) {
        if (confirm("Are you sure you want to add this item?")) {
            addItem(type, location, foundDate, description, userId);
        }
    } else {
        alert('Please fill in all required fields.');
    }
});

cancelButton.addEventListener('click', function() {
    if (confirm("Are you sure you want to cancel? Any changes will not be saved.")) {
        window.location.href = 'main.html';
    }
});

async function addItem(type, location, foundDate, description, finderId) {
    const response = await fetch('/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type, location, found_date: foundDate, description, finder_id: finderId
        })
    });

    if (response.ok) {
        window.location.href = 'main.html';
    } else {
        const error = await response.text();
        alert(`Failed to add item: ${error}`);
    }
}
