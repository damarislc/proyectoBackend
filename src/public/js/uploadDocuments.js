const url = window.location.pathname;
const uid = url.substring(url.lastIndexOf("/") + 1);
const uploadForm = document.querySelector("#upload-documents-form");

uploadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(uploadForm);

  fetch(`/api/user/${uid}/documents`, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: "Archivos cargados correctamente",
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
