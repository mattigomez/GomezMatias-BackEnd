const form = document.getElementById('resetPasswordForm')
const userId = document.getElementById('userId');
const pass1 = document.getElementById('password1');
const pass2 = document.getElementById('password2');
const errorMessage = document.getElementById('error-resetPassword');

form.addEventListener('submit', e => {
    e.preventDefault();

    const email = userId.value.trim();
    const password1 = pass1.value.trim();
    const password2 = pass2.value.trim();

    if (password1 != password2) {
        errorMessage.innerHTML = 'Las contraseñas no coinciden';
    }
    else if (password1.trim() == '') {
        errorMessage.innerHTML = 'Ingrese una constraseña';
    }
    else {
        const url = `/api/login/reset-password/${{email}}`
        const headers = {
            'Content-type': 'application/json',
        }
        const method = 'POST'
        const body = JSON.stringify({ email, password: password1 });
        fetch(url, {
            headers,
            method,
            body,
        })
            .then(response => response.json())
            .then(data => redirect(data))
            .catch(error => console.error(error))
    }
});

function redirect(data) {
    console.log(data)
    if (data.status == 'success') {
        window.location.href = '/api/login';
    } else {
        errorMessage.innerHTML = data.message;
    }
  };

