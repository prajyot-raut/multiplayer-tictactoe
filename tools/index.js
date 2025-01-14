let playerWon;
function p1Check(code, board){
    return board[code] === 1;
}
function p2Check(code, board){
    return board[code] === 2;
}

function whichPlayerWon(first, second, third, board) {
    if(p1Check(first, board) && p1Check(second, board) && p1Check(third, board)) {
        playerWon = 1;
        return true;
    } else if(p2Check(first, board) && p2Check(second, board) && p2Check(third, board)) {
        playerWon = 2;
        return true;
    }
    return false;
}

function checkPlayerwins(board){
    let isBoardHasSpace = board.filter(map => map === 0);

    if(whichPlayerWon(0, 1, 2, board) || whichPlayerWon(3, 4, 5, board) || whichPlayerWon(6, 7, 8, board) || whichPlayerWon(0, 3, 6, board) || whichPlayerWon(1, 4, 7, board) || whichPlayerWon(2, 5, 8, board) || whichPlayerWon(0, 4, 8, board) || whichPlayerWon(2, 4, 6, board)){
        return playerWon;
    } else{
        if(isBoardHasSpace.length === 0) {
            return "Draw";
        }
        return false;
    }
}

module.exports = checkPlayerwins;