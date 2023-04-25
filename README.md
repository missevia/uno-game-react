<h1>UNO GAME</h1>

This project was built using Create React App.

Published game: <a href='https://uno-game.surge.sh/'>uno-game.surge.sh/</a>

<h2>How to run the project locally</h2>

1. Clone the repository
2. Run npm install 
3. Run npm start

<h2>How to play</h2>

<ol>
  <li>Objective: Be the first player to get rid of all your cards.</li>
				<li>In this version of the game, you will play against 3 bots.</li>
				<li>Setup: Each player is dealt 7 cards. The remaining cards form a draw pile, and the top card is turned over to start the discard pile.</li>
				<li>Play: Players take turns playing a card from their hand that matches the top card of the discard pile either by color, number, or symbol. If a player cannot play a card, they must draw one from the draw pile.</li>
				<li> When it is your turn to play, your hand and the draw pile will be highlighted, indicating that you can play a card or draw a card from the pile.</li>
				<li>Special cards: Skip, Reverse, Draw Two, Wild, Wild Draw Four.</li>
				<li>Skip: When a player plays the Skip card, the next player in the turn order is skipped, and the turn moves to the following player. </li>
				<li>Reverse: The Reverse card changes the direction of play. If the game was moving clockwise, it will now move counterclockwise, and vice versa. </li>
				<li>Draw Two: When a player plays the Draw Two card, the next player must draw two cards from the draw pile and forfeit their turn.
           If the next player also has a Draw Two card of the same color, they can stack their card on top, forcing the following player to draw four cards. 
           This can continue, with each consecutive Draw Two card adding two more cards to the total for the player who cannot stack another Draw Two card.
				</li>
				<li>Wild: The Wild card can be played on top of any card if there is no active special card in play. It allows the player who plays it to continue their 
          turn without needing to match the color or number of the card on top of the discard pile.
				</li>
				<li>
          Wild Draw Four: The Wild Draw Four card requires the next player to draw four cards from the draw pile, forfeiting their turn. 
          This card can only be played when the player holding it has no other card in their hand that matches the current color. 
				</li>
				<li>Winning: The first player to play all their cards wins the round. The game can be played for a predetermined number of rounds or until a player wins a certain number of rounds (e.g., best of 5 or best of 7).</li>

</ol>

<h3>Enjoy!</h3>


