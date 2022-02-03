
// board defaults to the starting position when called with no parameters
var board, game = new Chess();

// AI Part
var minimaxRoot = function(depth, game, isMaximisingPlayer) {
    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        game.ugly_move(newGameMove);
        // to be continued
    }
    return bestMoveFound
}

// board visualization and game states handling
var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !==-1) {
        return false;
    }
}

var positionCount;
var getBestMove = function (game) {
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

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < renderMoveHistory.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + (moves[i+1] ? moves[i+1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight)
}

var onDrop = function (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    })

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
}

var onSnapEnd = function() {
    board.position(game.fen());
}

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    })

    if (moves.length === 0) return;

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
}

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
}

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
}

var cfg = {
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

console.log("board: " + board);
console.log('game: ' + game);