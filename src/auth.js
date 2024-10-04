let users = JSON.parse(localStorage.getItem('users')) || [];



document.getElementById('authForm').addEventListener('submit', function(event) {

    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (email && password) {
        const existingUser = users.find(u => u.email === email);
        if (!existingUser) {
            registerUser(email, password);
        } else {
            if (existingUser.password === password) {
            sessionStorage.setItem('currentUser', JSON.stringify(existingUser));
            window.location.href = './pages/notes.html';
            }
        }
    }
});

function registerUser(email, password) {
    if (!users.some(u => u.email === email)) {
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
    }
}
