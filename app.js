const express = require("express"),
  app = express(),
  socketIO = require("socket.io"),
  http = require("http"),
  winnerCheck = require("./tools/index"),
  flash = require("connect-flash"),
  generateRandomId = require("./tools/id");

//io initilization
const server = http.createServer(app);
const io = socketIO(server);

//requiring user model
const Users = require("./tools/users");

//initializing user model
let users = new Users();

const PORT = process.env.PORT || 3000;

//express session
app.use(
  require("express-session")({
    resave: false,
    secret: "The test",
    saveUninitialized: true,
  })
);

//connect flash config
app.use(flash());

//app config
app.set("view engine", "ejs");
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New User is connected.");

  socket.on("newUser", (user, sendCallback) => {
    let isfirstPlayer;
    socket.join(user.room);

    if (users.isRoomEmpty(user.room)) {
      socket.emit("yourPlayer", { playerName: 1, yourTurn: true });
      isfirstPlayer = true;
    } else {
      socket.emit("yourPlayer", { playerName: 2, yourTurn: false });
      socket.to(user.room).emit("opponentJoin", true);
      isfirstPlayer = false;
    }

    users.deleteUser(socket.id);
    users.createUser(user.username, socket.id, user.room, isfirstPlayer);

    sendCallback(isfirstPlayer);
  });

  socket.on("sentDecision", (decision, doneCallback) => {
    let user = users.getUserById(socket.id);

    io.to(user.room).emit("receiveDecision", {
      index: decision.index,
      player: decision.player,
    });
    socket.to(user.room).broadcast.emit("yourTurnSignal", { yourTurn: true });

    let winner = winnerCheck(decision.board);
    if (winner === 1) {
      io.to(user.room).emit("wonTheMatch", { winner: 1 });
      console.log("Player 1 won");
    } else if (winner === 2) {
      io.to(user.room).emit("wonTheMatch", { winner: 2 });
      console.log("Player 2 won");
    } else if (winner === "Draw") {
      io.to(user.room).emit("wonTheMatch", { winner: "Draw" });
      console.log("Draw");
    }
    doneCallback();
  });

  socket.on("rematch", () => {
    let user = users.getUserById(socket.id);
    socket.to(user.room).broadcast.emit("rematch", true);
  });

  socket.on("rematchResponse", (isAccepted) => {
    let user = users.getUserById(socket.id);
    if (isAccepted) {
      socket.to(user.room).broadcast.emit("rematchResponse", true);
      io.to(user.room).emit("goToNewRoom", generateRandomId());
    } else {
      socket.to(user.room).broadcast.emit("rematchResponse", false);
    }
  });

  socket.on("disconnect", () => {
    let disconnectedUser = users.getUserById(socket.id);
    users.deleteUser(socket.id);
    console.log("User disconnected");

    io.to(disconnectedUser.room).emit("userDisconnect", disconnectedUser.name);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/new", (req, res) => {
  const roomId = generateRandomId();
  res.render("new", { error: req.flash("error"), roomId: roomId });
});

app.get("/join", (req, res) => {
  res.render("join", { error: req.flash("error") });
});

app.get("/game/:roomId", (req, res) => {
  const user = {
    username: req.query.username,
    room: req.params.roomId,
  };
  let isUsernameEmpty = user.username === "";
  let isRoomnameEmpty = user.room === "";

  isUsernameEmpty = isUsernameEmpty || user.username === undefined;
  isRoomnameEmpty = isRoomnameEmpty || user.room === undefined;

  if (isUsernameEmpty || isRoomnameEmpty) {
    req.flash("error", "Username or room code can't be empty");
    return res.redirect("back");
  } else if (users.isRoomFull(user.room)) {
    req.flash("error", "The Room you want to enter is full");
    return res.redirect("back");
  }
  res.render("game", { user: user });
});

server.listen(3000, () => {
  console.log("Server started!!!");
});
