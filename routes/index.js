const express = require('express');
const Game = require('../models/Game.js');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Front Page' });
});

/* GET score. */
// get the dealer wins and player wins from the first (and only) document in the db.
router.get('/score', async function(req, res, next) {
  try {
    const game = await Game.findOne();
    res.status(200).json({
      "dealerWins": game.dealerWins,
      "playerWins": game.playerWins
    }); 
  } catch (err) {
    next(err);
  }
});

// POST route --> post new winning hand to array
router.post('/score', async function(req, res, next) {
  try {
    // create new element that will be going into the array of winners/winning hands
    let newGame = {
      "winner": req.body.winner,
      "hand": req.body.hand,
    }
    // console.log(newGame);
    // find the document
    const game = await Game.findOne();
    // console.log(game);
    if ( game ) {
      // post the new game into the array
      let updateFields = {};

      if ( req.body.winner === "dealer" ){
        // update dealerWins field if winner === to dealer
        updateFields = {
          "dealerWins": game.dealerWins + 1,
        }

      } else if ( req.body.winner === "player" ) {
        // update playerWins field if winner === to player
        updateFields = {
          "playerWins": game.playerWins + 1,
        }

      } else {
        // if not player or dealer --> return 404 error
        res.status(404).json({
          "failure": "New Game Not Able to be Entered! Error Occurred."
        });
      }

      // push new game into winningHands array 
      game.winningHands.push(newGame);
      updateFields["winningHands"] = game.winningHands;
      // update the mongodb document
      const doc = await Game.updateOne({}, { $set: updateFields});
      // return status and json based off of if the document was updated correctly.
      if (doc.matchedCount === 1 ){
        res.status(200).json({
          "success": "New Game Entered Successfully!"
        });
      } else {
      // if (doc.matchedCount === 0 )
        res.status(404).json({
          "failure": "New Game Not Able to be Entered To Winning Hands Array! Error Occurred."
        });
      }

    } else {
      let pWins = 0; let dWins = 0;
      if (req.body.winner === "player" ) {
        pWins = 1;
      } else if (req.body.winner === "dealer" ) {
        dWins = 1;
      } else {
        res.status(404).json({
          "failure": "New Game Not Able to be Entered! Error Occurred."
        }); 
      }
      // creates the document for the first time, if no document exists in database  --> on first ever play
      const doc = await Game.create({
        playerWins: pWins, 
        dealerWins: dWins, 
        winningHands: [newGame],
      });
      if ( doc ) {
        res.status(200).json({
          "success": "New Document Entered Successfully!"
        });
      } else {
        res.status(404).json({
          "failure": "New Game Not Able to be Entered! Error Occurred."
        }); 
      }
    }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      'message' : err.message
    });
  }
});

module.exports = router;
