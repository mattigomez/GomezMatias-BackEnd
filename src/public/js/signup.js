const form = document.getElementById("signupForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  const url = "/api/register";
  const headers = {
    "Content-Type": "application/json",
  };
  const method = "POST";
  const body = JSON.stringify(obj);

  fetch(url, {
    headers,
    method,
    body,
  })
    .then((response) => response.json())
    .then((data) => redirect(data))
    .catch((error) => console.log(error));
});

function redirect(data) {
  if (data.status == "success") {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Cuenta creada con éxito",
      showConfirmButton: false,
      timer: 1500,
      didClose: () => {
        window.location.href = "/api/login";
      },
    });
  } else {
    const errorMessage = document.getElementById("userExist");
    errorMessage.innerHTML = "El email ingresado no esta disponible";
  }
}
