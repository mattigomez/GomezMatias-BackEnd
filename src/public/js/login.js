/* const form = document.getElementById('loginForm')
const passwordLogin = document.getElementById('passwordLogin')


form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}

    data.forEach((value,key) => obj[key] = value)

    const url = '/auth'
    const headers = {
        'Content-Type': 'application/json'
    }
    const method = 'POST'
    const body = JSON.stringify(obj)

    fetch(url,{
        headers,
        method,
        body
    })
    .then(response => response.json())
    .then(data => redirect(data))
    .catch(error => console.log(error))
})

function redirect(data) {
    if (data.status == 'success') {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Has ingresado con exito',
            showConfirmButton: false,
            timer: 1500,
            didClose: () => {
                location.href= '/'}
          })
      
    } else {
      const errorMessage = document.getElementById("error-login");
      errorMessage.innerHTML = data.message;
      passwordLogin.value = ""

    }
  } */