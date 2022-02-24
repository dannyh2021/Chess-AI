const { Chess } = require('./js/chess.js')

// create new game
const chess = new Chess();

chess.header("Test Key", "Test Value");

console.log("board: \n" + chess.ascii());

// console.log("chess.board: \n" + JSON.stringify(chess.board()));

console.log("fen: " + chess.fen())

console.log("pgn:" + chess.pgn())

// ........

// create simple evaluation

// minimax simple evaluation

// create better evaluation function

// design structure of app

// set up gui

// implement basic algorithms, minimax, alpha-beta pruning

// implement reinforcement learning algorithm

// optimize

// upload