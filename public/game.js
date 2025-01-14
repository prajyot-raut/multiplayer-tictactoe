const socket = io({transports: ['websocket'], upgrade: false});
let isYourTurn = false;
let boxes = document.querySelectorAll("table img");
let playerNumber = 0;
const custom = customAlert(false);

let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

socket.on("connect", () => {
    socket.emit("newUser", {username: username, room: room}, function(isFirstPlayer) {
        let tip = document.querySelectorAll(".tip");

        console.log(isFirstPlayer);
        if(isFirstPlayer) {
            tip[0].parentElement.children[1].innerText = "You";
            displayTurn(true);
        } else {
            tip[1].parentElement.children[1].innerText = "You";
            displayTurn(false);
        }
    });
});

socket.on("yourPlayer", player => {
    if(player.playerName === 1) {
        document.querySelector("#loading").style.display = "block";
    }
    playerNumber = player.playerName;
    isYourTurn = player.yourTurn;
});

boxes.forEach((box, i) => {
    box.addEventListener("click", () => {
        if(box.getAttribute("src") === "/img/Empty.png" && isYourTurn) {
            board[i] = playerNumber;
            socket.emit("sentDecision", {index: i, player: playerNumber, board: board}, function() {
                displayTurn(false);
            });
            isYourTurn = false;
        }
    });
});

socket.on("receiveDecision", decision => {
    let player;
    decision.player === 1 ? player = "/img/Cross.png" : player = "/img/Circle.png";
    board[decision.index] = decision.player;
    boxes[decision.index].setAttribute("src", player);
});

socket.on("wonTheMatch", winnerData => {
    isYourTurn = false;
    let matchEndDisplay;
    let winner;
    winnerData.winner === playerNumber ? winner = "You" : winner = "Player " + winnerData.winner;

    if(winnerData.winner === 1 || winnerData.winner === 2) {
        matchEndDisplay =  winner + " Wins";
    } else {
        matchEndDisplay = "Draw";
    }

    document.querySelector("#alertHead").textContent = matchEndDisplay;
    document.querySelector("#alert").style.display = "block";
});

socket.on("opponentJoin", isJoined => {
    document.querySelector("#loading").style.display = "none";
});

socket.on("yourTurnSignal", whoseTurn => {
    isYourTurn = whoseTurn.yourTurn;
    displayTurn(whoseTurn.yourTurn);
});

socket.on("userDisconnect", name => {
    custom.alert("Your opponent disconnted from the match.");
});

document.querySelectorAll("table img").forEach(img => {
    img.setAttribute("src", "/img/Empty.png");
});

document.querySelector("#alertRematch").addEventListener("click", () => {
    socket.emit("rematch", true);
});

socket.on("rematch", () => {
    custom.confirm("Your oppent wants an another round of match.", function(done) {
        socket.emit("rematchResponse", done);
    });
});

socket.on("rematchResponse", isAccepted => {
    if(isAccepted) {
        custom.alert("Accepted");
    } else {
        custom.alert("Opponent not accepted the challenge.");
    }
});

socket.on("goToNewRoom", roomName => {
    location.pathname = "/game/" + roomName;
});

function displayTurn(isYourTurn) {
    let turnDisplay = document.querySelector("#turnDisplay");
    if(isYourTurn === true) {
        turnDisplay.textContent = "Your";
    } else {
        turnDisplay.textContent = "Opponent";
    }
}

document.querySelector("#alert").style.height = window.getComputedStyle(document.querySelector("body")).getPropertyValue("height");
document.querySelector("#loading").style.height = window.getComputedStyle(document.querySelector("body")).getPropertyValue("height");