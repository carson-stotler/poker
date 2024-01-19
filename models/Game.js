const mongoose = require('mongoose');

// gameSchema will keep track of wins of the player and dealer so it can easily be grabbed (GET) to display on main page
// I will keep an array of who won and what there hand was each round
// I think I should be able to increment the winners count based on what was passed in the "winner" string.
// I am just going to have a single document I believe, with one long array of subdocuments, instead of a bunch of single documents for every single play.
// this way I can keep count easier and don't have to use a for loop or something to count number of wins every time the page is opened.
const gameSchema = new mongoose.Schema({
    "dealerWins": {type: Number, default: 0},
    "playerWins": {type: Number, default: 0},
    "winningHands": {type: [{
        "winner": {type: String},
        "hand":  {type: String}
        }], required: true, default: []
    }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
