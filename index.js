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
    pieceMoves: simpleMoves,
    pieceUpgradedMoves: upgradedMoves
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

  socket.on('showMovements', function (clickedPiece) {
    var room = Room.list[socket.room];
    if (room.turn == "black") {

      socket.emit('highlightSelectedPiece', clickedPiece);
      var piecePossibleMoves = showPossibleMoves(room.player1Pieces[0], room.player2Pieces[1], clickedPiece, socket);
      socket.emit('showSelectedPieceMovements', piecePossibleMoves);
      socket.broadcast.to(socket.room).emit('highlightSelectedPiece', convertPiecePosition(clickedPiece));

    } else if (room.turn == "red") {

      socket.emit('highlightSelectedPiece', clickedPiece);
      var piecePossibleMoves = showPossibleMoves(room.player2Pieces[0], room.player1Pieces[1], clickedPiece, socket);
      socket.emit('showSelectedPieceMovements', piecePossibleMoves);
      socket.broadcast.to(socket.room).emit('highlightSelectedPiece', convertPiecePosition(clickedPiece));

    }
  });

  socket.on('hideMovements', function (clickedPiece) {
    socket.emit('removeHighlightSelectedPiece', clickedPiece);
    socket.broadcast.to(socket.room).emit('removeHighlightSelectedPiece', convertPiecePosition(clickedPiece));
  });

  socket.on('showDropPositions', function(clickedPiece) {
    var room = Room.list[socket.room];
    var piece;
    if(socket.id == room.player1.id) {
      piece = findObjectByDoubleKey(room.player2Pieces[0], 'id', 'captured', clickedPiece, true);
      var possibleDrop = Room.showPossibleDropPositions(piece, room.player1Pieces[0], room.player2Pieces[1]);
    } else {
      piece = findObjectByDoubleKey(room.player1Pieces[0], 'id', 'captured', clickedPiece, true);
      var possibleDrop = Room.showPossibleDropPositions(piece, room.player2Pieces[0], room.player1Pieces[1]);
    }

    socket.emit('showSelectedPieceMovements', possibleDrop);
    
  });

  socket.on('hideDropPositions', function() {

    socket.emit('clearBoard');
    
  });

  //console.log(socket.id + ": " + playerName + " " + "has connected");
}

Room.showPossibleDropPositions = function(piece, ownPieces, opponentPieces) {
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
        if(findElementByTripleKey(ownPieces, 'currentPosition', 'name', 'captured', c, 'Pedina', false) != null) {
          break;
        }
      }
      myPiece = findObjectByDoubleKey(ownPieces, 'currentPosition', 'captured', position, false);
      if(myPiece == null && findObjectByDoubleKey(opponentPieces, 'currentPosition', 'captured', position, false) == null) {
        possibleDropsPositions.push(position);
      }
    }
  }

  return possibleDropsPositions;
}

function findElementByTripleKey(array, key, key2, key3, value, value2, value3) {
  for (var i = 0; i < array.length; i++) {
    //console.log("Position: " + array[i][key] + " - Name: " + array[i][key2] + " - Captured: " + array[i][key3]);
    if (array[i][key].indexOf(value) > -1 && array[i][key2] === value2 && array[i][key3] === value3) {
      return array[i];
    }
    
  }
  return null;
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

io.sockets.on('connect', function (socket) { // on user connect, display the login page
  
});

var pedina1, pedina2, pedina3, pedina4, pedina5, pedina6, pedina7, pedina8, pedina9, pedina10, pedina11, pedina12, pedina13, pedina14, pedina15, pedina16, pedina17, pedina18;
var alfiere, torre, alfiere1, torre1;
var lanciere1, lanciere2, lanciere3, lanciere4;
var cavallo1, cavallo2, cavallo3, cavallo4;
var genArg1, genArg2, genArg3, genArg4, genOro1, genOro2, genOro3, genOro4;
var re, re1;

var movesPedina = Array("up");
var movesLanciere = Array("upUp");
var movesAlfiere = Array("diagDiagUpRight", "diagDiagDownRight", "diagDiagDownLeft", "diagDiagUpLeft");
var movesTorre = Array("upUp", "rightRight", "downDown", "leftLeft");
var movesCavallo = Array("leftUp", "rightUp");
var movesGenArg = Array("up", "diagUpRight", "diagDownRight", "diagDownLeft", "diagUpLeft");
var movesGenOro = Array("up", "diagUpRight", "right", "down", "left", "diagUpLeft");
var movesRe = Array("up", "diagUpRight", "right", "diagDownRight", "down", "diagDownLeft", "left", "diagUpLeft");
var movesTorrePromossa = Array("upUp", "rightRight", "downDown", "leftLeft", "diagUpRight", "diagDownRight", "diagDownLeft", "diagUpLeft");
var movesAlfierePromosso = Array("diagDiagUpRight", "diagDiagDownRight", "diagDiagDownLeft", "diagDiagUpLeft", "up", "right", "down", "left");

var boardCoordinates = Array("A", "B", "C", "D", "E", "F", "G", "H", "I");

function convertPiecePosition(opponentPiecePosition) {
  var coordinate = opponentPiecePosition.split("-");

  var r = boardCoordinates[8 - boardCoordinates.indexOf(coordinate[0])];
  var c = 10 - parseInt(coordinate[1]);

  var piecePosition = r + "-" + c;
  return piecePosition;
}

function extractCoordinates(position) {
  var coordinate = position.split("-");

  var r = boardCoordinates.indexOf(coordinate[0]);
  return r;
}

io.on('connect', function (socket) {

  socket.on('dropToPosition', function(pieceId, newPosition){
    var room = Room.list[socket.room];
    var selectedPiece;
    if (room.turn == "black") {

      selectedPiece = room.player2Pieces[0][pieceId-1];

      selectedPiece.drop("Player1");
      room.player2Pieces[1][pieceId-1].drop("Player2");

      selectedPiece.newPosition(newPosition); // update your piece position
      room.player2Pieces[1][pieceId-1].newPosition(convertPiecePosition(newPosition));

    } else {
      selectedPiece = room.player1Pieces[0][pieceId-1];

      selectedPiece.drop("Player1");
      room.player1Pieces[1][pieceId-1].drop("Player2");

      selectedPiece.newPosition(newPosition); // update your piece position
      room.player1Pieces[1][pieceId-1].newPosition(convertPiecePosition(newPosition));
    }

    updateView(selectedPiece, pieceId, newPosition, socket, true);
    updateTurns(socket);
  });

  socket.on('moveToNewPosition', function (clickedPiece, clickedPosition) {
    var room = Room.list[socket.room];
    var selectedPiece;
    var selectedPieceCounterpart;
    var eatablePiece;

    var controlUpgrade = false;

    if (room.turn == "black") {
      selectedPiece = findObjectByDoubleKey(room.player1Pieces[0], 'currentPosition', 'captured', clickedPiece, false);
      if(selectedPiece == null) {
        selectedPiece = findObjectByDoubleKey(room.player2Pieces[0], 'currentPosition', 'captured', clickedPiece, false);
        selectedPieceCounterpart = findObjectByDoubleKey(room.player2Pieces[1], 'currentPosition', 'captured', convertPiecePosition(clickedPiece), false);
      } else {
        selectedPieceCounterpart = findObjectByDoubleKey(room.player1Pieces[1], 'currentPosition', 'captured', convertPiecePosition(clickedPiece), false);
      }
      eatedPiece = findObjectByDoubleKey(room.player2Pieces[1], 'currentPosition', 'captured', clickedPosition, false);
      //console.log(eatedPiece);
      if (eatedPiece) {

        room.player2Pieces[0][eatedPiece.id - 1].capture(""); // capture opponent piece
        eatedPiece.capture(""); // capture opponent piece

        socket.emit('addPieceToDrops', eatedPiece); // add captured piece to your drops

        socket.broadcast.to(socket.room).emit('addOpponentPieceToDrops', eatedPiece); // show captured piece to opponent drops

        if ((extractCoordinates(clickedPosition) >= 6 || extractCoordinates(selectedPiece.currentPosition) >= 6) && selectedPiece.promoted == false && selectedPiece.upgradable == true) {
          if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
            upgradePiece(selectedPiece, clickedPiece, clickedPosition, socket, true);
          } else {
            socket.emit('wantToUpgrade', selectedPiece, clickedPiece, clickedPosition);
          }
          controlUpgrade = true;
        }

      } else if ((extractCoordinates(clickedPosition) >= 6 || extractCoordinates(selectedPiece.currentPosition) >= 6) && selectedPiece.promoted == false && selectedPiece.upgradable == true) {
        if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
          upgradePiece(selectedPiece, clickedPiece, clickedPosition, socket, true);
        } else {
          socket.emit('wantToUpgrade', selectedPiece, clickedPiece, clickedPosition);
        }
        controlUpgrade = true;
      }

      selectedPiece.newPosition(clickedPosition); // update your piece position
      selectedPieceCounterpart.newPosition(convertPiecePosition(clickedPosition)); // update your piece position
    } else {
      selectedPiece = findObjectByDoubleKey(room.player2Pieces[0], 'currentPosition', 'captured', clickedPiece, false);
      if(selectedPiece == null) {
        selectedPiece = findObjectByDoubleKey(room.player1Pieces[0], 'currentPosition', 'captured', clickedPiece, false);
        selectedPieceCounterpart = findObjectByDoubleKey(room.player1Pieces[1], 'currentPosition', 'captured', convertPiecePosition(clickedPiece), false);
      } else {
        selectedPieceCounterpart = findObjectByDoubleKey(room.player2Pieces[1], 'currentPosition', 'captured', convertPiecePosition(clickedPiece), false);
      }

      eatedPiece = findObjectByDoubleKey(room.player1Pieces[1], 'currentPosition', 'captured', clickedPosition, false);
      //console.log(eatedPiece);
      if (eatedPiece) {
        //playersRoom.player2Pieces[0][selectedPiece.id-1].newPosition(convertPiecePosition(clickedPosition));
        room.player1Pieces[0][eatedPiece.id - 1].capture("");
        room.player1Pieces[1][eatedPiece.id - 1].capture("");
        socket.emit('addPieceToDrops', eatedPiece);
        socket.broadcast.to(room.player1.id).emit('addOpponentPieceToDrops', eatedPiece);
        if (extractCoordinates(clickedPosition) >= 6 && selectedPiece.promoted == false && selectedPiece.upgradable == true) {
          if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
            upgradePiece(selectedPiece, clickedPiece, clickedPosition, socket, true);
          } else {
            socket.emit('wantToUpgrade', selectedPiece, clickedPiece, clickedPosition);
          }
          controlUpgrade = true;
        } else if (extractCoordinates(selectedPiece.currentPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
          socket.emit('wantToUpgrade', selectedPiece, clickedPiece, clickedPosition);
          controlUpgrade = true;
        }
        //console.log(eatablePiece);
      } else if (extractCoordinates(clickedPosition) >= 6 && selectedPiece.promoted == false && selectedPiece.upgradable == true) {
        if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
          upgradePiece(selectedPiece, clickedPiece, clickedPosition, socket, true);
        } else {
          socket.emit('wantToUpgrade', room, selectedPiece, clickedPiece, clickedPosition);
        }
        controlUpgrade = true;
      } else if (extractCoordinates(selectedPiece.currentPosition) >= 6 && selectedPiece.promoted == false && selectedPiece.upgradable == true) {
        socket.emit('wantToUpgrade', room, selectedPiece, clickedPiece, clickedPosition);
        controlUpgrade = true;
      }

      selectedPiece.newPosition(clickedPosition);
      selectedPieceCounterpart.newPosition(convertPiecePosition(clickedPosition));
    }

    updateView(selectedPiece, clickedPiece, clickedPosition, socket, false);
    if (controlUpgrade == false) {
      updateTurns(socket);
    }
  });

  socket.on('upgrade', function (selectedPiece, clickedPiece, clickedPosition, choice) {

    upgradePiece(selectedPiece, clickedPiece, clickedPosition, socket, choice);

  });
});

function upgradePiece(selectedPiece, clickedPiece, clickedPosition, socket, choice) {
  var room = Room.list[socket.room];
    if (room.turn == "black") {
      if (choice == true) {
        room.player1Pieces[0][selectedPiece.id - 1].promote();
        room.player1Pieces[1][selectedPiece.id - 1].promote();
        selectedPiece = room.player1Pieces[0][selectedPiece.id - 1];
      }
    } else {
      if (choice == true) {
        room.player2Pieces[0][selectedPiece.id - 1].promote();
        room.player2Pieces[1][selectedPiece.id - 1].promote();
        selectedPiece = room.player2Pieces[0][selectedPiece.id - 1];
      }
    }

    updateView(selectedPiece, clickedPosition, clickedPosition, socket, false);
    updateTurns(socket);
}

function updateView(selectedPiece, clickedPiece, clickedPosition, socket, dropping) {
  var room = Room.list[socket.room];

  socket.emit('updatePlayerView', selectedPiece, clickedPiece, clickedPosition, dropping);
  socket.broadcast.to(socket.room).emit('updateOpponentView', selectedPiece, convertPiecePosition(clickedPiece), convertPiecePosition(clickedPosition), dropping);

}

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

function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}

function showPossibleMoves(ownPieces, opponentPieces, selectedPiece, socket) {
  var piece = findObjectByDoubleKey(ownPieces, 'currentPosition', 'captured', selectedPiece, false);
  if(piece == null) {
    piece = findObjectByDoubleKey(Room.list[socket.room].player2Pieces[0], 'currentPosition', 'captured', selectedPiece, false);
  }
  var possibleMovesArray = new Array();
  var selectedPieceName = piece.name;

  if (piece.promoted == true) {
    possibleMoves(ownPieces, opponentPieces, piece, piece.pieceUpgradedMoves, possibleMovesArray);
  } else {
    possibleMoves(ownPieces, opponentPieces, piece, piece.pieceMoves, possibleMovesArray);
  }

  return possibleMovesArray;
}

function possibleMoves(ownPieces, opponentPieces, piece, pieceMoveSet, possibleMovesArray) {

  for (var x = 0; x < pieceMoveSet.length; x++) {
    var move = pieceMoveSet[x];
    switch (move) {
      case 'diagUpRight':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 1, 1, false);
        break;
      case 'right':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 0, 1, false);
        break;
      case 'diagDownRight':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, -1, 1, false);
        break;
      case 'down':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, -1, 0, false);
        break;
      case 'diagDownLeft':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, -1, -1, false);
        break;
      case 'left':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 0, -1, false);
        break;
      case 'diagUpLeft':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 1, -1, false);
        break;
      case 'upUp':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 1, 0, true);
        break;
      case 'rightRight':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 0, 1, true);
        break;
      case 'downDown':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, -1, 0, true);
        break;
      case 'leftLeft':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 0, -1, true);
        break;
      case 'leftUp':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 2, -1, false);
        break;
      case 'rightUp':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 2, 1, false);
        break;
      case 'diagDiagUpLeft':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 1, -1, true);
        break;
      case 'diagDiagUpRight':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 1, 1, true);
        break;
      case 'diagDiagDownLeft':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, -1, -1, true);
        break;
      case 'diagDiagDownRight':
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, -1, 1, true);
        break;
      default:
        setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, 1, 0, false);
    }
  }
}

function convertToNewPos(position, c) {
  var r = boardCoordinates[position];

  var newPos = r + "-" + c;
  return newPos;
}

function setMovement(ownPieces, opponentPieces, piece, possibleMovesArray, y, x, special) {

  var coordinate = piece.currentPosition.split("-");

  var r = boardCoordinates.indexOf(coordinate[0]) + y;
  var c = parseInt(coordinate[1]) + x;

  var piecePosition = r + "-" + c;
  var occupied;
  var newMove;
  if (special) {
    var oldMoveR = parseInt(boardCoordinates.indexOf(coordinate[0]));
    var oldMoveC = parseInt(coordinate[1]);
    if (y == -1 && x == 0) {
      for (; r >= 0; r--) {
        newMove = convertToNewPos(r, c);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    } else if (y == 0 && x == 1) {
      for (; c <= 9; c++) {
        newMove = convertToNewPos(r, c);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    } else if (y == 0 && x == -1) {
      for (; c > 0; c--) {
        newMove = convertToNewPos(r, c);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    } else if (y == 1 && x == 0) {
      for (; r <= 9; r++) {
        newMove = convertToNewPos(r, c);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    } else if (y == -1 && x == 1) {
      //console.log(oldMoveR + " - " + oldMoveC);
      for (; oldMoveR > 0, oldMoveC < 9;) {
        oldMoveR--;
        oldMoveC++;
        newMove = convertToNewPos(oldMoveR, oldMoveC);
        //console.log(newMove);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    } else if (y == -1 && x == -1) {
      for (; oldMoveR > 0;) {
        oldMoveR--;
        oldMoveC--;
        if (oldMoveR == 0 || oldMoveC == 0) {
          break;
        }
        newMove = convertToNewPos(oldMoveR, oldMoveC);
        //console.log(newMove);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    } else if (y == 1 && x == 1) {
      for (; oldMoveR < 9, oldMoveC < 9;) {
        oldMoveR++;
        oldMoveC++;
        if (oldMoveR == 10 || oldMoveC == 10) {
          break;
        }
        newMove = convertToNewPos(oldMoveR, oldMoveC);
        //console.log(oldMoveR + "-" + oldMoveC);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    } else if (y == 1 && x == -1) {
      for (; oldMoveR < 9, oldMoveC > 1;) {
        oldMoveR++;
        oldMoveC--;
        if (oldMoveR == 9 || oldMoveC == 0) {
          break;
        }
        newMove = convertToNewPos(oldMoveR, oldMoveC);
        //console.log(newMove);
        occupied = checkIfOccupied(ownPieces, opponentPieces, newMove);
        if (occupied != true) {
          possibleMovesArray.push(newMove);
          if (occupied == "eat") {
            break;
          }
        } else {
          break;
        }
      }
    }
  } else {
    newMove = convertToNewPos(r, c);
    if (checkIfOccupied(ownPieces, opponentPieces, newMove) == false || checkIfOccupied(ownPieces, opponentPieces, newMove) == "eat") {
      possibleMovesArray.push(newMove);
    }
  }
}

function checkIfOccupied(ownPieces, opponentPieces, position) {
  var checkOwnPiece = findObjectByDoubleKey(ownPieces, 'currentPosition', 'captured', position, false);
  var checkOpponentPiece = findObjectByDoubleKey(opponentPieces, 'currentPosition', 'captured', position, false);

  if (checkOwnPiece) {
    if (checkOwnPiece.property == "player1") {
      return true;
    }
  } else if (checkOpponentPiece) {
    if (checkOpponentPiece.property == "player2") {
      return "eat";
    }
  }

  return false;
}

function findObjectByDoubleKey(array, key, key2, value, value2) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value && array[i][key2] === value2) {
      return array[i];
    }
  }
  return null;
}

function createPieces() {
  var player1Pieces = [];
  var player2Pieces = [];

  pedina1 = new Piece("1", "Pedina", true, "player1", "C-1", "PedinaPromossa", movesPedina, movesGenOro);
  pedina2 = new Piece("2", "Pedina", true, "player1", "C-2", "PedinaPromossa", movesPedina, movesGenOro);
  pedina3 = new Piece("3", "Pedina", true, "player1", "C-3", "PedinaPromossa", movesPedina, movesGenOro);
  pedina4 = new Piece("4", "Pedina", true, "player1", "C-4", "PedinaPromossa", movesPedina, movesGenOro);
  pedina5 = new Piece("5", "Pedina", true, "player1", "C-5", "PedinaPromossa", movesPedina, movesGenOro);
  pedina6 = new Piece("6", "Pedina", true, "player1", "C-6", "PedinaPromossa", movesPedina, movesGenOro);
  pedina7 = new Piece("7", "Pedina", true, "player1", "C-7", "PedinaPromossa", movesPedina, movesGenOro);
  pedina8 = new Piece("8", "Pedina", true, "player1", "C-8", "PedinaPromossa", movesPedina, movesGenOro);
  pedina9 = new Piece("9", "Pedina", true, "player1", "C-9", "PedinaPromossa", movesPedina, movesGenOro);

  alfiere = new Piece("10", "Alfiere", true, "player1", "B-2", "AlfierePromosso", movesAlfiere, movesAlfierePromosso);
  torre = new Piece("11", "Torre", true, "player1", "B-8", "TorrePromossa", movesTorre, movesTorrePromossa);
  lanciere1 = new Piece("12", "Lanciere", true, "player1", "A-1", "LancierePromosso", movesLanciere, movesGenOro);
  cavallo1 = new Piece("13", "Cavallo", true, "player1", "A-2", "CavalloPromosso", movesCavallo, movesGenOro);
  genArg1 = new Piece("14", "GenArg", true, "player1", "A-3", "GenArgPromosso", movesGenArg, movesGenOro);
  genOro1 = new Piece("15", "GenOro", false, "player1", "A-4", "", movesGenOro, "");
  re = new Piece("16", "Re", false, "player1", "A-5", "", movesRe, "");
  genOro2 = new Piece("17", "GenOro", false, "player1", "A-6", "", movesGenOro, "");
  genArg2 = new Piece("18", "GenArg", true, "player1", "A-7", "GenArgPromosso", movesGenArg, movesGenOro);
  cavallo2 = new Piece("19", "Cavallo", true, "player1", "A-8", "CavalloPromosso", movesCavallo, movesGenOro);
  lanciere2 = new Piece("20", "Lanciere", true, "player1", "A-9", "LancierePromosso", movesLanciere, movesGenOro);

  player1Pieces.push(pedina1);
  player1Pieces.push(pedina2);
  player1Pieces.push(pedina3);
  player1Pieces.push(pedina4);
  player1Pieces.push(pedina5);
  player1Pieces.push(pedina6);
  player1Pieces.push(pedina7);
  player1Pieces.push(pedina8);
  player1Pieces.push(pedina9);
  player1Pieces.push(alfiere);
  player1Pieces.push(torre);
  player1Pieces.push(lanciere1);
  player1Pieces.push(cavallo1);
  player1Pieces.push(genArg1);
  player1Pieces.push(genOro1);
  player1Pieces.push(re);
  player1Pieces.push(genOro2);
  player1Pieces.push(genArg2);
  player1Pieces.push(cavallo2);
  player1Pieces.push(lanciere2);

  pedina10 = new Piece("1", "Pedina", true, "player2", "G-9", "PedinaPromossa", movesPedina, movesGenOro);
  pedina11 = new Piece("2", "Pedina", true, "player2", "G-8", "PedinaPromossa", movesPedina, movesGenOro);
  pedina12 = new Piece("3", "Pedina", true, "player2", "G-7", "PedinaPromossa", movesPedina, movesGenOro);
  pedina13 = new Piece("4", "Pedina", true, "player2", "G-6", "PedinaPromossa", movesPedina, movesGenOro);
  pedina14 = new Piece("5", "Pedina", true, "player2", "G-5", "PedinaPromossa", movesPedina, movesGenOro);
  pedina15 = new Piece("6", "Pedina", true, "player2", "G-4", "PedinaPromossa", movesPedina, movesGenOro);
  pedina16 = new Piece("7", "Pedina", true, "player2", "G-3", "PedinaPromossa", movesPedina, movesGenOro);
  pedina17 = new Piece("8", "Pedina", true, "player2", "G-2", "PedinaPromossa", movesPedina, movesGenOro);
  pedina18 = new Piece("9", "Pedina", true, "player2", "G-1", "PedinaPromossa", movesPedina, movesGenOro);

  alfiere1 = new Piece("10", "Alfiere", true, "player2", "H-8", "AlfierePromosso", movesAlfiere, movesAlfierePromosso);
  torre1 = new Piece("11", "Torre", true, "player2", "H-2", "TorrePromossa", movesTorre, movesTorrePromossa);
  lanciere3 = new Piece("12", "Lanciere", true, "player2", "I-9", "LancierePromosso", movesLanciere, movesGenOro);
  cavallo3 = new Piece("13", "Cavallo", true, "player2", "I-8", "CavalloPromosso", movesCavallo, movesGenOro);
  genArg3 = new Piece("14", "GenArg", true, "player2", "I-7", "GenArgPromosso", movesGenArg, movesGenOro);
  genOro3 = new Piece("15", "GenOro", false, "player2", "I-6", "", movesGenOro, "");
  re = new Piece("16", "Re", false, "player2", "I-5", "", movesRe, "");
  genOro4 = new Piece("17", "GenOro", false, "player2", "I-4", "", movesGenOro, "");
  genArg4 = new Piece("18", "GenArg", true, "player2", "I-3", "GenArgPromosso", movesGenArg, movesGenOro);
  cavallo4 = new Piece("19", "Cavallo", true, "player2", "I-2", "CavalloPromosso", movesCavallo, movesGenOro);
  lanciere4 = new Piece("20", "Lanciere", true, "player2", "I-1", "LancierePromosso", movesLanciere, movesGenOro);

  player2Pieces.push(pedina10);
  player2Pieces.push(pedina11);
  player2Pieces.push(pedina12);
  player2Pieces.push(pedina13);
  player2Pieces.push(pedina14);
  player2Pieces.push(pedina15);
  player2Pieces.push(pedina16);
  player2Pieces.push(pedina17);
  player2Pieces.push(pedina18);
  player2Pieces.push(alfiere1);
  player2Pieces.push(torre1);
  player2Pieces.push(lanciere3);
  player2Pieces.push(cavallo3);
  player2Pieces.push(genArg3);
  player2Pieces.push(genOro3);
  player2Pieces.push(re);
  player2Pieces.push(genOro4);
  player2Pieces.push(genArg4);
  player2Pieces.push(cavallo4);
  player2Pieces.push(lanciere4);

  var pieces = [player1Pieces, player2Pieces];

  return pieces;
}