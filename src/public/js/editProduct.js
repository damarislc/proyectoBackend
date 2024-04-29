const url = window.location.pathname;
const productForm = document.querySelector("#edit-form");
const id = url.substring(url.lastIndexOf("/") + 1);

const getProduct = async () => {
  const result = await fetch(`/api/products/${id}`);
  const data = await result.json();
  return data;
};

const updateForm = async () => {
  const radioTrue = document.querySelector("#radio-true");
  const radioFalse = document.querySelector("#radio-false");
  const data = await getProduct();
  const product = data.payload;
  productForm.title.value = product.title;
  productForm.code.value = product.code;
  productForm.description.value = product.description;
  productForm.price.value = product.price;
  productForm.category.value = product.category;
  productForm.stock.value = product.stock;
  if (product.status) radioTrue.checked = true;
  else radioFalse.checked = true;
};

productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(productForm);
  const obj = {};

  //introduce al objeto el contenido del form con clave - valor
  data.forEach((value, key) => (obj[key] = value));

  //hace un fetch a la api de register con la informacion introducida por el usuario
  fetch(`/api/products/${id}`, {
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
          title: "Producto actualizado correctamente",
          icon: "success",
          showDenyButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          //funcoinamiento del boton login, redirige a la pagina de login
          if (result.isConfirmed) window.location.href = "/products";
        });
      } else {
        let error = result.error.cause ? result.error.cause : result.error;
        Swal.fire({
          title: "Error al actualizar el producto",
          icon: "error",
          text: error,
        });
      }
    })
    .catch((error) => {
      //si algo salio mal en el fetch, mada un msj de error
      Swal.fire({
        title: "Error al actualizar el producto",
        icon: "error",
        text: error,
      });
    });
});

updateForm();
