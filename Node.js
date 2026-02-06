const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public")); // pasta com index.html

let players = {};

io.on("connection", (socket) => {
  console.log("Novo jogador:", socket.id);

  // Quando jogador escolhe cor
  socket.on("newPlayer", (color) => {
    players[socket.id] = { x: 50, y: 50, color: color };
    io.emit("updatePlayers", players);
  });

  // Movimentos
  socket.on("move", (dir) => {
    let player = players[socket.id];
    if (!player) return;
    if (dir === "up") player.y -= 5;
    if (dir === "down") player.y += 5;
    if (dir === "left") player.x -= 5;
    if (dir === "right") player.x += 5;
    io.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

http.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
