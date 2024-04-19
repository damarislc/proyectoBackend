const divCartProducts = document.querySelector("#container--cart-products");
const productsList = [];
const locationUrl = window.location.pathname;
const cid = locationUrl.substring(locationUrl.lastIndexOf("/") + 1);

const getProductsFromCart = async () => {
  const url = "/api/carts/" + cid;
  const result = await fetch(url);
  const data = await result.json();
  return data;
};

const renderProductsTable = async () => {
  const data = await getProductsFromCart();
  const products = data.payload.products;
  products.forEach((product) => {
    productsList.push(product);
  });
  createProductsTable();
};

const createProductsTable = async () => {
  let html = "";
  let totalCart = 0;
  if (productsList.length === 0) {
    html = `<span>No tienes productos en el carrito</span>`;
  } else {
    html = `
            <table id="table-cart-products">
            <thead>
                <th>ID</th>
                <th>Título</th>
                <th>Código</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Eliminar</th>
            </thead>
            <tbody>
            `;
    productsList.forEach((p) => {
      const product = p.productId;
      const totalProduct = product.price * p.quantity;
      totalCart += totalProduct;
      html += `
            <tr>
                <td>${product._id}</td>
                <td>${product.title}</td>
                <td>${product.code}</td>
                <td>$${product.price}</td>
                <td>${p.quantity}</td>
                <td>$${totalProduct}</td>
                <td><button class="red-btn" onclick="deleteProductFromCart('${product._id}')">Eliminar</button></td>
            </tr>
        `;
    });

    html += ` 
                    <tr>
                        <td colspan="5" class="total-label">Total</td>
                        <td class="total">$${totalCart}</td>
                        <td></td>
                    </tr>
                </tbody>
             </table>`;
  }

  divCartProducts.innerHTML = html;
};

const deleteProductFromCart = (pid) => {
  fetch(`/api/carts/${cid}/product/${pid}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: "Producto se ha eliminado del carrito correctamente",
          icon: "success",
          showDenyButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          //recarga la pagina
          if (result.isConfirmed) location.reload();
        });
      }
    })
    .catch((error) => {
      //si algo salio mal en el fetch, mada un msj de error
      Swal.fire({
        title: "Error al eliminar el producto del carrito.",
        icon: "error",
        text: error,
      });
    });
};

const purchase = () => {
  const url = `/api/carts/${cid}/purchase`;
  fetch(url, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        //se manda  un alert de que se realizó la compra
        let html = `<p>El id de tu compra es: <strong>${result.payload.ticket.code}</strong></p>
                    <p>El total de la compra fue: <strong>$${result.payload.ticket.amount}</p></strong>
                    <p>Los productos comprados fueron:</p>
                    <ul>`;
        result.payload.productsPurchased.forEach((product) => {
          html += `<li>${product.title}</li>`;
        });

        html += `</ul>`;

        if (result.payload.productsOutOfStock.length > 0) {
          html += `<p>Los siguientes productos no se pudieron comprar por falta de stock:</p>
                   <ul>`;
          result.payload.productsOutOfStock.forEach((product) => {
            html += `<li>${product.title}</li>`;
          });
          html += `</ul>`;
        }
        Swal.fire({
          title: "Compra realizada con éxito",
          html: html,
          icon: "success",
          showDenyButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          //funcoinamiento del boton login, redirige a la pagina de login
          if (result.isConfirmed) location.reload();
        });
      } else {
        //se manda  un alert de que no se pudo hacer la compra
        Swal.fire({
          title: result.message,
          icon: "error",
        });
      }
    })
    .catch((error) => {
      //si algo salio mal en el fetch, mada un msj de error
      Swal.fire({
        title: "Error al finalizar la compra",
        icon: "error",
        text: error,
      });
    });
};

renderProductsTable();
