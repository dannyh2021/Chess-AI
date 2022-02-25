// grab necessary libraries
const express = require('express');
const path = require('path');
const { prependOnceListener } = require('process');

// start new Express app
const app = express();

// create server
app.listen(3000, () => {
    console.log('App listening on port 3000');
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});


// send resources
app.get('/css/chessboard-1.0.0.css', (req, res) => {
    res.sendFile(path.resolve(__dirname, './css/chessboard-1.0.0.css'));
});

app.get('/css/style.css', (req, res) => {
    res.sendFile(path.resolve(__dirname, './css/style.css'));
})

// pictures
const pieces = ['bB', 'bK', 'bN', 'bP', 'bQ', 'bR', 'wB', 'wK', 'wN', 'wP', 'wQ', 'wR'];

for (let i = 0; i < pieces.length; i++) {
    app.get('/img/chesspieces/wikipedia/' + pieces[i] + '.png', (req, res) => {
        res.sendFile(path.resolve(__dirname, './img/chesspieces/wikipedia/' + pieces[i] + '.png'));
    });
}

app.get('/js/script.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './js/script.js'));
    console.log('/img/chesspieces/wikipedia/' + pieces[0] + '.png');
});

app.get('/js/chessboard-1.0.0.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './js/chessboard-1.0.0.js'));
});

app.get('/js/chess.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './js/chess.js'))
});

app.get('/js/evaluation_weights.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './js/evaluation_weights.js'));
})

// send 404 not found page
/*app.use((req, res) => {
    res.writeHead(404);
    res.sendFile(path.resolve(__dirname, 'notFound.html'));
});*/