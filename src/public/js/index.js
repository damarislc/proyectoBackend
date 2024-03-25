/**
 * Funcion para llamar a la api de logout
 */
function logout() {
  fetch("/api/sessions/logout")
    .then((res) => res.json())
    .then((result) => {
      //si salio bien redirige a la pagina de login
      if (result.success) window.location.href = "/login";
    })
    .catch((error) => {
      Swal.fire({
        title: "Error al desloguearse",
        icon: "error",
        text: error,
      });
    });
}
