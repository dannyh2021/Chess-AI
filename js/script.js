// notes
// board - array of length-8 arrays each containing 8 piece = {"type", "color"} objects or null

// board defaults to the starting position when called with no parameters
var board;
var game = new Chess();
var $status = $('#status')


var evaluateBoard = function(board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
        }
    }
    return totalEvaluation;
}

var reverseArray = function(array) {
    return array.slice().reverse();
}

// simple evaluation function, evaluating only material
/*
pawn    10
knight  30
bishop  30
rook    50
queen   90
king    900

positive for white, negative for black
*/

// returns material value of piece
var getPieceValueSimple = function (piece) {
    if (piece === null) {
        return 0;
    }
    
    var getAbsoluteValue = function (piece) {
        if (piece.type === 'p') {
            return 10;
        } else if (piece.type === 'n') {
            return 30;
        } else if (piece.type === 'b') {
            return 30;
        } else if (piece.type === 'r') {
            return 50;
        } else if (piece.type === 'q') {
            return 90;
        } else if (piece.type === 'k') {
            return 900;
        }
    }

    
    return piece.color === 'w' ? getAbsoluteValue() : 0
    
    throw "Unknown piece type: " + piece.type;
}

/*
var getPieceValue = function(piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function(piece, isWhite, x, y) {
        if (piece.type === 'p') {
            return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
        } else if (piece.type === 'r') {
            return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
}
*/

// board visualization and game states handling
let onDragStart = function(source, piece, position, orientation) {
    // do not pick up pieces if game over
    if (game.game_over()) {
        return false;
    }

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) != -1) ||
        (game.turn() === 'b' && piece.search(/^w/) != -1)) {
        return false;
    }
}

let makeBestMove = function() {
    let bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
}

function makeRandomMove () {
    let possibleMoves = game.moves();
  
    // game over
    if (possibleMoves.length === 0)
        return;
  
    // make random move
    let randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());

    // update move history
    renderMoveHistory(game.history());

    if (game.game_over()) {
        alert("Game Over");
    }
}

let positionCount;
let getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = Date().getTime();
    var moveTime = (d2 - d);
    var PositionsPerS = (positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
}

let renderMoveHistory = function(moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + (moves[i+1] ? moves[i+1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight)
}

let onDrop = function (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to queen for simplicity
    })

    removeGreySquares();
    // illegal move
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    updateStatus();
    window.setTimeout(makeRandomMove, 250);
    // window.setTimeout(makeBestMove, 250);
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
let onSnapEnd = function() {
    board.position(game.fen());
}

// grey possible moves when mouse over piece
let onMouseoverSquare = function(square, piece) {
    let moves = game.moves({
        square: square,
        verbose: true
    })

    if (moves.length === 0) return;

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

function updateStatus() {
    let status = ''

    let moveColor = 'White'
    if (game.turn() === 'b') {
      moveColor = 'Black'
    }
  
    // checkmate?
    if (game.in_checkmate()) {
      status = 'Game over, ' + moveColor + ' is in checkmate.'
    }
    // draw?
    else if (game.in_draw()) {
      status = 'Game over, drawn position'
    }
    // game still on
    else {
      status = moveColor + ' to move'
  
      // check?
      if (game.in_check()) {
        status += ', ' + moveColor + ' is in check'
      }
    }
  
    $status.html(status)
}

let onMouseoutSquare = function(square, piece) {
    removeGreySquares();
}

let removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
}

function greySquare(square) {
    let squareEl = $('#board .square-' + square);

    let background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
}

let cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};

// var board1 = Chessboard('board', 'start');
board = ChessBoard('board', cfg);

console.log("board: " + JSON.stringify(board));
console.log("game: " + JSON.stringify(game));
updateStatus();