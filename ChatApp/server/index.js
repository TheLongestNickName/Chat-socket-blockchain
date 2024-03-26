const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

const route = require("./route");
const { addUser, findUser, getRoomUsers, removeUser } = require("./users");
const { Block, Blockchain } = require("./block");

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const blockchain = new Blockchain();

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }) => {
    socket.join(room);

    const { user, isExist } = addUser({ name, room });

    const userMessage = isExist
      ? `${user.name}, here you go again`
      : `Glad to see you ${user.name} in our chat`;

    socket.emit("message", {
      data: { user: { name: "Admin" }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit("message", {
      data: { user: { name: "Admin" }, message: `${user.name} has joined` },
    });

    io.to(user.room).emit("room", {
      data: { users: getRoomUsers(user.room) },
    });
  });

  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);
    const transactions = blockchain.getTransactions(message);

    if (user) {
      if (transactions) {
        socket.emit("message", {
          data: { user: { name: user.name }, message, transactions },
        });
      } else {
        io.to(user.room).emit("message", {
          data: { user, message },
        });
      }

      const startCount = 1;
      const randomValue = Math.floor(Math.random() * 100);
      const newBlock = new Block(blockchain.chain.length + 1, Date.now(), {
        ETH: randomValue,
        WalletFrom: `WalletFrom +${startCount}`,
        WalletTo: `WalletTo+${startCount}`,
      });
      blockchain.addBlock(newBlock);
      console.log("New block added :", newBlock);
    }
  });

  socket.on("leftRoom", ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, name } = user;

      io.to(room).emit("message", {
        data: { user: { name: "Admin" }, message: `${name} has left` },
      });

      io.to(room).emit("room", {
        data: { users: getRoomUsers(room) },
      });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running");
});
