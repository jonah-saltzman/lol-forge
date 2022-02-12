
# MegaMax Tic-Tac-Toe

This is MegaMax, a tic-tac-toe game client & my first project for the General Assembly software
engineering course. MegaMax gets its name from the "mega" 5x5 game mode option it offers, and the minimax
algorithm it uses to make the best move for the computer player. MegaMax is a single-page React application built largely on Amazon Web Services. The client app is stored on S3 and deployed via Amazon's CloudFront CDN. While the algorithm for the 3x3 mode can be run on client computers, in order to choose a move in the 5x5 mode, the client makes a POST request to an AWS API Gateway endpoint. This in turn triggers a serverless AWS Lambda function written in Python, which takes advantage of Python's multiprocessing module to calculate the score of each possible move in its own process. The best move(s) are determined and returned to the client application. The code for this Lambda function can be found in [aws_alg.py](https://github.com/jonah-saltzman/megamax-react/blob/main/aws_alg.py).

The deployed client can be accessed at [https://mega.jonahsaltzman.dev](https://mega.jonahsaltzman.dev)

## Application
(Note: some of the below may be outdated, as I recently refactored MegaMax to use React and integratw with AWS)

The MegaMax application consists of: 

- An `index.html` file containing initial UI elements
- An index.scss file containing all styling rules
- An app.js file containing all event handlers and a small number of functions to 
  call on page load

Along with two main project directories: `auth/` and `game/`. App code is organized into these directories according to their purpose, as opposed to function. Both directories include an `events.js` file where event handlers (for user interactions with the authentication and game interfaces, respectively) are defined. Both include an `api.js` file defining functions that
make API calls, and a `ui.js` file containing functions that modify the user interface.

### Structural design

In addition to the above file/directory structure, I also decided at project start to write
the application with as modular an architecture as possible. As such, distinct tasks are
performed by distinct functions, and identical operations with various origins are performed
by the same function. For example, the task of adding a move to the game board can originate
from the player, according to where they clicked on the board, or from the application itself,
according to the move selected by one of the decision algorithms. In both cases, the move to be
made is passed to the same function, `addMove()`, which is defined in `game/data.js`. In contrast,
since changing the authentication UI according to a response from the login API is a different
task than changing the game UI according to an action by the user, `updateGameUI()` and 
`signInSuccess()` are separate functions defined in the `game/` and `auth/` directories, respectively.

Another application design decision concerns how data describing the state of the current game
is stored, changed, and used by different parts of the app. The game state can be modified by various parts of the application: a move might be added to the game board by a function in
`game/events.js`, then the board state might be required by a function sending the latest move
to the game API in `game/api.js`, and finally, the new board state will be rendered on the UI
by a function in `game/ui.js`. Given how many parts of the app will need to be storing, changing,
and accessing information about the game, to prevent unintended effects & facilitate the adding
and updating of app functionality, all information about the current game is stored in an object defined inside `game/data.js`, which is accessed, changed, and read *only* by functions defined in the same file. When a new game is started, a function in `game/data.js` called `startGame()` is called to add the new game information (such as difficulty setting and ID provided by the API) to the `gameInfo` object. When that ID and the last move is needed by another function to update the game API, `getGameInfo()` is called which returns a deep copy of the gameInfo object.

### Game algorithm

MegaMax features two difficulty levels when playing against the computer. The "easy" mode makes
decisions according to the first algorithm I wrote, prior to researching the subject. This algorithm recursively analyzes all possible outcomes of each move available to the computer, and assigns each available move a score according to the sum of the scores of each outcome resulting from that move. In this algorithm, a win is given a score of +1, a loss -1, and a draw 0, and the score is divided by (1 + depth), where depth is the recursive depth of the algorithm at the point at which that outcome was found. This division gives greater weight to earlier outcomes, allowing the computer to prefer a win in 1 move to a win in 2 moves. 

The way I wrote this algorithm is naive, in that when selecting the "best" move at each branch in the decision tree, while it selects the best move for the computer when it is simulating computer moves, it *also* selects the best move for the computer when simulating player moves. Thus, this "easy" algorithm makes the best move for the computer, *assuming that the player will also make the best move for the computer*, which is in fact the worst move for the computer. This problem is addressed in my implementation of the MinMax algorithm, which is what is used for the "hard" mode. The MinMax algorithm chooses the best move for the computer while assuming that the player
will make the best move for the player, which is also the worst move for the computer. In "hard" mode, if the player always makes the best move, the game will always draw (on a 3x3 board).

Finally, the version of the minmax algorithm that is used for the computer player on the 
5x5 board implements alpha-beta pruning (without this optimization, early moves with an open
board took several minutes to compute).

## Requirements

The "minimum viable project" requirements for this project are, in addition to this readme.md file:  

### Application Requirements

- User must be able to sign up  
- User must be able to sign in  
- Signed in user must be able to sign out  
- Signed in user user must be able to start a tic tac toe game  
- When playing game, user must start as X and then rotate between X and O  
- When playing game, user must only select available spaces on the board  
- When playing game, user must be notified of win or tie  
- Once a game is over, user must not be able to add to that board  
- Once a game is over, user must be able to play again  

### API Requirements

- Sign up (`POST /sign-up`)
- Sign in (`POST /sign-in`)
- Sign out (`DELETE /sign-out`)
- New game (`POST /games`)
- Update game (`PATCH /games/:id`)
- Display a message to the user after sign in, sign up, and sign out success or failure.
- Sign in and sign up forms must clear after submit success

## User stories

The user stories I wrote before starting the project are as follows:
 - As a user looking for a diversion, I want it to be easy and quick to start a new game.
 - As a repeat user, I want to be able to save my game and come back to it later.
 - As a repeat user, I want the login process to be easy and quick.
 - As a new user, I want it to be easy to sign up for an account.
 - As a new user, I want it to be clear what I need to do in order to start playing.
 - As a competitive user, I want it to be easy to tell when a game is won.

## Wireframes

The wireframes I created when planning this project are below. The design of some elements
changed during the course of the project; for example, the "game info" is displayed below the game board in the latest version of the project, rather than to the right of the board.

![Main page](https://i.imgur.com/Jn5Vumg.jpg)
![Login popup](https://i.imgur.com/VLGPlsj.jpg)
![Signup popup](https://i.imgur.com/hC0OCMi.jpg)
