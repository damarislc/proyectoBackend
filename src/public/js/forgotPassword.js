const forgotPasswordButton = document.querySelector("#forgot-password");
forgotPasswordButton.addEventListener("click", (e) => {
  Swal.fire({
    title: "Escriba su email a recuperar contraseña",
    input: "email",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Enviar",
    showLoaderOnConfirm: true,
    preConfirm: async (email) => {
      const obj = {};

      //introduce al objeto el contenido del form con clave - valor
      obj["email"] = email;

      try {
        const response = await fetch("/api/sessions/forgot-password", {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          result = await response.json();
          return Swal.showValidationMessage(result.message);
        }
        return response.json();
      } catch (error) {
        Swal.showValidationMessage(`
        Request failed: ${error}
      `);
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: result.value.message,
      });
    }
  });
});
