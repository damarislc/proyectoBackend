const productsDiv = document.querySelector("#products");
const products = [];
let user, hasPrevPage, prevLink, page, nextLink, hasNextPage;

const getProducts = async () => {
  const queryString = window.location.search;
  const url = "/api/products" + queryString;
  const result = await fetch(url);
  const data = await result.json();
  return data;
};

const createProductsCard = () => {
  let html = "";
  products.forEach((product) => {
    const able = product.status ? "Habilitado" : "Deshabilitado";
    html += `
      <div class="product">
        <span>ID</span>
        <p>${product._id}</p>
        <span>Título</span>
        <p>${product.title}</p>
        <span>Código</span>
        <p>${product.code}</p>
        <span>Descripción</span>
        <p>${product.description}</p>
        <span>Precio</span>
        <p>${product.price}</p>
        <span>Cantidad disponible</span>
        <p>${product.stock}</p>
        <span>Categoría</span>
        <p>${product.category}</p>
        `;
    if (user.role === "admin") {
      html += `<div class="status">
                <span>Estatus</span>
                <p>${able}</p>
               </div>`;
    }
    html += `   
        <button class="add-product" onclick="addProductToCart('${product._id}')">Agregar al
          carrito</button>
    `;

    if (user.role === "admin" || user.role === "premium") {
      html += `<a href="/edit/${product._id}"><button class="btn-admin">Editar</button></a>
              <button class="btn-admin" onclick="confirmDisable('${product._id}', '${product.title}')">Deshabilitar</button>
            </div>`;
    } else {
      html += "</div>";
    }
  });
  productsDiv.innerHTML = html;
};

const editProduct = (pid) => {};

const renderProducts = async () => {
  const data = await getProducts();
  if (!data.success) {
    //TODO mostrar msj de error
    return;
  }

  user = data.user;

  data.payload.forEach((product) => {
    /*
    solo el admin puede ver todos los productos aun 
    cuando el estatus esta en false*/
    if (user.role === "admin") products.push(product);
    else if (product.status) products.push(product);
  });

  hasPrevPage = data.hasPrevPage;
  prevLink = data.prevLink;
  page = data.page;
  hasNextPage = data.hasNextPage;
  nextLink = data.nextLink;
  createMenu(user);
  createWelcomeMessage(user);
  createProductsCard();
  createPagination();
  buttonsVisibility(user);
};

const buttonsVisibility = (user) => {
  const createProductBtn = document.querySelector(".div-createproduct-btn");
  const chatBtn = document.querySelector(".div-chat-btn");
  createProductBtn.style.display = "none";
  chatBtn.style.display = "none";
  if (user.role === "user" || user.role === "premium")
    chatBtn.style.display = "block";
  if (user.role === "admin" || user.role === "premium")
    createProductBtn.style.display = "block";
};

const createMenu = (user) => {
  const divFirstRow = document.querySelector(".first-row");
  let html = `
  <div class="right">
      <div class="div-mockup-btn">
        <a href="/mockingproducts">
          <button class="green-btn">Ir a Productos Mockup</button>
        </a>
      </div>
      
        <div class="div-createproduct-btn">
          <a href="/create">
            <button class="btn-admin">Crear producto</button>
          </a>
        </div>
     
        <div class="div-chat-btn">
          <a href="/chat">
            <button class="green-btn">Ir al chat</button>
          </a>
        </div>
     
      <div class="div-cart-btn">
        <a href="/carts/${user.cart}">
          <button class="green-btn">Ir al carrito</button>
        </a>
      </div>

      <div class="div-perfil-btn">
        <a href="/current"><button class="green-btn">Ir a perfil</button></a>
      </div>
      <div id="div-logout">
        <button onclick="logout()" class="logout">Logout</button>
      </div>
    </div>
  `;

  divFirstRow.innerHTML = html;
};

const createWelcomeMessage = (user) => {
  const welcomeMessage = document.querySelector("#welcome-message");
  const html = `
    Bienvenido a la tienda
    ${user.name}! Soy
    <span id="user-role">${user.role}</span>
  `;
  welcomeMessage.innerHTML = html;
};

renderProducts();

/**
 * Para esta entrega, se hardcodeara un cart id de
 * un carrito existente para evitar que se cree uno nuevo
 * cada que se accede a la vista de productos.
 */
//const myCartId = "65dbf04b8e58e8e94a3e2844";

/**
 * Funcion para añadir un producto al carrito
 * @param {*} pid el id del producto
 */
function addProductToCart(pid) {
  //const form = document.querySelector("#login-form");
  const cid = user.cart;
  //se hace un fetch con el id del carrito y el id del producto
  fetch(`/api/carts/${cid}/product/${pid}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((result) => {
      //si la data tiene un estatus success
      if (result.success) {
        //se manda  un alert de que el producto se ha añadido al carrito
        Swal.fire({
          title: "Producto añadido al carrito",
          icon: "success",
        });
      } else if (result.unavailable) {
        Swal.fire({
          title: result.error.name,
          text: result.error.cause,
          icon: "error",
        });
      } else {
        //sino, se manda un alert de error
        Swal.fire({
          title: result.error.name,
          icon: "error",
          text: result.error.cause,
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: error.name,
        icon: "error",
        text: `Error ${error.cause}`,
      });
    });
}

function confirmDisable(pid, title) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn green-btn",
      cancelButton: "btn red-btn",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: `Seguro que quiere deshabilitar el producto con el id: ${pid} y título: ${title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        disableProduct(pid);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "El producto seguirá siendo visible.",
          icon: "error",
        });
      }
    });
}

function disableProduct(pid) {
  //hace un fetch a la api
  fetch(`/api/products/disable/${pid}`, {
    method: "PUT",
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: "Producto se ha deshabilitado correctamente",
          icon: "success",
          showDenyButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          //recarga la pagina
          if (result.isConfirmed) location.reload();
        });
      } else {
        //sino, se manda un alert de error
        console.log("res=", result);
        Swal.fire({
          title: "Error al deshabilitar el producto",
          text: result.error.cause,
          icon: "error",
        });
      }
    })
    .catch((error) => console.error(error));
}

function createPagination() {
  const paginationDiv = document.querySelector("#pagination");
  let htmlPagination = "";
  if (hasPrevPage) {
    htmlPagination += `
      <button>
          <a href=${prevLink}>
            <svg
              class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root navigate-before"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              data-testid="NavigateBeforeIcon"
            >
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
          </a>
        </button>
      `;
  }
  htmlPagination += `<span class="page">${page}</span>`;
  if (hasNextPage) {
    htmlPagination += `
      <button>
        <a href=${nextLink}>
          <svg
            class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root navigate-next"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
            data-testid="NavigateNextIcon"
          >
            <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
          </svg>
        </a>
      </button>
      `;
  }
  paginationDiv.innerHTML = htmlPagination;
}
