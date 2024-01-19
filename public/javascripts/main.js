/*
 * This files holds all the code to for your card game
 */

/* 
 * Links I used to help with create the modal and overaly
 * https://www.w3schools.com/howto/howto_css_modals.asp
 * https://www.freecodecamp.org/news/how-to-build-a-modal-with-javascript/
 * https://semantic-ui.com/modules/modal.html#/usage
*/

//Run once broswer has loaded everything
window.onload = function () {
 
    //All your Front end code should be here!

    const modal = document.getElementById("myModal");
    const firstDealButton = document.getElementById("firstDeal");
    const winDealButton = document.getElementById("winDealBtn");
    const loseDealButton = document.getElementById("loseDealBtn");
    const tieDealButton = document.getElementById("tieDealBtn");
    const overlay = document.getElementById("overlay");
    const hit = document.getElementById("hitBtn");
    const stay = document.getElementById("stayBtn");
    const addedCards = document.getElementsByClassName("newCard");
    let deck_id = 0;
    let current_cards = [];
    let playerHand = [];
    let dealerHand = [];
    let playerCount = 0;
    let dealerCount = 0;
    let flippedCard = {};

    // event listener for when the page laods, the modal and overlay pops up
    modal.addEventListener("loadstart", function(){
        modal.style.display = "block";
        overlay.style.display = "block";
    },false);

    // event listener for when the deal button is clicked the modal and overlay goes away
    firstDealButton.addEventListener("click", async function(){
        modal.style.display = "none";
        deal();
    }, false);

    // event listener when the winning modal is up, seeing if they want to play again
    winDealButton.addEventListener("click", async function(){
        document.getElementById("winningModal").style.display = "none";
        deal();
    }, false);

    // event listener when the losing modal is up, seeing if they want to play again
    loseDealButton.addEventListener("click", async function(){
        document.getElementById("losingModal").style.display = "none";
        deal();
    }, false);

    // event listener when the tieing modal is up, seeing if they want to play again
    tieDealButton.addEventListener("click", async function(){
        document.getElementById("tieModal").style.display = "none";
        deal();
    }, false);

    // function to deal 4 cards and give them to correct person and get score
    const deal = async function() {
    
        overlay.style.display = "none";
        document.getElementById("flipDealer").style.transform = "rotateX(0deg)";
        // remove any cards (images/divs) that were added from previous round.
        // couldn't figure out how to get rid of the space that a previous dealt card used, then the space between cards continued to grow :(
        while (addedCards.length > 0) {
            addedCards[0].style.display = "none";
            addedCards[0].remove();
        }

        playerHand = [];
        dealerHand = [];
        playerCount = dealerCount = 0;

        // fetch to get a new deck each time a game starts and needs 4 new cards --> could have done shuffle to reuse the same cards from before, this was easier at first use.
        let deck = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1", {
            method: 'GET',
        })
        // return the response.json
        .then(response => response.json())
        // check if the fetch response has a deck_id
        .then(res => {
                if ( res.hasOwnProperty("deck_id") ){
                    deck_id = res.deck_id;
                    console.log("Deck ID secured: " + deck_id);
                } else {
                    // deck not shuffled correctly.
                    console.log("Deck not received correctly.");
                }
            })
        
        // need to deal 4 cards - 2 to the player and 2 to the dealer
        // this fetch deals 2 to each person
        let firstCards = await fetch("https://deckofcardsapi.com/api/deck/" + deck_id + "/draw/?count=4", {
            method: 'GET',
        })
        // return the response.json
        .then(response => response.json())
        // check if the fetch response has cards that were drawn
        .then(res => {
                if ( res.hasOwnProperty("cards") ){
                    console.log(res.cards);
                    current_cards = res.cards;
                    // alternates who get what cards --> I think this is how real BlackJack works
                    playerHand.push(res.cards[0]);
                    playerHand.push(res.cards[2]);
                    dealerHand.push(res.cards[1]);
                    dealerHand.push(res.cards[3]);
                    document.getElementById("playerCard1").src = playerHand[0].image;
                    document.getElementById("dealerCard1").src = dealerHand[0].image;
                    document.getElementById("playerCard2").src = playerHand[1].image;
                    flippedCard = dealerHand[1];
                    // sets back of card to the 2nd dealer card, makes the actual image be on the down side.
                    document.getElementById("dealerCard2").src = '../Card_Back.png';
                    document.getElementById("dealerCard2-1").src = flippedCard.image;
                    // get's current count of the cards
                    // could probably simplify this into an easier function or better code --> refactor in future if needed.
                    for ( c in current_cards ){
                        if ( (c % 2) === 0 ) {
                            // player's Cards
                            if ( current_cards[c].value === "JACK" || current_cards[c].value === "QUEEN" || current_cards[c].value === "KING" ) {
                                playerCount = playerCount + 10;
                            } else if ( current_cards[c].value === "ACE"){
                                // check cases for ACE card
                                if ( (playerCount + 11) > 21 ){
                                    playerCount = playerCount + 1;
                                } else {
                                    playerCount = playerCount + 11;
                                }
                            } else {
                                playerCount = playerCount + Number(current_cards[c].value);
                            }
                        } else {
                            // dealer's cards
                            if ( Number(c) === 3 ) {
                                // don't count if it is the dealer's 2nd card.
                                break;
                            }
                            if ( current_cards[c].value === "JACK" || current_cards[c].value === "QUEEN" || current_cards[c].value === "KING" ) {
                                dealerCount = dealerCount + 10;
                            } else if ( current_cards[c].value === "ACE"){
                                // check cases for ACE card
                                if ( (dealerCount + 11) > 21 ){
                                    dealerCount = dealerCount + 1;
                                } else {
                                    dealerCount = dealerCount + 11;
                                }
                            } else {
                                dealerCount = dealerCount + Number(current_cards[c].value);
                            }
                        }
                    }
                    // add's initial count for both players
                    document.getElementById("playerDealCount").innerHTML = "<b>"+playerCount+"</b>";
                    document.getElementById("dealerDealCount").innerHTML = "<b>"+dealerCount+"</b>";

                    // checks if either person has BlackJack from first two cards!
                    checkForBlackJack(playerCount, dealerCount, playerHand, dealerHand);

                } else {
                    // deck not dealt correctly.
                    console.log("Cards not dealt correctly.");
                }
            })

        // populate the overall wins table to include the win totals of the dealer and the player from mongo db
        // could possibly do this in the beginning, but all the same, timing may just be off.
        let wins = await fetch("http://localhost:3000/score", {
            method: 'GET',
        })
        // return the response.json
        .then(response => response.json())
        // check if the fetch response has correct fields
        .then(res => {
            console.log(res);
                if ( res.hasOwnProperty("dealerWins") && res.hasOwnProperty("playerWins") ){
                    console.log("GETTING WINS SUCCESS. " + res.dealerWins + " to " + res.playerWins);
                    document.getElementById("dealerCount").innerHTML = "<h3>"+res.dealerWins+"</h3>";
                    document.getElementById("playerCount").innerHTML = "<h3>"+res.playerWins+"</h3>";
                } else {
                    console.log("GETTING WINS FAILED.");
                }
            })

    };

    // event listener for when the player chooses to hit!
    hit.addEventListener("click", async function(){
        // need to deal 1 card to the player
        let firstCards = await fetch("https://deckofcardsapi.com/api/deck/" + deck_id + "/draw/?count=1", {
            method: 'GET',
        })
        // return the response.json
        .then(response => response.json())
        // check if the fetch response has cards that were drawn
        .then(async res => {
                if ( res.hasOwnProperty("cards") ){
                    console.log(res.cards);
                    current_cards = res.cards;
                    // keeps all the player's cards in playerHand so it is stored for future use.
                    playerHand.push(res.cards[0]);
                    // document.getElementById("playerCard3").src = current_cards[0].image;
                    if ( current_cards[0].value === "JACK" || current_cards[0].value === "QUEEN" || current_cards[0].value === "KING" ) {
                        playerCount = playerCount + 10;
                    } else if ( current_cards[0].value === "ACE"){
                        // checks ACE case
                        // need to have a check if playerCount would go over 21, only make ACE value 1
                        if ( (playerCount + 11) > 21 ){
                            playerCount = playerCount + 1;
                        } else {
                            playerCount = playerCount + 11;
                        }
                    } else {
                        playerCount = playerCount + Number(current_cards[0].value);
                    }
                    await dealANewCard("playerHand", "playerCards", res.cards[0]);
                    // timing may be slightly off during this part.
                    setTimeout(() => {
                        document.getElementById("playerDealCount").innerHTML = "<b>"+playerCount+"</b>";
                    }, 1500);

                    // if player over 21 go to bust page --> aka dealer wins
                    if ( playerCount > 21 ) {
                        setTimeout(dWins, 2000);
                    }
                    
                } else {
                    // deck not drawn correctly.
                    console.log("Cards not drawn correctly for the player.");
                }
            })
    },false);

    stay.addEventListener("click", async function(){
        // need to flip 2nd dealer card --> update dealer count and display it
        document.getElementById("flipDealer").style.transform = "rotateX(180deg)";
        // document.getElementById("flipDealer").display = "block";
        if ( flippedCard.value === "JACK" || flippedCard.value === "QUEEN" || flippedCard.value === "KING" ) {
            dealerCount = dealerCount + 10;
        } else if ( flippedCard.value === "ACE"){
            // check ACE case
            // need to have a check if dealerCount would go over 21, only make ACE value 1
            if ( dealerCount > 10 ){
                dealerCount = dealerCount + 1;
            } else {
                dealerCount = dealerCount + 11;
            }
            
        } else {
            dealerCount = dealerCount + Number(flippedCard.value);
        }
        document.getElementById("dealerDealCount").innerHTML = "<b>"+dealerCount+"</b>";
        // while dealerCount is < 17
        // once above 17 and <= 21, check if greater than playerCount
            // dealer wins if greater than playerCount
            // player wins if less than playerCount
            // push -- tie if they are equal
        // in loop have to continue to deal cards to dealer's "pile"
        while ( dealerCount < 17 ) {
            // fetch to draw cards and add to dealer's cards. 
            let firstCards = await fetch("https://deckofcardsapi.com/api/deck/" + deck_id + "/draw/?count=1", {
                method: 'GET',
            })
            // return the response.json
            .then(response => response.json())
            // check if the fetch response has cards that were drawn
            .then(async res => {
                    if ( res.hasOwnProperty("cards") ){
                        console.log(res.cards);
                        // keeps all the dealer's cards in dealerHand so it is stored for future use.
                        dealerHand.push(res.cards[0]);
                        // document.getElementById("dealerCard3").src = current_cards[0].image;
                        if ( res.cards[0].value === "JACK" || res.cards[0].value === "QUEEN" || res.cards[0].value === "KING" ) {
                            dealerCount = dealerCount + 10;
                        } else if ( res.cards[0].value === "ACE"){
                            // need to change at some point
                            // need to have a check if dealerCount would go over 21, only make ACE value 1
                            if ( dealerCount > 10 ){
                                dealerCount = dealerCount + 1;
                            } else {
                                dealerCount = dealerCount + 11;
                            }
                        } else {
                            dealerCount = dealerCount + Number(res.cards[0].value);
                        }
                        await dealANewCard("dealerHand", "dealerCards", res.cards[0]);
                        // timing is slightly off here --> could be refactored if expanding on project.
                        await setTimeout(() => {
                            document.getElementById("dealerDealCount").innerHTML = "<b>"+dealerCount+"</b>";
                            console.log(dealerCount);
                        }, 1500);
                        
                    } else {
                        // deck not drawn correctly.
                        console.log("Cards not drawn correctly for the dealer.");
                    }
                })
        }
        // checks the count in all cases after dealer is >= 17.
        if ( dealerCount > 21 || dealerCount < playerCount ) {
            // dealer busts and/or player wins
            console.log("player wins");
            setTimeout(pWins, 2000);
            // pWins();
        } else if ( dealerCount > playerCount) {
            // dealer wins
            console.log("dealer wins");
            setTimeout(dWins, 2000);
        } else {
            console.log("push -->");
            setTimeout(tie, 2000);
        }
    })

    // function to deal a new card to the front end, adds a div into that given person's hand.
    const dealANewCard = async function(pHand, cardClass, card){
        setTimeout(() => {
            document.getElementById(""+pHand+"").innerHTML += 
                "<div class='column'><img src="+ card.image +" class='"+cardClass+" cards newCard'></div>";
        }, 1500);
    }
    // function to check for Black Jack in beginning of game.
    const checkForBlackJack = async function(playerCount, dealerCount, pHand, dHand ) {
        if ( playerCount === 21 ){
            // Black Jack!!
            // need to check dealer doesn't have 21 --> then player wins
            // flipped card is the dealer's 2nd card.
            let dCount = 0;
            if ( flippedCard.value === "JACK" || flippedCard.value === "QUEEN" || flippedCard.value === "KING" ) {
                dCount = dCount + 10;
            } else if ( flippedCard.value === "ACE"){
                // need to change at some point
                // need to have a check if dealerCount would go over 21, only make ACE value 1
                if ( dCount > 10 ){
                    dCount = dCount + 1;
                } else {
                    dCount = dCount + 11;
                }
            } else {
                dCount = dCount + Number(flippedCard.value);
            }
            if ( ( dealerCount + dCount ) == 21){
                tie();
            } else {
                pWins();
            }
            // for now -->
            // pWins();
        }
        
    }

    // make functions for:
        // when player wins
        // when dealer wins
        // when it is a push
    // if player wins
    const pWins = async function() {
        let hand = playerHand.map(card => card.code).join(", ");

        const res = await fetch("http://localhost:3000/score",
        {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "winner": "player",
                "hand": hand,
            })
        })

        document.getElementById("winningModal").style.display = "block";

    } 
    // if dealer wins
    const dWins = async function() {
        let hand = dealerHand.map(card => card.code).join(", ");

        const res = await fetch("http://localhost:3000/score",
        {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "winner": "dealer",
                "hand": hand,
            })
        })

        document.getElementById("losingModal").style.display = "block";
    }
    // if it is a push
    const tie = async function() {
        document.getElementById("tieModal").style.display = "block";
    }

    // When the user clicks anywhere outside of the modal, close it
    /* window.onclick = function(event) {
        if (event.target != modal) {
            modal.style.display = "none";
            overlay.style.display = "none";
        }
    } */


};
