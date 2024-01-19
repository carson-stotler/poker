# Making a Blackjack 21 Game using HTML/CSS/DOM

## Carson Stotler

In this project, you will use HTML, CSS, and JavaScript on the Frontend to create a playable blackjack 21 game. You will also record win and losses to a MongoDB to be displayed on the frontend.

### REST API for Cards
You will use the [Deck of Card API](http://deckofcardsapi.com/) as a way to create a Deck of Cards, take cards out of that deck, and manage the hands of the player and the dealer. It is a very simple API that provides images of cards, values, creating hands and decks, etc. The listed webpage has all the details on using the API. 

### Blackjack Game
Blackjack is a simple card game between a dealer and a player. The goal is to get 21 points, without going over 21 (busting). A player wins if they:
* get 21 points on the player's first two cards (called a "blackjack" or "natural"), without a dealer blackjack;
* reach a final score higher than the dealer without exceeding 21
* let the dealer draw additional cards until their hand exceeds 21 ("busted").

The game goes as follows:
* Both the dealer and the player get two cards from the deck. The first card from the dealer is visible to the player, but the second is not.
* The player goes first and is allowed to ask for another card (Hit) or end their turn (Stay). If the player goes over 21, the game is over and the dealer wins.
* Next the dealer gets to go. They flip their hidden card and must get new cards until they have at least 17 points. Then they stop once they reach or go beyond 17. If they go over 21, the player wins.
* If neither the player nor the dealer goes over 21, then whoever has the most points wins. If they have the same points, the game is a tie.

Number cards are worth the number listed on the card. Face cards (King, Queen, Jack) are worth 10 points. And Aces are worth 11 or 1 points (use the value that ensures you do not go over 21).

### Frontend layout
Your page should have a green (card table green) background. At the top center will be the dealer's hand, on the bottom center will be the players hand. On the right side of the dealer and player's hand will be a number showing the current points for that hand (labeled as such). On the left side of the player's hand will be two buttons. One label Hit me, which will give a new card to the player, and another labeled "Stay", which will finish the player's turn. Between the player and the dealer on the left will be the deck of cards (face down). On the upper lefthand side will be a scoring tally of number of times the dealer and player have won. For example, if the dealer has won 5 times and the play 3 times this tally would read: (Wins: Dealer 5, Player 3).

### Game Flow
The flow of the game (events that need to take place) are as follows:
* The moment the main HTML page loads, a modal (screen overlay, see [here] (https://semantic-ui.com/modules/modal.html) as an example) appears asking if the player wishes to play. Under that, there is a green button labeled "Deal" which will start the game.
* The scoring tally is updated from the MongoDB to display the record of times the dealer and player have won.
* Once the button is pressed, the modal goes away, and the player and dealer are dealt two cards. The dealer is given cards first. Then the player gets their cards. They are then both flipped face up to reveal the cards to the player. The score for the cards is displayed to the right of both the player and the dealer.
* Player can now press the "Hit Me" button to get another card. The score total will also update. If the score goes above 21, the dealer's hand is completely revealed, and the player loses (go to the game over modal as described later in this section. 
* Once the player presses the "stay" button. The dealer starts their turn. The dealer's hand is completely revealed (and the score by the dealer's hand is now updated). The dealer will continue to add cards until they have at least a score of 17. If the dealer goes over 21, the game is over and the player wins. (Go to the game over screen).
* If both the player and dealer do not go over 21, then whoever has the highest number wins. If they have the same score, it is a tie. (Go to the game over modal)
* The game over modal will display who won, and a button asking if the player wishes to play again. If this button is pressed. The cards, score, etc are cleared, the modal goes away BUT the scoring tally in the upper lefthand side is updated to reflect who won the last round. The player can now play the game again.

### API and MongoDB considerations
* You must make an API with two routes.
  * GET request on /score that gives a JSON object of dealer and player wins. This is used to update the scoring tally each time the game is played.
  * POST request on /score that accepts a JSON body of who won that round, and what the winning hand was (using the coding scheme used by the Deck of Cards API). For example (KH, QC) would be a winning hand that has the King of Hearts and the Queen of Clubs.
* You must store each round of play in the MongoDB database (i.e. who won and what the winning hand is). You will then use this data to service the GET request that returns how many times the Dealer and the Player have won.
* Your data model, schema, JSON structure, etc are yours to design and make. But you must comment and explain this in your code and your video.

### Other considerations
* You can write Raw HTML files instead if you wish. Just replace the pug files to an HTML file in the route.
* You should not need to reload the page once it loads for the first time. Everything should be done by using JavaScript to change and update the DOM. Whem the game restarts, you chould clear the DOM to the start state of the game, and continue from there. Do not reload the webpage to play another game.
* You can use Semantic UI, or any other CSS library if you wish. You can update these in the layout.pug file in the views directory. 
* Some features in Semantic UI will require jQuery and SemanticUI.js. You can import these from cdnjs [https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js](https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js)
* You should use regular JS to update and change the DOM, not jQuery. 
* You can use any feature in Semantic UI (or similar CSS Library) that you would find useful.
* You will need to make a 5-minute video describing your code and attach a link to it to this README.
* You will need to find an image for the back of the cards of your deck. This can be anything you want. 
* A simple example of CSS Animations using movements can be found [here](https://jsfiddle.net/h7tuehmo/3/)
* More details on CSS animations can also be found [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) 

### Install and Run
You must have node.js running on your machine. Once you have cloned this project you can run `npm install` to install all the packages for this project. Then running `npm run dev` will run the dev version of this code, which will run this project with nodemon. Nodemon auto-restarts the node server every time you make a change to a file. Very helpful when you are writing and testing code.

### .env and MongoDB
You need to have a MongoDB server running before launching your API. You can
download MongoDB [here](https://www.mongodb.com/try/download/community), or install it via a package manager.
Windows users, read [Install MongoDB on Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/).

You can also use
[MongoDB Atlas](https://www.mongodb.com/atlas/database) instead of downloading and installing MongoDB locally. 

Which ever you do, you will need to cretae a .env from the .env.example 
You can do this by `cp .env.example .env`

Then store your MongoDB URI connection in your  `.env` file.

**Note:** Never EVER push private information (like MongoDB connection URIs) to a Git Repo. We use .env to store this connection inforation and ensure that git (using .gitignore) never pushs this private information in the repo. Never ever store real credentials in `.env.example` or anywhere that is not `.env` as you may push these changes to your git repo.

### Get Hosted with MongoDB Atlas

- Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Click the green **Try Free** button
- Fill in your information then hit **Create your Atlas account**
- You will be redirected to an Overview page.
- Click on the green **Create** button underneath "Create a deployment"
- Select the free **M0** configuration.
- Give Cluster a name (default: Cluster0)
- Click on the green **Create** button
- Now, to access your database you need to create a DB user. You should have been redirected to the **Quickstart** tab in the **Security** section on the left-hand side of the webpage.
- Create a new Mongo user with credentials of your choice (it WILL NOT & SHOULD NOT be shared with anybody besides yourself.)
- Add `0.0.0.0/0` to your IP Access List in the menu below the user creation menu.
- Press `Finish and Close`. This will redurect you back to your **Overview** section.
- Click on **Connect** in the **Database Deployments** card in the **Overview** section.
- In the new screen, select **Node.js** as Driver and version **5.5 or later**.
- Finally, copy the URI connection string and replace the URI in MONGODB_URI of `.env`in your project directory (if you don't see it, create a copy of `.env.example` and name it as `.env`) with this URI string.  Make sure to replace the <PASSWORD> with the db User password that you created under the Security tab.
- Note that after some of the steps in the Atlas UI, you may see a banner stating `We are deploying your changes`.  You will need to wait for the deployment to finish before using the DB in your application.




