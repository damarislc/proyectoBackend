export const generateProductErrorInfo = (product) => {
  return `<p>Uno o más campos están incompletos o son inválidos.</p>
    <p>Lista de los campos requeridos:</p>
    <ul>
        <li> Título: debe de ser un String y se recibió "${product.title}"</li>
        <li> Descripción: debe de ser un String y se recibió "${product.description}"</li>
        <li> Código: debe de ser un String y se recibió "${product.code}"</li>
        <li> Precio: debe de ser un Número y se recibió "${product.price}"</li>
        <li> Cantidad disponible: debe de ser un Número entero y se recibió "${product.stock}"</li>
        <li> Categoría: debe de ser un String y se recibió "${product.category}"</li>
    </ul>`;
};

export const generateUserErrorInfo = (user) => {
  return `<p>Uno o más campos están incompletos o son inválidos.</p>
    <p>Lista de los campos requeridos:</p>
    <ul>
        <li> Nombre: debe de ser un String y se recibió "${user.name}"</li>
        <li> Apellido: debe de ser un String y se recibió "${user.lastname}"</li>
        <li> Email: debe de ser un String y se recibió "${user.email}"</li>
        <li> Edad: debe de ser un Número y se recibió "${user.age}"</li>
        <li> Contraseña: debe de ser un String</li>
    </ul>`;
};
