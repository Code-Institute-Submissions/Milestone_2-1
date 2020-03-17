# Milestone 2  - HexCheckeres

Live Demo: [here](https://cojanradu.github.io/Milestone_2/)

HexCheckers is a mini-game where 2 players compete against each other by capturing opponent's pieces.
The game is a simplified version of popular game checkers, and played on a hexagonal grid.


# UX

Simplified user interface, there are only 2 buttons for Instructions and Options, playing is intuitive, users can either click on piece than click on destination, or drag a piece to its destination. Text instructions and color will change according to user interaction.
The page is intended for desktop or tablet.
The game page is responsive on size and orientation change. It will not work well on screen resolutions lower than 400 pixels in width or height.

# Features

#### Implemented
Features from traditional checkers game implemented: players take turns, pieces can jump over other pieces, there is a "jump" capture, a win condition -  one of the players has only one piece left

#### Rules
The object of the game is to capture all of your opponent's pieces
Players take turns to move one piece at the time
Pieces can jump over any adiacent piece if space is available
If a jump is made and another jump is available than player continues his moves
If a jump is available player have to execute that move
Game ends when any player has only one piece left

#### Options
 - Players position: player's pieces will be placed top and bottom (vertical) or left and right (horizontal) of the grid. The difference is that on vertical there is left and right movement available, and on horizontal there is front and back.
 - Player's pieces - the number of "lines" the pices will have, on vertical there is an extra line with just one piece
 - Grid size - the "radius" of the grid, has to be an odd number (center plus at least one on each side)

#### Exceptions
unlike the traditional rules, there are no "kings", pieces can move backwards, pieces can "jump" over same player pieces
I did some experiments on those on "admin" part, in the end those rules were too complex for the purpose of this project

# Technologies Used

JavaScript for functionality, HTML and CSS for front-end
JQuery mainly for DOM selections and JQuery UI for drag-and-drop and modal (dialog). JQuery UI was used because it provides better drag support than bootstrap, downside being there is no mobile support, so it uses another external JS library.   

# Testing

Only manual testing was used. There were lots of bugs, mostly of them were addressed, one left is that in unknown circumstances a player turn doesn't end properly so he can make 2 moves instead of one.
On mobile the page will scroll.
On Microsoft Surface the drag functionality doesn't work.
Game doesn't work on IE, works on Firefox, Chrome and Edge.


# Credits
hexagon functionality inspired by [Red Blob Games] https://www.redblobgames.com/grids/hexagons
Jquery UI touch events [http://touchpunch.furf.com/](http://touchpunch.furf.com/)
