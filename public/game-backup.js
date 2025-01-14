var boxtd = document.querySelectorAll("td");
var boxImg = document.querySelectorAll("td img");
var resetBtn = document.getElementById("reset");
var alertBox = document.getElementById("alert");
var alertRematch = document.getElementById("alertRematch");
var alertHeading = document.querySelector("#alert h1");
var alertQuit = document.getElementById("alertQuit");
var firstPlayerTurn = true;
var checkPlayer1winsBoolean = false;
var checkPlayer2winsBoolean = false;

const socket = io();

socket.on("connect", function() {
    console.log("Connected");
});

/****************************** Player 1 code ********************************/

//check player 1 have his cross on given box
function p1Check(code){
    return boxImg[code].getAttribute("src") == "img/Cross.png";
}

//if player 1 won
function p1Won(){
    alertBox.style.display = "block";
    alertHeading.textContent = "Player 1 wins"
    checkPlayer1winsBoolean = true;
}

//check player 1 win or not
function checkPlayer1wins(){
    if(p1Check(0) && p1Check(1) && p1Check(2)){
        p1Won();
    }
    else if(p1Check(3) && p1Check(4) && p1Check(5)){
        p1Won();
    }
    else if(p1Check(6) && p1Check(7) && p1Check(8)){
        p1Won();
    }
    else if(p1Check(0) && p1Check(3) && p1Check(6)){
        p1Won();
    }
    else if(p1Check(1) && p1Check(4) && p1Check(7)){
        p1Won();
    }
    else if(p1Check(2) && p1Check(5) && p1Check(8)){
        p1Won();
    }
    else if(p1Check(0) && p1Check(4) && p1Check(8)){
        p1Won();
    }
    else if(p1Check(2) && p1Check(4) && p1Check(6)){
        p1Won();
    }
    else{
        checkPlayer1winsBoolean = false;
    }
}

/****************************** Player 2 code ********************************/

//check player 1 have his cross on given box
function p2Check(code){
    return boxImg[code].getAttribute("src") == "img/Circle.png";
}

//if player 1 won
function p2Won(){
    alertHeading.textContent = "Player 2 wins"
    alertBox.style.display = "block";
    checkPlayer2winsBoolean = true;
}

//check player 1 win or not
function checkPlayer2wins(){
    if(p2Check(0) && p2Check(1) && p2Check(2)){
        p2Won();
    }
    else if(p2Check(3) && p2Check(4) && p2Check(5)){
        p2Won();
    }
    else if(p2Check(6) && p2Check(7) && p2Check(8)){
        p2Won();
    }
    else if(p2Check(0) && p2Check(3) && p2Check(6)){
        p2Won();
    }
    else if(p2Check(1) && p2Check(4) && p2Check(7)){
        p2Won();
    }
    else if(p2Check(2) && p2Check(5) && p2Check(8)){
        p2Won();
    }
    else if(p2Check(0) && p2Check(4) && p2Check(8)){
        p2Won();
    }
    else if(p2Check(2) && p2Check(4) && p2Check(6)){
        p2Won();
    }
    else{
        checkPlayer2winsBoolean = false;
    }
}

/****************************** Game code ********************************/

//to add image to empty box
function addPlayerMark(i){
    checkPlayer1wins();
    checkPlayer2wins();
    if(checkPlayer1winsBoolean == false && checkPlayer2winsBoolean == false){
        if(boxImg[i].getAttribute("src") == "img/Empty.png"){
            if(firstPlayerTurn){
                boxImg[i].setAttribute("src", "img/Cross.png");
            }
            else{
                boxImg[i].setAttribute("src", "img/Circle.png");
            }
            firstPlayerTurn = !firstPlayerTurn;
        }
        checkPlayer1wins();
        checkPlayer2wins();
    }
    
}

//to add event listener to all td's
function event(box, i){
    box.addEventListener("click", function(){
        addPlayerMark(i);
    });
}
//add event function to all td elements
for(var i = 0; i < boxtd.length; i++){
    event(boxtd[i], i);
}
function clear(){
    for(var i = 0; i < boxImg.length; i++){
        boxImg[i].setAttribute("src", "img/Empty.png");
    }
    firstPlayerTurn = true;
}
resetBtn.addEventListener("click", function(){
    clear();
});

alertRematch.addEventListener("click", function(){
    alertBox.style.display = "none";
    clear();
});

alertQuit.addEventListener("click", function(){
    window.close();
});