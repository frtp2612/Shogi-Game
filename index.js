// Dependencies
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 5000;
const http = require("http");

var app = require("express")();
var userCount = 0;

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/pages/index.html");
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

//GAME CONSTANTS
const mainRoom = "MainRoom";

const board = `
<div id="board-container">
<div class='top-bar'><span class='self'></span> VS <span class='opponent'>Waiting for opponent...</span></div>
<span class='turn'></span>
<div class="left-area">
<ul id="capturedBoard" class="opponent"></ul>
</div>
<table id="board">
<tbody>
    <tr>
        <td data-name="I-1"></td>
        <td data-name="I-2"></td>
        <td data-name="I-3"></td>
        <td data-name="I-4"></td>
        <td data-name="I-5"></td>
        <td data-name="I-6"></td>
        <td data-name="I-7"></td>
        <td data-name="I-8"></td>
        <td data-name="I-9"></td>
    </tr>
    <tr>
        <td data-name="H-1"></td>
        <td data-name="H-2"></td>
        <td data-name="H-3"></td>
        <td data-name="H-4"></td>
        <td data-name="H-5"></td>
        <td data-name="H-6"></td>
        <td data-name="H-7"></td>
        <td data-name="H-8"></td>
        <td data-name="H-9"></td>
    </tr>
    <tr>
        <td data-name="G-1"></td>
        <td data-name="G-2"></td>
        <td data-name="G-3"></td>
        <td data-name="G-4"></td>
        <td data-name="G-5"></td>
        <td data-name="G-6"></td>
        <td data-name="G-7"></td>
        <td data-name="G-8"></td>
        <td data-name="G-9"></td>
    </tr>
    <tr>
        <td data-name="F-1"></td>
        <td data-name="F-2"></td>
        <td data-name="F-3"></td>
        <td data-name="F-4"></td>
        <td data-name="F-5"></td>
        <td data-name="F-6"></td>
        <td data-name="F-7"></td>
        <td data-name="F-8"></td>
        <td data-name="F-9"></td>
    </tr>
    <tr>
        <td data-name="E-1"></td>
        <td data-name="E-2"></td>
        <td data-name="E-3"></td>
        <td data-name="E-4"></td>
        <td data-name="E-5"></td>
        <td data-name="E-6"></td>
        <td data-name="E-7"></td>
        <td data-name="E-8"></td>
        <td data-name="E-9"></td>
    </tr>
    <tr>
        <td data-name="D-1"></td>
        <td data-name="D-2"></td>
        <td data-name="D-3"></td>
        <td data-name="D-4"></td>
        <td data-name="D-5"></td>
        <td data-name="D-6"></td>
        <td data-name="D-7"></td>
        <td data-name="D-8"></td>
        <td data-name="D-9"></td>
    </tr>
    <tr>
        <td data-name="C-1"></td>
        <td data-name="C-2"></td>
        <td data-name="C-3"></td>
        <td data-name="C-4"></td>
        <td data-name="C-5"></td>
        <td data-name="C-6"></td>
        <td data-name="C-7"></td>
        <td data-name="C-8"></td>
        <td data-name="C-9"></td>
    </tr>
    <tr>
        <td data-name="B-1"></td>
        <td data-name="B-2"></td>
        <td data-name="B-3"></td>
        <td data-name="B-4"></td>
        <td data-name="B-5"></td>
        <td data-name="B-6"></td>
        <td data-name="B-7"></td>
        <td data-name="B-8"></td>
        <td data-name="B-9"></td>
    </tr>
    <tr>
        <td data-name="A-1"></td>
        <td data-name="A-2"></td>
        <td data-name="A-3"></td>
        <td data-name="A-4"></td>
        <td data-name="A-5"></td>
        <td data-name="A-6"></td>
        <td data-name="A-7"></td>
        <td data-name="A-8"></td>
        <td data-name="A-9"></td>
    </tr>
</tbody>
</table>
<div class="right-area">
<ul id="capturedBoard" class="own"></ul>
</div>
<div class="bottom-bar"><button id="surrenderButton">Surrender</button><button id="quitMatchButton">Quit</button></div>
</div>`;

const page = `
<div id="main-container">
<div class="connectedUsers"><span>Connected Users</span>
<ul>
</ul>
</div>
<div class="nav-bar">
  <ul>
	<li class="rules clickable">Rules</li>
	<li class="contact clickable">Contact Us</li>
  <li><input type="text" class="roomName" placeholder="Room Name" minlength="4" maxlength="16">
  <button id="createRoomButton">Create Room</button></li>
  </ul>
</div>
<div class="rooms">
<ul></ul>
</div>
</div>`;

const login = `
<div class="login">
	<h3 class="beta">BETA</h3>
	<div>
		<div class="logo">
			<img src="images/layout/logo.svg">
		</div>
		<div class="form">
			<input class="username" type="text" placeholder="Username" minlength="4" maxlength="16">
    		<span></span>
    		<button id="loginButton">Connect</button>
		</div>
	</div>
	<h4 class="copyright">Copyright © 2018 Playshogi.club. All rights reserved.</h4>
</div>
`;

const roomDestroyedMessage = "The room you were inside does not exist anymore. The creator has quit the room. You will be redirected to the main page.";

//GAME VARIABLES

const movesPedina = Array("up");
const movesLanciere = Array("upUp");
const movesAlfiere = Array("diagDiagUpRight", "diagDiagDownRight", "diagDiagDownLeft", "diagDiagUpLeft");
const movesTorre = Array("upUp", "rightRight", "downDown", "leftLeft");
const movesCavallo = Array("leftUp", "rightUp");
const movesGenArg = Array("up", "diagUpRight", "diagDownRight", "diagDownLeft", "diagUpLeft");
const movesGenOro = Array("up", "diagUpRight", "right", "down", "left", "diagUpLeft");
const movesRe = Array("up", "diagUpRight", "right", "diagDownRight", "down", "diagDownLeft", "left", "diagUpLeft");
const movesTorrePromossa = Array("upUp", "rightRight", "downDown", "leftLeft", "diagUpRight", "diagDownRight", "diagDownLeft", "diagUpLeft");
const movesAlfierePromosso = Array("diagDiagUpRight", "diagDiagDownRight", "diagDiagDownLeft", "diagDiagUpLeft", "up", "right", "down", "left");

const boardCoordinates = Array("A", "B", "C", "D", "E", "F", "G", "H", "I");

const piecesList = Array( {Name: "Pawn", Description: "A pawn can move one square directly forward. It cannot retreat."},
                          {Name: "Promoted Pawn", Description: "Loses his current moveset and gains properties of a gold general."},
                          {Name: "Lance", Description: "A lance can move any number of free squares directly forward. It cannot move backward or to the sides."},
                          {Name: "Promoted Lance", Description: "Loses his current moveset and gains properties of a gold general."},
                          {Name: "Bishop", Description: "A bishop can move any number of free squares along any one of the four diagonal directions."},
                          {Name: "Promoted Bishop", Description: "It moves like a bishop or a king, but each turn only one of two ways."},
                          {Name: "Rook", Description: "A rook can move any number of free squares along any one of the four orthogonal directions."},
                          {Name: "Promoted Rook", Description: "It moves like a rook or a king, but each turn only one of two ways."},
                          {Name: "Knight", Description: "Knight moves like chess knights, in an “big L” shape, but can only move forward."},
                          {Name: "Promoted Knight", Description: "Loses his current moveset and gains properties of a gold general."},
                          {Name: "Silver General", Description: "A silver general can move one square diagonally or one square directly forward, giving it five possibilities."},
                          {Name: "Promoted Silver General", Description: "Loses his current moveset and gains properties of a gold general."},
                          {Name: "Gold General", Description: "A gold general can move one square orthogonally, or one square diagonally forward, giving it six possible destinations. It cannot move diagonally backward."},
                          {Name: "King", Description: "A king can move one square in any direction, orthogonal or diagonal."},);

var SOCKET_LIST = {};

var Player = function (id, uniqueId, name) {
  var self = {
    id: id,
    uniqueId: uniqueId,
    name: name,
    roomCreated: false,
    insideRoom: false,
    faction: ""
  }

  self.createRoom = function () {
    self.roomCreated = true;
    self.insideRoom = true;
  }

  self.joinRoom = function () {
    self.insideRoom = true;
  }

  self.abandonRoom = function () {
    self.insideRoom = false;
  }

  self.destroyRoom = function () {
    self.roomCreated = false;
    self.insideRoom = false;
  }

  self.setFaction = function (value) {
    self.faction = value;
  }

  Player.list[uniqueId] = self;

  return self;
}

Player.list = {};

var Room = function (id, name) {
	var self = {
    	id: id,
    	name: name,
    	player1: Player.list[id],
    	player2: "",
    	player1Pieces: createPieces(),
    	player2Pieces: createPieces(),
    	connectedUsers: 1,
    	wantToStart: 0,
    	turn: "black"
	}

	self.updateWantsToStart = function () {
    	self.wantToStart++;
	}

	self.setOpponent = function(value) {
    	self.player2 = value;
    	self.connectedUsers = 2;
    	self.setPlayersPieces();
	}

	self.destroyRoom = function(roomName) {
    	delete Room.list[roomName];
	}

	self.abandonRoom = function() {
    	self.player2 = "";
    	self.connectedUsers = 1;
    	self.wantToStart = 0;
    	self.player1Pieces = createPieces();
	}

	self.setPlayersPieces = function() {
    	self.player1Pieces = createPieces();
    	self.player2Pieces = createPieces();
	}

	self.rematch = function() {
    	self.wantToStart = 0;
    	self.setPlayersPieces();
	}

	self.updateTurn = function(value) {
    	self.turn = value;
	}

	Room.list[name] = self;

	return self;
}

Room.list = {};

var Piece = function (id, name, upgradable, property, startPosition, upgradedName, simpleMoves, upgradedMoves) {
	var self = {
    	id: id,
    	name: name,
    	upgradable: upgradable,
    	promoted: false,
    	property: property,
    	captured: false,
    	currentPosition: startPosition,
    	upgradedName: upgradedName,
    	simpleMoves: simpleMoves,
    	upgradedMoves: upgradedMoves
	}

	self.newPosition = function (position) {
    	self.currentPosition = position;
	}

	self.capture = function (newProperty) {
    	self.captured = true;
    	self.property = newProperty;
    	self.promoted = false;
	}

	self.promote = function () {
    	self.promoted = true;
	}

	self.drop = function (value) {
    	self.captured = false;
    	self.property = value;
	}

	return self;
}

/**** END OF OBJECTS ******/


/**** ROOM METHODS ******/
Room.playerTurn = function (socket) {
  if(Room.list[socket.room].wantToStart == 0) {
    socket.broadcast.to(socket.room).emit('askToStart', "<span>Your opponent wants to start the match</span><button id=\"startMatchButton\" class=\"accept\">Accept</button>");
    socket.emit('askToStart', "<span>Waiting for the reply...</span>");
  } else if(Room.list[socket.room].wantToStart == 1) {
    socket.broadcast.to(socket.room).emit('askToStart', "<span>Your opponent accepted your match request</span>");
    if(Room.list[socket.room].player2.id == socket.id) {
      socket.emit('turn', "");
      socket.broadcast.to(socket.room).emit('turn', "your turn");
    } else {
      socket.emit('turn', "your turn");
      socket.broadcast.to(socket.room).emit('turn', "");
    }
  }
  
  if(Room.list[socket.room].wantToStart < 2) {
    Room.list[socket.room].updateWantsToStart();
  }

}

/**** PLAYER METHODS ******/
Player.onConnect = function (socket, playerName) {
	var player = Player(socket.id, socket.uniqueId, playerName);

	showMainPage(socket.id);
	//writeToFile(player);
  
	socket.on("createRoom", function(roomName){ // create room
		createNewRoom(socket, player, roomName);
	});

	socket.on("joinRoom", function(roomName){ // join room
		joinNewRoom(socket, player, roomName);
	});

	socket.on("rules", function() { // display game rules
		var rules = `
		<div class="modal">
      		<div class="modal-rules-box">
    			<div class='close'>X</div>
    			<h1>Rules of the game</h1>
    			<div class="section">
        			<h2>General</h2>
        			<span>
        				Each player has twenty pieces: one King, two Gold Generals, two Silver Generals, two Knights, two Lances, one Rook, one Bishop and nine Pawns. 
            			Both players alternately make a move during each turn. 
            			For each turn, a player may either move or drop just one piece. 
            			A player may not give up his turn, also known as passing. 
            			Players are not obligated to move a piece already touched. 
            			One may even pick up a piece from the game board and see what is on the other side of the piece. 
            			However, when the move is completed and a hand leaves the piece, the move can no longer be retracted.
          			</span>
        		</div>

        		<div class="section">
        			<h2>Object of the Game</h2>
          			<span>
            			The goal of the game is to checkmate to your opponent (capture the opponent King).
        			</span>
        		</div>

        		<div class="section">
        			<h2>Terminology</h2>
        			<span>
            			Check: If a king is endangered and is threatened to be captured in the next move, this danger must be averted, if possible. The player giving check does not have to announce the check.
            			<br>
            			Checkmate: If a player cannot avert a danger and his King will be taken anyway on the next turn, this is checkmate and that player loses the game.
            			<br>
            			Repetition: the game ends if the same game position occurs four times consecutively – the game is considered a draw. 
            			However, if an eternal check originated from this situation, the player giving check and causing such a situation loses the game. 
            			The game reaches a jishogi if both kings have advanced into their respective promotion zones and neither player can hope to mate the other or to gain any further material. 
            			If this happens, the winner is decided as follows: 
            			All promoted pieces are canceled and points for individual pieces (including those captured) are summed up. 
            			Each rook and bishop scores 5 points and all other pieces except kings score 1 point each. A player scoring less than 24 points loses, otherwise the game is considered a draw.

            			Note: In professional and serious amateur games, a player who makes an illegal move immediately loses the game.
          			</span>
        		</div>

        		<div class="section">
          			<h2>Pieces</h2>
          			<ul>`;
            		for(var i in piecesList) {
              			rules += "<li><h3>" + piecesList[i].Name + "</h3><img src='/images/layout/" + piecesList[i].Name.replace(/\s+/g, '') + ".svg'><span>" + piecesList[i].Description + "</span></li>";
            		}
    		rules += `</ul>
        		</div>

        		<div class="section">
          			<h2>Promotion</h2>
          			<span>
            			The three rows furthest away from a player are called the promotion zone.
            			Apart from the King and the Gold, any piece can be promoted to a more powerful piece when it makes a move completely or partly in the promotion zone. 
            			So, when a piece moves into, out of or fully inside the promotion zone it may be promoted upon completion of its move. 
            			Promotion is optional, provided that the piece still can make a legal move in case it is not promoted: if a Pawn or a Lance move to the last row, or a Knight moves to either of the last two rows, it must be promoted. 
            			In Shogi sets promoting a piece is done by turning this piece upside down. 
            			Its promoted name is written on its other side.
          			</span>
    			</div>

        		<div class="section">
        			<h2>Capturing Pieces</h2>
        			<span>
            			Pieces are captured as follows: the attacking piece takes the place of the captured enemy piece (capturing by placement). 
            			Captured pieces are removed from the game board. 
            			<br>
            			A player who captured the piece acquires the piece and places it aside to be seen, next to the game board on his side, and always shown as an unpromoted piece. 
            			Capturing pieces is optional. 
            			<br>
            			It is not mandatory to capture an enemy piece, it is always up to the player to decide if and when to capture an opponent's piece.
        			</span>
        		</div>

        		<div class="section">
        			<h2>Drops</h2>
        			<span>
            			On any turn, a player may either move a piece on the board or drop a captured piece onto the board. 
            			<br>
            			A player may drop a captured piece on any empty square on the board as his own (that's why the pieces are differentiated only by their oriented tips, not by colors). 
            			<br>
            			By dropping a piece, a check can be given (endangering of the king does not have to be announced), or even a checkmate can be given (except by a pawn). 
            			<br>
            			A piece can be dropped in the path of danger and to cancel a check. 
            			<br>
            			A piece is always dropped unpromoted side up, even if dropped into the promotion zone. 
            			<br>
            			A piece should be dropped on a field where it is still possible to move such a piece for at least one more move. Pawns and lances cannot be dropped onto the last row while knights cannot be dropped on the last two rows. 
            			<br>
            			A pawn cannot be dropped in a column containing another unpromoted pawn of the same player (promoted pawns do not count). 
            			<br>
            			A pawn cannot be dropped to give an immediate checkmate (although other pieces can); however, pawns may give checkmate on any subsequent move after the pawn was dropped.
        			</span>
        		</div>

        			<button value='Close' class='close'>Close</button>
    		</div>
		</div>
		`;

		socket.emit("displayRules", rules);
	});

	socket.on('matchStart', function() {
		var room = Room.list[socket.room];
    	if (room.player1 != undefined && room.player2 != undefined) {
    		Room.playerTurn(socket);
    	}
	});

	socket.on("rematch", function() {
		var room = Room.list[socket.room];
    	if(room.turn == "black") {
    		room.updateTurn("white");
    	} else {
    		room.updateTurn("black");
		}
		
    	room.rematch();
		socket.emit("clearAll");
		socket.broadcast.to(socket.room).emit("clearAll");
		
		if(room.player1.id == socket.id) {
    		socket.emit('displayPieces', room.player1Pieces);
			socket.broadcast.to(socket.room).emit('displayPieces', room.player2Pieces);
		} else {
			socket.emit('displayPieces', room.player2Pieces);
			socket.broadcast.to(socket.room).emit('displayPieces', room.player1Pieces);
		}
    	Room.playerTurn(socket);
	});

	socket.on("surrender", function() {
		if(Room.list[socket.room].wantToStart == 2) {
    		surrender(socket);
		}
	});

	socket.on("quit", function() {
    	if(Player.list[socket.uniqueId].insideRoom == true && Player.list[socket.uniqueId].roomCreated == true) {
			destroy(socket, false);
    	} else {
			quit(socket, false);
    	}
	});

	socket.on("abandon", function() {
    	socket.join(mainRoom);
	});

}

io.on('connection', function (socket) {
  	welcome(socket); // call the welcome function

  	socket.on('login', function(playerName){
		signIn(socket, playerName); // call the login function

		// on user disconnect, remove player from socket list,
    	// remove it from player list and leave the main room
    	socket.on('disconnect', function () { 
			Player.onDisconnect(socket);
		});
	});
});

io.on('connect', function (socket) {

	socket.on('movements', function (selected) {
    	var room = Room.list[socket.room]; // get room from room list
		var moves;
	
    	if (room.turn == "black" && findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player1', selected, false)) {

    		moves = possibleMoves(room.player1Pieces, selected); // assign to possible moves

    	} else if (room.turn == "white" && findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player1', selected, false)) {

    		moves = possibleMoves(room.player2Pieces, selected); // assign to possible moves

    	}

    	socket.emit('highlightSelectedPiece', selected); // highlight the clicked position
    	socket.emit('showMovements', moves);
    	socket.broadcast.to(socket.room).emit('highlightSelectedPiece', convertPosition(selected));
    
	});

	socket.on('hideMovements', function (selected) {
    	socket.emit('removeHighlightSelectedPiece', selected);
    	socket.broadcast.to(socket.room).emit('removeHighlightSelectedPiece', convertPosition(selected));
	});

	socket.on('move', function (selectedPiece, position) {
    	var room = Room.list[socket.room];

    	var piece;
    	var opponentPiece;
    	var eatedPiece, oppponentEatedPiece;
    	var controlUpgrade = false;

    	var eating = false;
    	var endGame = false;

    	if (room.turn == "black") {

    		// search my selected piece inside my pieces
    		piece = findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player1', selectedPiece, false);
    		// search my selected piece inside opponent pieces
    		opponentPiece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player2', convertPosition(selectedPiece), false);

    		// check if i clicked onto an opponent piece
    		eatedPiece = findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player2', position, false);
    		if(eatedPiece) {

        		if(eatedPiece.name == "King"){
        			endGame = true;
        		}

        		// search for the opponent clicked piece into my pieces
        		oppponentEatedPiece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player1', convertPosition(position), false);

        		eatedPiece.capture("");
        		oppponentEatedPiece.capture("");

        		socket.emit('addPieceToDrops', eatedPiece); // add captured piece to your drops
    			socket.broadcast.to(socket.room).emit('addOpponentPieceToDrops', eatedPiece); // show captured piece to opponent drops
    		}
      
    	} else if (room.turn == "white") {

    		piece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player1', selectedPiece, false);
    		opponentPiece = findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player2', convertPosition(selectedPiece), false);

    		// check if i clicked onto an opponent piece
      		eatedPiece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player2', position, false);
    		if(eatedPiece) {

        		if(eatedPiece.name == "King"){
        			endGame = true;
        		}

        		// search for the opponent clicked piece into my pieces
        		oppponentEatedPiece = findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player1', convertPosition(position), false);

        		eatedPiece.capture("");
        		oppponentEatedPiece.capture("");

        		socket.emit('addPieceToDrops', eatedPiece); // add captured piece to your drops
        		socket.broadcast.to(socket.room).emit('addOpponentPieceToDrops', eatedPiece); // show captured piece to opponent drops
    		}
      
    	}

    	if (endGame == false && (extractCoordinates(position) >= 6 || extractCoordinates(piece.currentPosition) >= 6) && piece.promoted == false && piece.upgradable == true) {
    		if (((piece.pieceName == "Pawn" || piece.pieceName == "Lance") && extractCoordinates(position) == 8) || (piece.pieceName == "Knight" && extractCoordinates(position) >= 7)) {
        		upgradePiece(piece, opponentPiece, position, socket, true);
    		} else {
    			socket.emit('wantToUpgrade', piece, opponentPiece, position);
    		}
    		controlUpgrade = true;
    	}

    	piece.newPosition(position);
    	opponentPiece.newPosition(convertPosition(position));

    	socket.emit('updatePlayerView', piece, selectedPiece, position, false);
    	socket.broadcast.to(socket.room).emit('updateOpponentView', piece, convertPosition(selectedPiece), convertPosition(position), false);

    	if(endGame) {
    		gameEnd(socket);
		}
		
    	if (controlUpgrade == false && endGame == false) {
    		updateTurns(socket);
    	}
	});

	socket.on('upgrade', function (piece, opponentPiece, position, choice) {
    	upgradePiece(piece, opponentPiece, position, socket, choice);
	});

	socket.on('showDrop', function(id) {
    	var room = Room.list[socket.room];

    	var moves;
    
    	if (room.turn == "black") {

    		var piece = findObjectByTripleKey(room.player1Pieces, 'property', 'id', 'captured', '', id, true);

    		moves = possibleDropPositions(piece, room.player1Pieces); // assign to possible moves

    	} else if (room.turn == "white") {
      
    		var piece = findObjectByTripleKey(room.player2Pieces, 'property', 'id', 'captured', '', id, true);

    		moves = possibleDropPositions(piece, room.player2Pieces); // assign to possible moves

    	}

    	//socket.emit('highlightSelectedPiece', position); // highlight the clicked position
    	//socket.broadcast.to(socket.room).emit('highlightSelectedPiece', convertPosition(position));
    	socket.emit('showMovements', moves);
    
	});

	socket.on('hideDrop', function() {
		socket.emit('clearBoard');
    });

	socket.on('drop', function(id, newPosition){
    	var room = Room.list[socket.room];
    	var piece, pieceCounterpart;

    	if(room.turn == "black"){
    		piece = findObjectByTripleKey(room.player1Pieces, 'property', 'id', 'captured', '', id, true);
    		pieceCounterpart = findObjectByTripleKey(room.player2Pieces, 'property', 'id', 'captured', '', id, true);
    	} else {
    		piece = findObjectByTripleKey(room.player2Pieces, 'property', 'id', 'captured', '', id, true);
    		pieceCounterpart = findObjectByTripleKey(room.player1Pieces, 'property', 'id', 'captured', '', id, true);
    	}

    	piece.drop("player1");
    	pieceCounterpart.drop("player2");
    	piece.newPosition(newPosition);
    	pieceCounterpart.newPosition(convertPosition(newPosition));

    	socket.emit('updatePlayerView', piece, id, newPosition, true);
    	socket.broadcast.to(socket.room).emit('updateOpponentView', piece, id, convertPosition(newPosition), true);

    	socket.emit('clearBoard');

    	updateTurns(socket);
	});
});

/** PAGES FUNCTIONS */

// welcome the new player

function welcome(socket) {
  socket.emit('displayPage', login); // send to user the login page
}

//-----------------------------------------------------------------//

// sign in into the application
function signIn(socket, playerName) {

    socket.uniqueId = Math.random(); // generate a random socket id

    Player.onConnect(socket, playerName); // call the on connect function

}

//-----------------------------------------------------------------//

// show the main page of the application
function showMainPage (socket) {

	io.sockets.connected[socket].emit('displayPage', page); // send user to the main page
	io.sockets.connected[socket].join(mainRoom); // make the user join the main room

    io.in(mainRoom).emit('connectedUsers', Player.list); // send to all connected users the updated users list
    io.in(mainRoom).emit('rooms', Room.list); // send to the user the room list

}

//-----------------------------------------------------------------//

// logout from the application
Player.onDisconnect = function (socket) {
	var player = Player.list[socket.uniqueId]; // get the player from the player list

	if(player.insideRoom == true && player.roomCreated == true) { // if the player had created a room and was inside it, destroy the room
		destroy(socket, true);
	} else if(player.insideRoom == true){ // if the player was inside a room, exit from it
		quit(socket, true);
	}
  
	delete Player.list[socket.uniqueId]; // remove the player from the player list
  
	io.in(mainRoom).emit('connectedUsers', Player.list); 
	io.in(mainRoom).emit('rooms', Room.list);
  
	console.log(player.name + " has disconnected");
}

//-----------------------------------------------------------------//

// update turns
function updateTurns(socket) {

  var room = Room.list[socket.room]; // get the room from the room list

  if (room.turn == "white") {
    room.updateTurn("black"); // set room turn to black
  } else {
    room.updateTurn("white"); // set room turn to white
  }
  socket.emit('turn', ""); // inform the player that moved the piece that is not his turn anymore
  socket.broadcast.to(socket.room).emit('turn', "your turn"); // inform the opponent that it is his turn
}

//-----------------------------------------------------------------//

// create new room
function createNewRoom(socket, player, roomName) {
	var room = Room.list[roomName];
	if(room == undefined || room == null){

		var newRoom = Room(socket.uniqueId, roomName); // create the new room instance

    player.createRoom(); // set player insideroom and roomcreated to true
		player.setFaction("black"); // set player faction to black

		bringPlayerToRoom(socket, roomName);
    	
		socket.emit("displayPieces", newRoom.player1Pieces);
		
    	socket.emit('showButton', "<button id=\"quitMatchButton\" class=\"destroy\">Quit</button>");
  } else {
		// if the room already exists, notify the player.
    	socket.emit("alert", "The room \"" + roomName + "\" already exists. Please choose another name.");
    }
}

//-----------------------------------------------------------------//

// join new room
function joinNewRoom(socket, player, roomName) {
	var room = Room.list[roomName];

	if(room != undefined || room != null){

    	player.joinRoom();
		player.setFaction("white");
		
		bringPlayerToRoom(socket, roomName);

		room.setOpponent(player);

		socket.emit('updateTopBar', 'opponent', room.player1.name);
		socket.broadcast.to(socket.room).emit('updateTopBar', 'opponent', player.name);
    	
		socket.emit("displayPieces", room.player2Pieces);
		
    	socket.emit('showButton', "<button id=\"startMatchButton\">Start Match</button><button id=\"quitMatchButton\">Quit</button>");
    } else {
		// if the room already exists, notify the player.
    	socket.emit("alert", "The room: " + roomName + " doesn't exist or is full. Please choose another room.");
    }
}

//-----------------------------------------------------------------//

// bring the player to the room
function bringPlayerToRoom(socket, roomName) {
	io.in(mainRoom).emit('connectedUsers', Player.list); // send to all players in the main room the updated player list
	io.in(mainRoom).emit("rooms", Room.list, socket.room); // send to all players in the main room the updated room list

	socket.leave(mainRoom); // leave the main room
		
	socket.room = roomName; // set the socket room to room name
	socket.join(socket.room); // make the player join the new room
	socket.emit("displayPage", board); // send the user to the game room
	io.in(socket.room).emit("updateTopBar", "self", "You"); // update the top bar to "you"
}

//-----------------------------------------------------------------//
function destroy(socket, disconnecting) {
	var room = Room.list[socket.room];
	
	if(room.connectedUsers == 2) {
		Player.list[room.player2.uniqueId].abandonRoom(); // update insideRoom variable to false
	
		socket.broadcast.to(socket.room).emit("alert", roomDestroyedMessage); // notify the opponent that the room has been destroyed
		showMainPage(room.player2.id);
	}

	Player.list[room.player1.uniqueId].destroyRoom();
	
	room.destroyRoom(socket.room); 
  
	socket.leave(socket.room); // leave the current room
	if(disconnecting == false){
		showMainPage(socket.id); // send user to the main page
	}
}

function quit(socket) {
	var room = Room.list[socket.room];

	io.in(socket.room).emit("clearAll");

	socket.broadcast.to(socket.room).emit("showButton", "<button id=\"destroyRoomButton\" class=\"destroy\">Quit</button>");
	socket.broadcast.to(socket.room).emit("updateTopBar", "opponent", "Waiting for opponent...");
	socket.broadcast.to(socket.room).emit("roomAbandoned");
	
	Player.list[room.player2.uniqueId].abandonRoom();
  
	room.abandonRoom();
	
	if (room.turn == "white") {
	  room.updateTurn("black");
	}
  
	socket.broadcast.to(socket.room).emit("displayPieces", Room.list[socket.room].player1Pieces);

	socket.leave(socket.room);
	if(disconnecting == false){
		showMainPage(socket.id); // send user to the main page
	}
}

function surrender(socket) {
	socket.broadcast.to(socket.room).emit('turn', "Your opponent did surrender");
	socket.emit('endGame', "<div class='modal'><div class='modal-box'><span>You lost</span><ul><li><button class='rematch' value='Rematch'>Rematch</button></li><li><button value='Quit' class='quit'>Quit</button></li></ul></div></div>");
	socket.broadcast.to(socket.room).emit('endGame', "<div class='modal'><div class='modal-box'><span>You won</span><div class='end'><img src='/images/layout/crown.svg'></div><button value='Close' class='close'>Close</button></div></div>");
}

// end game when the king has been eaten
function gameEnd(socket) {
	socket.broadcast.to(socket.room).emit('endGame', "<div class='modal'><div class='modal-box'><span>You lost</span><ul><li><button class='rematch' value='Rematch'>Rematch</button></li><li><button value='Quit' class='quit'>Quit</button></li></ul></div></div>");
	socket.emit('endGame', "<div class='modal'><div class='modal-box'><span>You won</span><div class='end'><img src='/images/layout/crown.svg'></div><button value='Close' class='close'>Close</button></div></div>");
}

//-----------------------------------------------------------------//

/** MOVEMENTS FUNCTIONS */
function possibleMoves(pieces, piecePosition) {

	// get the piece in a specific position that has not been captured
	var piece = findObjectByDoubleKey(pieces, 'currentPosition', 'captured', piecePosition, false);
	var movements = []; // contains the movements where the pice can move

	moveSet = piece.simpleMoves; // allowed moves of the selected piece

	if(piece.promoted == true) { // if the piece is promoted, use the allowed moves of the promoted piece
		moveSet = piece.upgradedMoves;
	}

	for (var x = 0; x < moveSet.length; x++) {
		var move = moveSet[x];
		switch (move) {
			case 'diagUpRight':
				movements.push(setMovement(pieces, piece, 1, 1, false)); // move along the right up diagonal by one block
        	break;
    		case 'right':
        		movements.push(setMovement(pieces, piece, 0, 1, false)); // move to the right by one block
        	break;
    		case 'diagDownRight':
        		movements.push(setMovement(pieces, piece, -1, 1, false)); // move along the right down diagonal by one block
        	break;
    		case 'down':
        		movements.push(setMovement(pieces, piece, -1, 0, false)); // move down by one block
    		break;
    		case 'diagDownLeft':
    			movements.push(setMovement(pieces, piece, -1, -1, false)); // move along the left down diagonal by one block
    		break;
    		case 'left':
    			movements.push(setMovement(pieces, piece, 0, -1, false)); // move to the left by one block
        	break;
    		case 'diagUpLeft':
    			movements.push(setMovement(pieces, piece, 1, -1, false)); // move along the left up diagonal by one block
        	break;
    		case 'upUp':
        		Array.prototype.push.apply(movements, setMovement(pieces, piece, 1, 0, true));
        	break;
    		case 'rightRight':
        		Array.prototype.push.apply(movements, setMovement(pieces, piece, 0, 1, true));
        	break;
    		case 'downDown':
        		Array.prototype.push.apply(movements, setMovement(pieces, piece, -1, 0, true));
        	break;
    		case 'leftLeft':
        		Array.prototype.push.apply(movements, setMovement(pieces, piece, 0, -1, true));
        	break;
    		case 'leftUp':
        		movements.push(setMovement(pieces, piece, 2, -1, false));
        	break;
    		case 'rightUp':
        		movements.push(setMovement(pieces, piece, 2, 1, false));
        	break;
    		case 'diagDiagUpLeft':
        		Array.prototype.push.apply(movements, setMovement(pieces, piece, 1, -1, true));
        	break;
    		case 'diagDiagUpRight':
        		Array.prototype.push.apply(movements, setMovement(pieces, piece, 1, 1, true));
        	break;
    		case 'diagDiagDownLeft':
    			Array.prototype.push.apply(movements, setMovement(pieces, piece, -1, -1, true));
        	break;
    		case 'diagDiagDownRight':
        		Array.prototype.push.apply(movements, setMovement(pieces, piece, -1, 1, true));
        	break;
    		default:
        		movements.push(setMovement(pieces, piece, 1, 0, false));
    	}
	}

  movements.filter(Boolean);

  return movements;
}

function setMovement (pieces, piece, y, x, special) {

  var coordinate = piece.currentPosition.split("-"); // get y-x coordinates of the piece

  var r = boardCoordinates.indexOf(coordinate[0]); // r => y position in the grid
  var c = parseInt(coordinate[1]); // c => x position in the grid

  var newPosition;
  var positions = [];
  var occupied;

  if(special) {
    if (y == -1 && x == 0) { // go down until you find an obstacle
      for (; r >= 0; r--) {
        newPosition = convertToNewPos(r, c);
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else if (y == 0 && x == 1) {
      for (; c < 10; c++) {
        newPosition = convertToNewPos(r, c);
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else if (y == 0 && x == -1) {
      for (; c >= 0; c--) {
        newPosition = convertToNewPos(r, c);
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else if (y == 1 && x == 0) {
      for (; r < 9; r++) {
        newPosition = convertToNewPos(r, c);
        
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else if (y == -1 && x == 1) {
      for (; r >= 0, c < 10; r--, c++) {
        newPosition = convertToNewPos(r, c);
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else if (y == -1 && x == -1) {
      for (; r >= 0, c > 0; r--, c--) {
        newPosition = convertToNewPos(r, c);
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else if (y == 1 && x == -1) {
      for (; r < 9, c > 0; r++, c--) {
        newPosition = convertToNewPos(r, c);
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    } else if (y == 1 && x == 1) {
      for (; r < 9, c < 10; r++, c++) {
        newPosition = convertToNewPos(r, c);
        if(newPosition != piece.currentPosition) {
          occupied = checkIfOccupied(pieces, newPosition);
          if (occupied != true) {
            positions.push(newPosition);
            if (occupied == "eat") {
              break;
            }
          } else {
            break;
          }
        }
      }
    }

    //console.log(positions);
    return positions;

  } else {
    r += y;
    c += x;

    if(r < 9 && r > -1 && c > 0 && c < 10) {
      newPosition = convertToNewPos(r, c);

      if(checkIfOccupied(pieces, newPosition) != true) {
        return newPosition;
      }

    }
  }
}

function convertToNewPos(y, x) {
  var r = boardCoordinates[y];

  var newPos = r + "-" + x;
  return newPos;
}

function checkIfOccupied(pieces, newPosition) {
  var piece = findObjectByDoubleKey(pieces, 'currentPosition', 'captured', newPosition, false);

  if(piece) {
    if(piece.property == "player2") {
      return "eat";
    }
    return true;
  }
  return false;
}
/** END OF MOVEMENTS FUNCTIONS */

// upgrade function

function upgradePiece(piece, opponentPiece, position, socket, choice) {
	var room = Room.list[socket.room];

	if(choice == true) {
    	if (room.turn == "black") {
    		// search my selected piece inside my pieces
    		piece = findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player1', position, false);
    		// search my selected piece inside opponent pieces
    		opponentPiece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player2', convertPosition(position), false);
    	} else {
    		// search my selected piece inside my pieces
    		piece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player1', position, false);
    		// search my selected piece inside opponent pieces
    		opponentPiece = findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player2', convertPosition(position), false);
    	}

    	piece.promote();
    	opponentPiece.promote();

    	socket.emit('updatePlayerView', piece, piece.currentPosition, piece.currentPosition, false);
		socket.broadcast.to(socket.room).emit('updateOpponentView', piece, opponentPiece.currentPosition, opponentPiece.currentPosition, false);

	}

	updateTurns(socket);
}

function possibleDropPositions(piece, pieces) {
  var position;
  var possibleDropsPositions = Array();
  var maxRow = 9;
  var upgraded = false;
  if(piece.name == "Pawn" || piece.name == "Lance") {
    maxRow = 8;
  } else if (piece.name == "Knight") {
    maxRow = 7;
  }

  var myPiece;
  
  for(var c = 1; c < 10; c++) {
    upgraded = true;
    if(piece.name == "Pawn") {
      var found = findElementByMultipleKey(pieces, 'currentPosition', 'name', 'captured', 'property', c, 'Pawn', false, 'player1');
      if(found != null) {
        
        for(var i in found){
          if(found[i].promoted == true) {
            upgraded = true;
          } else {
            upgraded = false;
          }
        }
      }
    }
    for(var r = 0; r < maxRow; r++) {
      position = convertToNewPos(r, c);
      var coordinate = position.split("-");
      var col = coordinate[0];

      if(upgraded == false) {
        break;
      }

      myPiece = findObjectByDoubleKey(pieces, 'currentPosition', 'captured', position, false);
      if(myPiece == null) {
        possibleDropsPositions.push(position);
      }
    }
  }

  return possibleDropsPositions;
}


/** GENERAL PURPOSE FUNCTIONS */
function findElementByTripleKey(array, key, key2, key3, value, value2, value3) {
  
  for (var i = 0; i < array.length; i++) {
    //console.log("Position: " + array[i][key] + " - Name: " + array[i][key2] + " - Captured: " + array[i][key3]);
    if (array[i][key].indexOf(value) > -1 && array[i][key2] === value2 && array[i][key3] === value3) {
      return array[i];
    }
    
  }
  
  return null;
}

function findObjectByDoubleKey(array, key, key2, value, value2) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value && array[i][key2] === value2) {
      return array[i];
    }
  }
  return null;
}

function findObjectByTripleKey(array, key, key2, key3, value, value2, value3) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value && array[i][key2] === value2 && array[i][key3] === value3) {
      return array[i];
    }
  }
  return null;
}

function findElementByMultipleKey(array, key, key2, key3, key4, value, value2, value3, value4) {
  var match = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i][key].indexOf(value) > -1 && array[i][key2] === value2 && array[i][key3] === value3 && array[i][key4] === value4) {
      match.push(array[i]);
    }
  }

  if(match.length > 0){
    return match;
  }
  return null;
}

function convertPosition(position) {
  var coordinate = position.split("-");

  var r = boardCoordinates[8 - boardCoordinates.indexOf(coordinate[0])];
  var c = 10 - parseInt(coordinate[1]);

  var newPosition = r + "-" + c;
  return newPosition;
}

function extractCoordinates(position) {
  var coordinate = position.split("-");

  var r = boardCoordinates.indexOf(coordinate[0]);
  return r;
}

/** END OF GENERAL PURPOSE FUNCTIONS */

// create the pieces for the player
function createPieces() {
  var pieces = [];

  pieces.push(new Piece("1", "Pawn", true, "player1", "C-1", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("2", "Pawn", true, "player1", "C-2", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("3", "Pawn", true, "player1", "C-3", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("4", "Pawn", true, "player1", "C-4", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("5", "Pawn", true, "player1", "C-5", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("6", "Pawn", true, "player1", "C-6", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("7", "Pawn", true, "player1", "C-7", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("8", "Pawn", true, "player1", "C-8", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("9", "Pawn", true, "player1", "C-9", "PromotedPawn", movesPedina, movesGenOro));

  pieces.push(new Piece("10", "Bishop", true, "player1", "B-2", "PromotedBishop", movesAlfiere, movesAlfierePromosso));
  pieces.push(new Piece("11", "Rook", true, "player1", "B-8", "PromotedRook", movesTorre, movesTorrePromossa));
  pieces.push(new Piece("12", "Lance", true, "player1", "A-1", "PromotedLance", movesLanciere, movesGenOro));
  pieces.push(new Piece("13", "Knight", true, "player1", "A-2", "PromotedKnight", movesCavallo, movesGenOro));
  pieces.push(new Piece("14", "SilverGeneral", true, "player1", "A-3", "PromotedSilverGeneral", movesGenArg, movesGenOro));
  pieces.push(new Piece("15", "GoldGeneral", false, "player1", "A-4", "", movesGenOro, ""));
  pieces.push(new Piece("16", "King", false, "player1", "A-5", "", movesRe, ""));
  pieces.push(new Piece("17", "GoldGeneral", false, "player1", "A-6", "", movesGenOro, ""));
  pieces.push(new Piece("18", "SilverGeneral", true, "player1", "A-7", "PromotedSilverGeneral", movesGenArg, movesGenOro));
  pieces.push(new Piece("19", "Knight", true, "player1", "A-8", "PromotedKnight", movesCavallo, movesGenOro));
  pieces.push(new Piece("20", "Lance", true, "player1", "A-9", "PromotedLance", movesLanciere, movesGenOro));

  pieces.push(new Piece("1", "Pawn", true, "player2", "G-9", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("2", "Pawn", true, "player2", "G-8", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("3", "Pawn", true, "player2", "G-7", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("4", "Pawn", true, "player2", "G-6", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("5", "Pawn", true, "player2", "G-5", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("6", "Pawn", true, "player2", "G-4", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("7", "Pawn", true, "player2", "G-3", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("8", "Pawn", true, "player2", "G-2", "PromotedPawn", movesPedina, movesGenOro));
  pieces.push(new Piece("9", "Pawn", true, "player2", "G-1", "PromotedPawn", movesPedina, movesGenOro));

  pieces.push(new Piece("10", "Bishop", true, "player2", "H-8", "PromotedBishop", movesAlfiere, movesAlfierePromosso));
  pieces.push(new Piece("11", "Rook", true, "player2", "H-2", "PromotedRook", movesTorre, movesTorrePromossa));
  pieces.push(new Piece("12", "Lance", true, "player2", "I-9", "PromotedLance", movesLanciere, movesGenOro));
  pieces.push(new Piece("13", "Knight", true, "player2", "I-8", "PromotedKnight", movesCavallo, movesGenOro));
  pieces.push(new Piece("14", "SilverGeneral", true, "player2", "I-7", "PromotedSilverGeneral", movesGenArg, movesGenOro));
  pieces.push(new Piece("15", "GoldGeneral", false, "player2", "I-6", "", movesGenOro, ""));
  pieces.push(new Piece("16", "King", false, "player2", "I-5", "", movesRe, ""));
  pieces.push(new Piece("17", "GoldGeneral", false, "player2", "I-4", "", movesGenOro, ""));
  pieces.push(new Piece("18", "SilverGeneral", true, "player2", "I-3", "PromotedSilverGeneral", movesGenArg, movesGenOro));
  pieces.push(new Piece("19", "Knight", true, "player2", "I-2", "PromotedKnight", movesCavallo, movesGenOro));
  pieces.push(new Piece("20", "Lance", true, "player2", "I-1", "PromotedLance", movesLanciere, movesGenOro));

  return pieces;
}