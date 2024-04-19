import MessageManager from "../dao/messageManager.js";

export const initChatSocket = (io) => {
  //crea una instancia del MessageManager
  const messageManager = new MessageManager();
  //crea un arreglo de usuarios
  const users = {};

  //Cuando se crea una conección con el socket
  io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");
    //y se recibe el evento newUser
    socket.on("newUser", (userEmail) => {
      //almacena el email del usuario en el arreglo de usuarios con el indice del socket actual
      users[socket.id] = userEmail;
      //y emite el evento userConnected hacia el frontend
      io.emit("userConnected", userEmail);
    });

    //cuando se recibe el evento chatMessage
    socket.on("chatMessage", (message) => {
      //obtiene el email del arreglo con el id del socket correspondiente
      const userEmail = users[socket.id];

      //Almacena el mensaje y el email en la base de datos llamando al método addMessage
      //Si la promesa es exitosa, emite el evento message al frontEnd
      //sino, emite el evento error
      messageManager
        .addMessage(userEmail, message)
        .then(io.emit("message", { userEmail, message }))
        .catch((error) => io.emit("error", error));
    });

    //si se recibe el evento disconnect
    socket.on("disconnect", () => {
      //se elimina el usuario del arreglo
      const userEmail = users[socket.id];
      delete users[socket.id];
      io.emit("userDisconnected", userEmail);
    });
  });
};
