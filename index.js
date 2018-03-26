// Dependencies
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 5000;
const http = require('http');

var app = require('express')();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/pages/index.html');
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

//GAME CONSTANTS
const mainRoom = "MainRoom";

const board = "<div class='left-area'>" +
"<ul id='capturedBoard' class='opponent'></ul>" +
"</div>" +
"<table id='board'>" +
"<tbody>" +
    "<tr>" +
        "<td data-name='I-1'></td>" +
        "<td data-name='I-2'></td>" +
        "<td data-name='I-3'></td>" +
        "<td data-name='I-4'></td>" +
        "<td data-name='I-5'></td>" +
        "<td data-name='I-6'></td>" +
        "<td data-name='I-7'></td>" +
        "<td data-name='I-8'></td>" +
        "<td data-name='I-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='H-1'></td>" +
        "<td data-name='H-2'></td>" +
        "<td data-name='H-3'></td>" +
        "<td data-name='H-4'></td>" +
        "<td data-name='H-5'></td>" +
        "<td data-name='H-6'></td>" +
        "<td data-name='H-7'></td>" +
        "<td data-name='H-8'></td>" +
        "<td data-name='H-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='G-1'></td>" +
        "<td data-name='G-2'></td>" +
        "<td data-name='G-3'></td>" +
        "<td data-name='G-4'></td>" +
        "<td data-name='G-5'></td>" +
        "<td data-name='G-6'></td>" +
        "<td data-name='G-7'></td>" +
        "<td data-name='G-8'></td>" +
        "<td data-name='G-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='F-1'></td>" +
        "<td data-name='F-2'></td>" +
        "<td data-name='F-3'></td>" +
        "<td data-name='F-4'></td>" +
        "<td data-name='F-5'></td>" +
        "<td data-name='F-6'></td>" +
        "<td data-name='F-7'></td>" +
        "<td data-name='F-8'></td>" +
        "<td data-name='F-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='E-1'></td>" +
        "<td data-name='E-2'></td>" +
        "<td data-name='E-3'></td>" +
        "<td data-name='E-4'></td>" +
        "<td data-name='E-5'></td>" +
        "<td data-name='E-6'></td>" +
        "<td data-name='E-7'></td>" +
        "<td data-name='E-8'></td>" +
        "<td data-name='E-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='D-1'></td>" +
        "<td data-name='D-2'></td>" +
        "<td data-name='D-3'></td>" +
        "<td data-name='D-4'></td>" +
        "<td data-name='D-5'></td>" +
        "<td data-name='D-6'></td>" +
        "<td data-name='D-7'></td>" +
        "<td data-name='D-8'></td>" +
        "<td data-name='D-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='C-1'></td>" +
        "<td data-name='C-2'></td>" +
        "<td data-name='C-3'></td>" +
        "<td data-name='C-4'></td>" +
        "<td data-name='C-5'></td>" +
        "<td data-name='C-6'></td>" +
        "<td data-name='C-7'></td>" +
        "<td data-name='C-8'></td>" +
        "<td data-name='C-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='B-1'></td>" +
        "<td data-name='B-2'></td>" +
        "<td data-name='B-3'></td>" +
        "<td data-name='B-4'></td>" +
        "<td data-name='B-5'></td>" +
        "<td data-name='B-6'></td>" +
        "<td data-name='B-7'></td>" +
        "<td data-name='B-8'></td>" +
        "<td data-name='B-9'></td>" +
    "</tr>" +
    "<tr>" +
        "<td data-name='A-1'></td>" +
        "<td data-name='A-2'></td>" +
        "<td data-name='A-3'></td>" +
        "<td data-name='A-4'></td>" +
        "<td data-name='A-5'></td>" +
        "<td data-name='A-6'></td>" +
        "<td data-name='A-7'></td>" +
        "<td data-name='A-8'></td>" +
        "<td data-name='A-9'></td>" +
    "</tr>" +
"</tbody>" +
"</table>" +
"<div class='right-area'>" +
"<ul id='capturedBoard' class='own'></ul>" +
"</div>" +
"<button id='startMatchButton'>Start Match</button>";

const page = "" +
"<div class='connectedUsers'><span>Connected Users</span>" +
"<ul>" +
"</ul>" +
"</div>" +
"<div class='createRoom'>" +
  "<ul>" +
  "<li>Rules</li>" +
  "<li><input type='text' class='roomName' placeholder='Room Name' minlength='4' maxlength='16'>" +
  "<button id='createRoomButton'>Create Room</button></li>" +
  "</ul>" +
"</div>" +
"<div class='rooms'>" +
"<ul></ul>" +
"</div>";

const login = "" +
"<div class='login'>" +
  "<input type='text' placeholder='Username' minlength='4' maxlength='16'>" +
  "<button id='loginButton'>Login</button>" +
"</div>";

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

  self.destroyRoom = function (name) {
    delete Room.list[name];
  }

  self.setOpponent = function(value) {
    self.player2 = value;
    self.connectedUsers = 2;
    self.setPlayersPieces();
  }

  self.abandonRoom = function() {
    self.player2 = "";
    self.connectedUsers = 1;
    self.setPlayersPieces();
  }

  self.setPlayersPieces = function() {
    self.player1Pieces = createPieces();
    self.player2Pieces = createPieces();
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
    socket.broadcast.to(socket.room).emit('askToStart', "Your opponent wants to start the match");
  } else if(Room.list[socket.room].wantToStart == 1) {
    socket.broadcast.to(socket.room).emit('askToStart', "Your opponent accepted your match request");
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
  
  socket.on('createRoom', function(roomName){ // create room

    player.createRoom();

    io.in(mainRoom).emit('connectedUsers', Player.list);
    socket.leave(mainRoom);

    player.setFaction("black");
    var room = Room(socket.uniqueId, roomName);

    socket.room = roomName;
    socket.join(socket.room);
    socket.broadcast.emit('rooms', Room.list, socket.room);
    socket.emit('displayPage', board); // send to user the main page

    socket.emit('displayPieces', room.player1Pieces);
  });

  socket.on('joinRoom', function(roomName){ // join room
    //console.log(io.sockets.adapter.rooms[roomName].length);
    socket.room = roomName;
    socket.join(socket.room);
    player.joinRoom();
    player.setFaction("red");

    io.in(mainRoom).emit('connectedUsers', Player.list);
    socket.leave(mainRoom);

    Room.list[socket.room].setOpponent(player);
    //console.log(socket.room);
    socket.broadcast.emit('rooms', Room.list, socket.room);
    socket.broadcast.to(socket.room).emit('joined', player.name + " has joined the room");

    socket.emit('displayPage', board); // send to user the main page
    socket.emit('displayPieces', Room.list[roomName].player2Pieces);
  });

  socket.on('matchStart', function() {
    //console.log(Room.list[socket.room]);
    if (Room.list[socket.room].player1 != undefined && Room.list[socket.room].player2 != undefined) {
      Room.playerTurn(socket);
    }
  });

}

Player.onDisconnect = function (socket) {
  delete Player.list[socket.uniqueId];
  delete Room.list[socket.room];
  io.in(mainRoom).emit('connectedUsers', Player.list);
  io.in(mainRoom).emit('rooms', Room.list);
  socket.leave(socket.room);
  socket.leave(mainRoom);
  console.log(socket.id + " has disconnected");
}

io.sockets.on('connection', function (socket) {
  socket.emit('displayPage', login); // send to user the login page

  socket.on('login', function(playerName){
    socket.emit('displayPage', page); // send to user the main page
    socket.join(mainRoom);
    socket.uniqueId = Math.random(); // generate a random socket id
    SOCKET_LIST[socket.uniqueId] = socket; // insert into socket list the new player socket

    Player.onConnect(socket, playerName); // call the on connect function
    
    io.in(mainRoom).emit('connectedUsers', Player.list);

    socket.emit('rooms', Room.list);
    
    // on user disconnect, remove player from socket list,
    // remove it from player list and leave the main room
    socket.on('disconnect', function () { 
      delete SOCKET_LIST[socket.uniqueId];
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

    } else if (room.turn == "red" && findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player1', selected, false)) {

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

        if(eatedPiece.name == "Re"){
          endGame = true;
        }

        // search for the opponent clicked piece into my pieces
        oppponentEatedPiece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player1', convertPosition(position), false);

        eatedPiece.capture("");
        oppponentEatedPiece.capture("");

        socket.emit('addPieceToDrops', eatedPiece); // add captured piece to your drops
        socket.broadcast.to(socket.room).emit('addOpponentPieceToDrops', eatedPiece); // show captured piece to opponent drops
      }
      
    } else if (room.turn == "red") {

      piece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player1', selectedPiece, false);
      opponentPiece = findObjectByTripleKey(room.player1Pieces, 'property', 'currentPosition', 'captured', 'player2', convertPosition(selectedPiece), false);

      // check if i clicked onto an opponent piece
      eatedPiece = findObjectByTripleKey(room.player2Pieces, 'property', 'currentPosition', 'captured', 'player2', position, false);
      if(eatedPiece) {

        if(eatedPiece.name == "Re"){
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
      if (((piece.pieceName == "Pedina" || piece.pieceName == "Lanciere") && extractCoordinates(position) == 8) ||
       (piece.pieceName == "Cavallo" && extractCoordinates(position) >= 7)) {
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

    } else if (room.turn == "red") {
      
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

function updateTurns(socket) {
  var room = Room.list[socket.room];
  if (room.turn == "red") {
    room.updateTurn("black");
  } else {
    room.updateTurn("red");
  }
  socket.emit('turn', "");
  socket.broadcast.to(socket.room).emit('turn', "your turn");
}

function gameEnd(socket) {
  socket.emit('endGame', 'won', 'crown');
  socket.broadcast.to(socket.room).emit('endGame', 'lost', '');
}

/** MOVEMENTS FUNCTIONS */
function possibleMoves(pieces, piecePosition) {
  var piece = findObjectByDoubleKey(pieces, 'currentPosition', 'captured', piecePosition, false);
  var movements = [];

  moveSet = piece.simpleMoves;
  if(piece.promoted == true) {
    moveSet = piece.upgradedMoves;
  }
  for (var x = 0; x < moveSet.length; x++) {
    var move = moveSet[x];
    switch (move) {
      case 'diagUpRight':
        movements.push(setMovement(pieces, piece, 1, 1, false));
        break;
      case 'right':
        movements.push(setMovement(pieces, piece, 0, 1, false));
        break;
      case 'diagDownRight':
        movements.push(setMovement(pieces, piece, -1, 1, false));
        break;
      case 'down':
        movements.push(setMovement(pieces, piece, -1, 0, false));
        break;
      case 'diagDownLeft':
        movements.push(setMovement(pieces, piece, -1, -1, false));
        break;
      case 'left':
        movements.push(setMovement(pieces, piece, 0, -1, false));
        break;
      case 'diagUpLeft':
        movements.push(setMovement(pieces, piece, 1, -1, false));
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
  if(piece.name == "Pedina" || piece.name == "Lanciere") {
    maxRow = 8;
  } else if (piece.name == "Cavallo") {
    maxRow = 7;
  }

  var myPiece;
  
  for(var c = 1; c < 10; c++) {
    for(var r = 0; r < maxRow; r++) {
      position = convertToNewPos(r, c);
      var coordinate = position.split("-");
      var col = coordinate[0];
      if(piece.name == "Pedina") {
        if(findElementByTripleKey(pieces, 'currentPosition', 'name', 'captured', c, 'Pedina', false) != null) {
          break;
        }
      }
      myPiece = findObjectByDoubleKey(pieces, 'currentPosition', 'captured', position, false);
      if(myPiece == null && findObjectByDoubleKey(pieces, 'currentPosition', 'captured', position, false) == null) {
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


function createPieces() {
  var pieces = [];

  pieces.push(new Piece("1", "Pedina", true, "player1", "C-1", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("2", "Pedina", true, "player1", "C-2", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("3", "Pedina", true, "player1", "C-3", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("4", "Pedina", true, "player1", "C-4", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("5", "Pedina", true, "player1", "C-5", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("6", "Pedina", true, "player1", "C-6", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("7", "Pedina", true, "player1", "C-7", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("8", "Pedina", true, "player1", "C-8", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("9", "Pedina", true, "player1", "C-9", "PedinaPromossa", movesPedina, movesGenOro));

  pieces.push(new Piece("10", "Alfiere", true, "player1", "B-2", "AlfierePromosso", movesAlfiere, movesAlfierePromosso));
  pieces.push(new Piece("11", "Torre", true, "player1", "B-8", "TorrePromossa", movesTorre, movesTorrePromossa));
  pieces.push(new Piece("12", "Lanciere", true, "player1", "A-1", "LancierePromosso", movesLanciere, movesGenOro));
  pieces.push(new Piece("13", "Cavallo", true, "player1", "A-2", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces.push(new Piece("14", "GenArg", true, "player1", "A-3", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces.push(new Piece("15", "GenOro", false, "player1", "A-4", "", movesGenOro, ""));
  pieces.push(new Piece("16", "Re", false, "player1", "A-5", "", movesRe, ""));
  pieces.push(new Piece("17", "GenOro", false, "player1", "A-6", "", movesGenOro, ""));
  pieces.push(new Piece("18", "GenArg", true, "player1", "A-7", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces.push(new Piece("19", "Cavallo", true, "player1", "A-8", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces.push(new Piece("20", "Lanciere", true, "player1", "A-9", "LancierePromosso", movesLanciere, movesGenOro));

  pieces.push(new Piece("1", "Pedina", true, "player2", "G-9", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("2", "Pedina", true, "player2", "G-8", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("3", "Pedina", true, "player2", "G-7", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("4", "Pedina", true, "player2", "G-6", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("5", "Pedina", true, "player2", "G-5", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("6", "Pedina", true, "player2", "G-4", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("7", "Pedina", true, "player2", "G-3", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("8", "Pedina", true, "player2", "G-2", "PedinaPromossa", movesPedina, movesGenOro));
  pieces.push(new Piece("9", "Pedina", true, "player2", "G-1", "PedinaPromossa", movesPedina, movesGenOro));

  pieces.push(new Piece("10", "Alfiere", true, "player2", "H-8", "AlfierePromosso", movesAlfiere, movesAlfierePromosso));
  pieces.push(new Piece("11", "Torre", true, "player2", "H-2", "TorrePromossa", movesTorre, movesTorrePromossa));
  pieces.push(new Piece("12", "Lanciere", true, "player2", "I-9", "LancierePromosso", movesLanciere, movesGenOro));
  pieces.push(new Piece("13", "Cavallo", true, "player2", "I-8", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces.push(new Piece("14", "GenArg", true, "player2", "I-7", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces.push(new Piece("15", "GenOro", false, "player2", "I-6", "", movesGenOro, ""));
  pieces.push(new Piece("16", "Re", false, "player2", "I-5", "", movesRe, ""));
  pieces.push(new Piece("17", "GenOro", false, "player2", "I-4", "", movesGenOro, ""));
  pieces.push(new Piece("18", "GenArg", true, "player2", "I-3", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces.push(new Piece("19", "Cavallo", true, "player2", "I-2", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces.push(new Piece("20", "Lanciere", true, "player2", "I-1", "LancierePromosso", movesLanciere, movesGenOro));

  /*pieces[0].push(new Piece("1", "Pedina", true, "player1", "C-1", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("2", "Pedina", true, "player1", "C-2", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("3", "Pedina", true, "player1", "C-3", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("4", "Pedina", true, "player1", "C-4", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("5", "Pedina", true, "player1", "C-5", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("6", "Pedina", true, "player1", "C-6", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("7", "Pedina", true, "player1", "C-7", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("8", "Pedina", true, "player1", "C-8", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[0].push(new Piece("9", "Pedina", true, "player1", "C-9", "PedinaPromossa", movesPedina, movesGenOro));

  pieces[0].push(new Piece("10", "Alfiere", true, "player1", "B-2", "AlfierePromosso", movesAlfiere, movesAlfierePromosso));
  pieces[0].push(new Piece("11", "Torre", true, "player1", "B-8", "TorrePromossa", movesTorre, movesTorrePromossa));
  pieces[0].push(new Piece("12", "Lanciere", true, "player1", "A-1", "LancierePromosso", movesLanciere, movesGenOro));
  pieces[0].push(new Piece("13", "Cavallo", true, "player1", "A-2", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces[0].push(new Piece("14", "GenArg", true, "player1", "A-3", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces[0].push(new Piece("15", "GenOro", false, "player1", "A-4", "", movesGenOro, ""));
  pieces[0].push(new Piece("16", "Re", false, "player1", "A-5", "", movesRe, ""));
  pieces[0].push(new Piece("17", "GenOro", false, "player1", "A-6", "", movesGenOro, ""));
  pieces[0].push(new Piece("18", "GenArg", true, "player1", "A-7", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces[0].push(new Piece("19", "Cavallo", true, "player1", "A-8", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces[0].push(new Piece("20", "Lanciere", true, "player1", "A-9", "LancierePromosso", movesLanciere, movesGenOro));

  pieces[1].push(new Piece("1", "Pedina", true, "player2", "G-9", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("2", "Pedina", true, "player2", "G-8", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("3", "Pedina", true, "player2", "G-7", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("4", "Pedina", true, "player2", "G-6", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("5", "Pedina", true, "player2", "G-5", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("6", "Pedina", true, "player2", "G-4", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("7", "Pedina", true, "player2", "G-3", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("8", "Pedina", true, "player2", "G-2", "PedinaPromossa", movesPedina, movesGenOro));
  pieces[1].push(new Piece("9", "Pedina", true, "player2", "G-1", "PedinaPromossa", movesPedina, movesGenOro));

  pieces[1].push(new Piece("10", "Alfiere", true, "player2", "H-8", "AlfierePromosso", movesAlfiere, movesAlfierePromosso));
  pieces[1].push(new Piece("11", "Torre", true, "player2", "H-2", "TorrePromossa", movesTorre, movesTorrePromossa));
  pieces[1].push(new Piece("12", "Lanciere", true, "player2", "I-9", "LancierePromosso", movesLanciere, movesGenOro));
  pieces[1].push(new Piece("13", "Cavallo", true, "player2", "I-8", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces[1].push(new Piece("14", "GenArg", true, "player2", "I-7", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces[1].push(new Piece("15", "GenOro", false, "player2", "I-6", "", movesGenOro, ""));
  pieces[1].push(new Piece("16", "Re", false, "player2", "I-5", "", movesRe, ""));
  pieces[1].push(new Piece("17", "GenOro", false, "player2", "I-4", "", movesGenOro, ""));
  pieces[1].push(new Piece("18", "GenArg", true, "player2", "I-3", "GenArgPromosso", movesGenArg, movesGenOro));
  pieces[1].push(new Piece("19", "Cavallo", true, "player2", "I-2", "CavalloPromosso", movesCavallo, movesGenOro));
  pieces[1].push(new Piece("20", "Lanciere", true, "player2", "I-1", "LancierePromosso", movesLanciere, movesGenOro));

  /*player2Pieces[0].push(new Piece("1", "Pedina", true, "player2", "C-1", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("2", "Pedina", true, "player2", "C-2", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("3", "Pedina", true, "player2", "C-3", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("4", "Pedina", true, "player2", "C-4", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("5", "Pedina", true, "player2", "C-5", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("6", "Pedina", true, "player2", "C-6", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("7", "Pedina", true, "player2", "C-7", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("8", "Pedina", true, "player2", "C-8", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[0].push(new Piece("9", "Pedina", true, "player2", "C-9", "PedinaPromossa", movesPedina, movesGenOro));

  player1Pieces[0].push(new Piece("10", "Alfiere", true, "player2", "B-2", "AlfierePromosso", movesAlfiere, movesAlfierePromosso));
  player1Pieces[0].push(new Piece("11", "Torre", true, "player2", "B-8", "TorrePromossa", movesTorre, movesTorrePromossa));
  player1Pieces[0].push(new Piece("12", "Lanciere", true, "player2", "A-1", "LancierePromosso", movesLanciere, movesGenOro));
  player1Pieces[0].push(new Piece("13", "Cavallo", true, "player2", "A-2", "CavalloPromosso", movesCavallo, movesGenOro));
  player1Pieces[0].push(new Piece("14", "GenArg", true, "player2", "A-3", "GenArgPromosso", movesGenArg, movesGenOro));
  player1Pieces[0].push(new Piece("15", "GenOro", false, "player2", "A-4", "", movesGenOro, ""));
  player1Pieces[0].push(new Piece("16", "Re", false, "player2", "A-5", "", movesRe, ""));
  player1Pieces[0].push(new Piece("17", "GenOro", false, "player2", "A-6", "", movesGenOro, ""));
  player1Pieces[0].push(new Piece("18", "GenArg", true, "player2", "A-7", "GenArgPromosso", movesGenArg, movesGenOro));
  player1Pieces[0].push(new Piece("19", "Cavallo", true, "player2", "A-8", "CavalloPromosso", movesCavallo, movesGenOro));
  player1Pieces[0].push(new Piece("20", "Lanciere", true, "player2", "A-9", "LancierePromosso", movesLanciere, movesGenOro));

  player1Pieces[1].push(new Piece("1", "Pedina", true, "player2", "G-9", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("2", "Pedina", true, "player2", "G-8", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("3", "Pedina", true, "player2", "G-7", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("4", "Pedina", true, "player2", "G-6", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("5", "Pedina", true, "player2", "G-5", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("6", "Pedina", true, "player2", "G-4", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("7", "Pedina", true, "player2", "G-3", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("8", "Pedina", true, "player2", "G-2", "PedinaPromossa", movesPedina, movesGenOro));
  player1Pieces[1].push(new Piece("9", "Pedina", true, "player2", "G-1", "PedinaPromossa", movesPedina, movesGenOro));

  player1Pieces[1].push(new Piece("10", "Alfiere", true, "player2", "H-8", "AlfierePromosso", movesAlfiere, movesAlfierePromosso));
  player1Pieces[1].push(new Piece("11", "Torre", true, "player2", "H-2", "TorrePromossa", movesTorre, movesTorrePromossa));
  player1Pieces[1].push(new Piece("12", "Lanciere", true, "player2", "I-9", "LancierePromosso", movesLanciere, movesGenOro));
  player1Pieces[1].push(new Piece("13", "Cavallo", true, "player2", "I-8", "CavalloPromosso", movesCavallo, movesGenOro));
  player1Pieces[1].push(new Piece("14", "GenArg", true, "player2", "I-7", "GenArgPromosso", movesGenArg, movesGenOro));
  player1Pieces[1].push(new Piece("15", "GenOro", false, "player2", "I-6", "", movesGenOro, ""));
  player1Pieces[1].push(new Piece("16", "Re", false, "player2", "I-5", "", movesRe, ""));
  player1Pieces[1].push(new Piece("17", "GenOro", false, "player2", "I-4", "", movesGenOro, ""));
  player1Pieces[1].push(new Piece("18", "GenArg", true, "player2", "I-3", "GenArgPromosso", movesGenArg, movesGenOro));
  player1Pieces[1].push(new Piece("19", "Cavallo", true, "player2", "I-2", "CavalloPromosso", movesCavallo, movesGenOro));
  player1Pieces[1].push(new Piece("20", "Lanciere", true, "player2", "I-1", "LancierePromosso", movesLanciere, movesGenOro));*/

  return pieces;
}