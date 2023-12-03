//variables || import || require
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const routes_sign = require("./routes/sign");
const routes_friend = require("./routes/friend");
const routes_logo = require("./routes/logo");

const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const { disconnected,getFriendConnected } = require("./database/user");
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP,
        methods: ["GET", "POST"],
    },
});

app.use(cors());

const port = process.env.PORT || 9000;
mongoose
    .connect(`mongodb+srv://${process.env.DB}@database.4wfi2ky.mongodb.net/poker`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes_sign);
app.use("/friend", routes_friend);
app.use("/logo", routes_logo);

app.get("/", (req, res) => {
    res.send("<style>body { background-color:rgb(10,40,10)}</style>");
});

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.emit("yourSocket", socket.id);

    socket.on("messageServer", (data) => {
        const { s, id, reason } = data;
        io.to(s).emit("message", { id, reason, sender: socket.id });
    });
    socket.on('sendToFriendCo',(id,s,friends) => {
        for (const friend of friends) {
            socket.to(friend).emit('friendCo',id,s)
        }
    })
    socket.on('deleteFriend',(s,id) => {
        socket.to(s).emit('friendDeleted',id)
    })
    socket.on('newFriend',(s,id) => {
        socket.to(s).emit('newFriend',id)
    })

    socket.on("disconnect", async () => {
        const idPlayer = await disconnected(socket.id);
        const friendConnected = await getFriendConnected(idPlayer)
        for (const friend of friendConnected) {
            console.log('friend',friend);
            socket.to(friend).emit('disconnected',idPlayer)
        }
    });
});

server.listen(port);
