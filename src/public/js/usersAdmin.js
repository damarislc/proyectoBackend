const getUsers = async () => {
  try {
    const result = await fetch("/api/user/all");
    const users = await result.json();
    return users;
  } catch (error) {
    Swal.fire({
      title: "Error al obtener los usuarios",
      icon: "error",
      text: error,
    });
    return null;
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const usersTable = document.querySelector("#users-table .users");
  usersTable.innerHTML = "";
  const users = await getUsers();

  users.forEach((user) => {
    if (user.email === "adminCoder@coder.com") return;
    let localDate = new Date(user.last_connection);
    const userRow = `<tr>
                        <td>${user.name}</td>
                        <td>${user.lastname}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.last_connection} (UTC)</td>
                        <td>${localDate}</td>
                        <td>
                            <button class="change-role" onClick="changeRole('${user._id}','${user.email}','${user.role}')">Cambiar role</button>
                        </td>
                        <td>
                            <button class="delete-user" onclick="deleteUserConfirmation('${user.email}')">❌</button>
                        </td>
                     </tr>`;
    usersTable.innerHTML += userRow;
  });
});

const changeRole = (id, email, role) => {
  let newRole = "";
  if (role === "premium") newRole = "user";
  else newRole = "premium";
  const user = {
    id,
    email,
    role,
  };
  Swal.fire({
    title: `Cambiar el role del usuario ${email} a ${newRole}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Cambiar",
  }).then((result) => {
    if (result.isConfirmed) {
      changeRoleFetch(user, newRole);
    }
  });
};

const changeRoleFetch = (user, newRole) => {
  const obj = { role: newRole };
  fetch(`/api/user/premium/${user.id}`, {
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
          if (result.isConfirmed) location.reload();
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
};

const deleteUserConfirmation = (email) => {
  Swal.fire({
    title: `Seguro que quieres eliminar el usuario ${email}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUser(email);
    }
  });
};

const deleteUser = async (email) => {
  try {
    const obj = {};
    obj["email"] = email;
    const result = await fetch("/api/user/", {
      method: "DELETE",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const users = await result.json();
    Swal.fire({
      title: "Usuario eliminado exitosamente",
      icon: "success",
      showDenyButtonText: false,
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) location.reload();
    });
  } catch (error) {
    Swal.fire({
      title: "Error al obtener los usuaerios",
      icon: "error",
      text: error,
    });
    return null;
  }
};

const deleteInactives = () => {
  fetch("/api/user/inactives", {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        Swal.fire({
          title: "Se eliminar lo susuarios inactivos",
          icon: "success",
        });
        Swal.fire({
          title: "Se eliminaron lo susuarios inactivos",
          icon: "success",
          showDenyButtonText: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) location.reload();
        });
      } else {
        Swal.fire({
          title: "Error al eliminar los usarios inactivos",
          icon: "error",
          text: result.error,
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: "Error al eliminar los usarios inactivos",
        icon: "error",
        text: error,
      });
    });
};
