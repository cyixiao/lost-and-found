document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const contactInfo = document.getElementById('signup-contact-info').value;

    const confirmRegistration = confirm("Are you sure you want to register with these details?");
    if (!confirmRegistration) {
        return;
    }

    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, contact_info: contactInfo })
    });

    if (response.ok) {
        window.location.href = 'login.html';
    } else {
        const error = await response.text();
        alert(`Registration failed: ${error}`);
    }
});
