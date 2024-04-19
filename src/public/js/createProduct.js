const productForm = document.querySelector("#create-form");

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(productForm);
  const obj = {};

  //introduce al objeto el contenido del form con clave - valor
  data.forEach((value, key) => (obj[key] = value));

  //hace un fetch a la api de register con la informacion introducida por el usuario
  fetch(`/api/products/`, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: "Producto creado correctamente",
          icon: "success",
          text: `Id del producto creado: ${result.payload._id}`,
          showDenyButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          //funcoinamiento del boton login, redirige a la pagina de login
          if (result.isConfirmed) window.location.href = "/products";
        });
      } else {
        Swal.fire({
          title: "Error al crear el producto",
          icon: "error",
          text: result.message,
        });
      }
    })
    .catch((error) => {
      //si algo salio mal en el fetch, mada un msj de error
      Swal.fire({
        title: "Error al crear el producto",
        icon: "error",
        text: error,
      });
    });
});
