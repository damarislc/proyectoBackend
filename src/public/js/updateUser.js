const url = window.location.pathname;
const uid = url.substring(url.lastIndexOf("/") + 1);
const updateForm = document.querySelector("#update-form");

const getUser = async () => {
  const result = await fetch("/api/user/");
  const user = await result.json();
  return user;
};

const setForm = async () => {
  const radioUser = document.querySelector("#radio-user");
  const radioPremium = document.querySelector("#radio-premium");
  const user = await getUser();
  if (user.role === "user") radioUser.checked = true;
  else radioPremium.checked = true;
};

updateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(updateForm);
  const obj = {};

  //introduce al objeto el contenido del form con clave - valor
  data.forEach((value, key) => (obj[key] = value));

  fetch(`/api/user/premium/${uid}`, {
    method: "PUT",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: "Perfil actualizado correctamente",
          icon: "success",
          showDenyButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) window.location.href = "/current";
        });
      } else {
        let error = result.error.cause ? result.error.cause : result.error;
        Swal.fire({
          title: "Error al actualizar el perfil",
          icon: "error",
          text: error,
        });
      }
    })
    .catch((error) => {
      //si algo salio mal en el fetch, mada un msj de error
      Swal.fire({
        title: "Error al actualizar el perfil",
        icon: "error",
        text: error,
      });
    });
});

setForm();
