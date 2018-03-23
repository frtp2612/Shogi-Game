// Dependencies

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 5000;
const http = require('http');

var app = require('express')();
var server = http.createServer(app);
var io = socketIO(server);
//var io = socketIO.listen(server);

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
  "<input type='text' placeholder='Room Name' minlength='4' maxlength='16'>" +
  "<button id='createRoomButton'>Create Room</button>" +
"</div>" +
"<div class='rooms'>" +
"<ul></ul>" +
"</div>";

const login = "" +
"<div class='login'>" +
  "<input type='text' placeholder='Username' minlength='4' maxlength='16'>" +
  "<button id='loginButton'>Login</button>" +
  "<input type='text' class='roomName' placeholder='Room Name' minlength='4' maxlength='16'>" +
  "<button id='joinNewRoom'>Login</button>" +
"</div>";

//GAME VARIABLES
var SOCKET_LIST = {};

var Player = function (id, name) {
  var self = {
    id: id,
    name: name,
    roomCreated: false,
    insideRoom: false,
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

  Player.list[id] = self;

  return self;
}

Player.list = {};

var Room = function (id, name) {
  var self = {
    id: id,
    name: name,
    player1: Player.list[id],
    player2: "",
    player1Pieces: "",
    player2Pieces: "",
    turn: "black"
  }

  self.destroyRoom = function () {
    delete Room.list[id];
  }

  self.setOpponent = function(value) {
    self.player2 = value;
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

var Piece = function (id, name, upgradable, property, startPosition, upgradedName, simpleMoves, updgradedMoves) {
  var self = {
    id: id,
    name: name,
    upgradable: upgradable,
    promoted: false,
    property: property,
    captured: false,
    currentPosition: startPosition,
    pieceUpgradedName: upgradedName,
    pieceMoves: simpleMoves,
    pieceUpgradedMoves: updgradedMoves
  }

  self.newPosition = function (position) {
    currentPosition = position;
  }

  self.capture = function (newProperty) {
    captured = true;
    property = newProperty;
  }

  self.promote = function () {
    promoted = true;
  }

  self.drop = function () {
    captured = false;
  }

  return self;
}

Player.onConnect = function (socket, playerName) {
  var player = Player(socket.id, playerName);
  
  socket.on('createRoom', function(roomName){ // create room
    player.createRoom();
    var room = Room(socket.id, roomName);
    room.setPlayersPieces();
    //console.log(room);
    socket.broadcast.to(mainRoom).emit('rooms', Room.list);

    socket.emit('displayPage', board); // send to user the main page

    socket.emit('displayPieces', room.player1Pieces);
  });

  socket.on('joinRoom', function(roomName){ // join room
    console.log(io.sockets.adapter.rooms[roomName].length);
    if(io.sockets.adapter.rooms[roomName].length <= 2) {
      
      player.joinRoom();

      Room.list[roomName].setOpponent(player);
      //console.log(Room.list[roomName]);
      
      socket.emit('displayPage', board); // send to user the main page
      socket.emit('displayPieces', Room.list[roomName].player2Pieces);
    } else {
      var msg = "The room is full";
      socket.emit('error', msg); // send to user the main page
    }
  });

  socket.on('matchStart', function(roomName) {
    if (Room.list[roomName].player1 != undefined && Room.list[roomName].player2 != undefined) {
      console.log(Room.list[roomName]);
      io.to(roomName).emit('turn', Room.list[roomName]);
    }
  });
  //console.log(socket.id + ": " + playerName + " " + "has connected");
}

Player.onDisconnect = function (socket) {
  delete Player.list[socket.id];
  delete Room.list[socket.id];
  console.log(socket.id + " has disconnected");
}

io.sockets.on('connection', function (socket) {
  socket.emit('displayPage', login); // send to user the login page
  //socket.join(mainRoom);

  socket.on('joinNewRoom', function(roomName) {
    socket.leave(mainRoom);

    socket.join(roomName);
    console.log(roomName);
    socket.broadcast.to(roomName).emit('joined', socket + " has joined the room");
  });
  
  socket.on('login', function(playerName){
    socket.emit('displayPage', page); // send to user the main page
    
    socket.join(mainRoom); // make user join the main room

    socket.id = Math.random(); // generate a random socket id
    SOCKET_LIST[socket.id] = socket; // insert into socket list the new player socket

    Player.onConnect(socket, playerName); // call the on connect function
    
    socket.broadcast.to(mainRoom).emit('connectedUsers', Player.list);

    socket.broadcast.to(mainRoom).emit('rooms', Room.list);
    

    // on user disconnect, remove player from socket list,
    // remove it from player list and leave the main room
    socket.on('disconnect', function () { 
      delete SOCKET_LIST[socket.id];
      Player.onDisconnect(socket);
      socket.leave(mainRoom);
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

/*var players = {};

var playerArray = new Array();
var roomsArray = new Array();

var selectedPiece;
var clickedPiecePosition;

/**POSITION VARIABLES 
var r, c;
var yourPosition;
var opponentPosition;
var coordinate;

var newPlayer;

var newRoom = new Room("shogiRoom");
var player1Pieces = new Array();
var player2Pieces = new Array();

function translatePlayerCoordinates(opponentPieces) {
  for (var index in opponentPieces) {
    opponentPieces[index].startPosition = convertPiecePosition(opponentPieces[index].startPosition);
    opponentPieces[index].currentPosition = convertPiecePosition(opponentPieces[index].currentPosition);
  }

  return opponentPieces;
}

function convertPiecePosition(opponentPiecePosition) {
  var coordinate = opponentPiecePosition.split("-");

  var r = boardCoordinates[8 - boardCoordinates.indexOf(coordinate[0])];
  var c = 10 - parseInt(coordinate[1]);

  piecePosition = r + "-" + c;
  return piecePosition;
}

function extractCoordinates(position) {
  var coordinate = position.split("-");

  var r = boardCoordinates.indexOf(coordinate[0]);
  return r;
}

io.on('connect', function (socket) {

  socket.on('join', function () {
    newPlayer = new Player(socket.id);
    newPlayer.setRoom("shogiRoom");

    socket.broadcast.emit('connected', newPlayer);

    if (newRoom.player1 == undefined || newRoom.player1 == null) {
      newRoom.setPlayer1(newPlayer);
      var piecesList = createPieces();
      piecesList[1] = translatePlayerCoordinates(piecesList[1]);
      //console.log(piecesList);
      newRoom.setPlayer1Pieces(piecesList);
      socket.emit('placePieces', piecesList);
    } else {
      newRoom.setPlayer2(newPlayer);
      var piecesList = createPieces();
      piecesList[1] = translatePlayerCoordinates(piecesList[1]);
      newRoom.setPlayer2Pieces(piecesList);
      socket.emit('placePieces', piecesList);

    }

    socket.emit('success', newPlayer);

    playerArray.push(newPlayer);
    roomsArray.push(newRoom);
    socket.join(newRoom.roomName);
    //console.log(newRoom);
    if (newRoom.player1 != undefined && newRoom.player2 != undefined) {
      socket.broadcast.to(newRoom.player1.id).emit('turn', newRoom, "your turn");
    }
    console.log(newPlayer.id + " has joined the room: " + newRoom.roomName);
  });

  socket.on('createRoom', function (roomName) {
    // update player room status, to the room  he joined
    var player = findObjectByKey(playerArray, 'id', socket.id);
    player.setRoom(roomName);

    // create a new room instance
    var newRoom = new Room(player.id, player, roomName);

    // store the room object into an array
    roomsArray.push(newRoom);

    // make client join the room
    socket.join(newRoom.roomName);

    // show outer users that a new room has been created
    socket.broadcast.emit('newRoom', newRoom.roomName, newRoom);

    // make the client enter the room
    socket.emit('enterRoom', player, newRoom.id);
  });

  socket.on('joinRoom', function (roomName, playerName, id) {
    // update user room status, to the room  he joined
    var player = findObjectByKey(playerArray, 'id', socket.id);
    var chooseRoom = findObjectByKey(roomsArray, 'id', id);

    player.setRoom(chooseRoom.roomName);

    // make client join the room
    socket.join(chooseRoom.roomName);

    // send message to the rooom
    socket.broadcast.to(id).emit('roomJoined', player.playerName);
    player.setFaction("red");
    socket.emit('enterRoom', player, id);
    //console.log(player);

    // send pieces list to opponent        
    chooseRoom.setPlayer(player);
    //console.log(chooseRoom);
    //console.log(chooseRoom.piecesList.length);
    socket.emit('requestedPieces', chooseRoom.piecesList);
  });

  socket.on('requestPieces', function (roomId) {
    var chooseRoom = findObjectByKey(roomsArray, 'id', roomId);

    chooseRoom.setPieces(createPieces());
    socket.emit('requestedPieces', chooseRoom.piecesList);
    //console.log(roomsArray.length);
    io.in(chooseRoom.roomName).emit('turn', chooseRoom);
  });

  socket.on('updatePartecipants', function (playerName, roomId) {
    io.in(roomId).emit('showPartecipants', playerName);
  });


  /**GAME LOGIC***

  socket.on('showMovements', function (clickedPiece, pieceIndex, room) {
    var playersRoom = findObjectByKey(roomsArray, 'roomName', room.roomName);
    //console.log(room.roomName);
    if (playersRoom.turn == "black" && socket.id == playersRoom.player1.id) {

      socket.emit('showSelectedPiece', clickedPiece);
      var piecePossibleMoves = showPossibleMoves(playersRoom.player1Pieces[0], playersRoom.player2Pieces[1], pieceIndex - 1);
      socket.emit('showSelectedPieceMovements', piecePossibleMoves);
      socket.broadcast.to(playersRoom.roomName).emit('showSelectedPiece', convertPiecePosition(clickedPiece));

    } else if (playersRoom.turn == "red" && socket.id == playersRoom.player2.id) {

      socket.emit('showSelectedPiece', clickedPiece);
      var piecePossibleMoves = showPossibleMoves(playersRoom.player2Pieces[0], playersRoom.player1Pieces[1], pieceIndex - 1);
      socket.emit('showSelectedPieceMovements', piecePossibleMoves);
      socket.broadcast.to(playersRoom.roomName).emit('showSelectedPiece', convertPiecePosition(clickedPiece));

    }
    //console.log(piecePossibleMoves);
  });

  socket.on('hideMovements', function (clickedPiece, room) {
    socket.emit('hideSelectedPiece', clickedPiece);
    socket.broadcast.to(room.roomName).emit('hideSelectedPiece', convertPiecePosition(clickedPiece));
  });

  socket.on('moveToNewPosition', function (clickedPiece, clickedPosition, room) {
    var playersRoom = findObjectByKey(roomsArray, 'roomName', room.roomName);
    var selectedPiece;
    var eatablePiece;

    var controlUpgrade = false;

    if (playersRoom.turn == "black") {
      selectedPiece = findObjectByDoubleKey(playersRoom.player1Pieces[0], 'currentPosition', 'captured', clickedPiece, false);
      //console.log(selectedPiece);
      //console.log(clickedPiece);
      eatablePiece = findObjectByDoubleKey(playersRoom.player2Pieces[0], 'currentPosition', 'captured', convertPiecePosition(clickedPosition), false);

      //console.log(selectedPiece);
      if (eatablePiece) {
        //playersRoom.player2Pieces[0][selectedPiece.id-1].newPosition(convertPiecePosition(clickedPosition));
        playersRoom.player2Pieces[0][eatablePiece.id - 1].capture("");
        playersRoom.player2Pieces[1][eatablePiece.id - 1].capture("");
        socket.emit('addPieceToDrops', playersRoom, eatablePiece);
        socket.broadcast.to(playersRoom.player2.id).emit('addOpponentPieceToDrops', playersRoom, eatablePiece);
        if (extractCoordinates(clickedPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
          if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
            upgradePiece(room, selectedPiece, clickedPiece, clickedPosition, socket, true);
          } else {
            socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
          }
          controlUpgrade = true;
        } else if (extractCoordinates(selectedPiece.currentPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
          socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
          controlUpgrade = true;
        }
        //console.log(eatablePiece);
      } else if (extractCoordinates(clickedPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
        if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
          upgradePiece(room, selectedPiece, clickedPiece, clickedPosition, socket, true);
        } else {
          socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
        }
        controlUpgrade = true;
      } else if (extractCoordinates(selectedPiece.currentPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
        socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
        controlUpgrade = true;
      }

      playersRoom.player1Pieces[0][selectedPiece.id - 1].newPosition(clickedPosition);
      playersRoom.player1Pieces[1][selectedPiece.id - 1].newPosition(convertPiecePosition(clickedPosition));
      //console.log(playersRoom.player1Pieces[0][selectedPiece.id-1]);
    } else {
      selectedPiece = findObjectByDoubleKey(playersRoom.player2Pieces[0], 'currentPosition', 'captured', clickedPiece, false);
      eatablePiece = findObjectByDoubleKey(playersRoom.player1Pieces[0], 'currentPosition', 'captured', convertPiecePosition(clickedPosition), false);

      if (eatablePiece) {
        //playersRoom.player2Pieces[0][selectedPiece.id-1].newPosition(convertPiecePosition(clickedPosition));
        playersRoom.player1Pieces[0][eatablePiece.id - 1].capture("");
        playersRoom.player1Pieces[1][eatablePiece.id - 1].capture("");
        socket.emit('addPieceToDrops', playersRoom, eatablePiece);
        socket.broadcast.to(playersRoom.player1.id).emit('addOpponentPieceToDrops', playersRoom, eatablePiece);
        if (extractCoordinates(clickedPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
          if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
            upgradePiece(room, selectedPiece, clickedPiece, clickedPosition, socket, true);
          } else {
            socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
          }
          controlUpgrade = true;
        } else if (extractCoordinates(selectedPiece.currentPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
          socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
          controlUpgrade = true;
        }
        //console.log(eatablePiece);
      } else if (extractCoordinates(clickedPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
        if (((selectedPiece.pieceName == "Pedina" || selectedPiece.pieceName == "Lanciere") && extractCoordinates(clickedPosition) == 8) || (selectedPiece.pieceName == "Cavallo" && extractCoordinates(clickedPosition) >= 7)) {
          upgradePiece(room, selectedPiece, clickedPiece, clickedPosition, socket, true);
        } else {
          socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
        }
        controlUpgrade = true;
      } else if (extractCoordinates(selectedPiece.currentPosition) >= 6 && selectedPiece.upgraded == false && selectedPiece.upgradable == true) {
        socket.emit('wantToUpgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition);
        controlUpgrade = true;
      }

      playersRoom.player2Pieces[0][selectedPiece.id - 1].newPosition(clickedPosition);
      playersRoom.player2Pieces[1][selectedPiece.id - 1].newPosition(convertPiecePosition(clickedPosition));
    }

    updateView(playersRoom, selectedPiece, clickedPiece, clickedPosition, socket);
    if (controlUpgrade == false) {
      updateTurns(playersRoom, socket);
    }
  });

  socket.on('showDropPositions', function (pieceId, room) {
    var playersRoom = findObjectByKey(roomsArray, 'roomName', room.roomName);
    console.log(pieceId);
    if (playersRoom.turn == "black" && socket.id == playersRoom.player1.id) {

      var piecePossibleMoves = showPossibleMoves(playersRoom.player2Pieces[0], playersRoom.player1Pieces[1], pieceId - 1);
      socket.emit('showSelectedPieceMovements', piecePossibleMoves);

    } else if (playersRoom.turn == "red" && socket.id == playersRoom.player2.id) {

      var piecePossibleMoves = showPossibleMoves(playersRoom.player1Pieces[0], playersRoom.player2Pieces[1], pieceId - 1);
      socket.emit('showSelectedPieceMovements', piecePossibleMoves);

    }
    //console.log(piecePossibleMoves);
  });

  socket.on('upgrade', function (room, selectedPiece, clickedPiece, clickedPosition, choice) {

    upgradePiece(room, selectedPiece, clickedPiece, clickedPosition, socket, choice);

  });

  socket.on('error', function () {
    socket.emit('error', 'an error has occured');
  });
});

function upgradePiece(room, selectedPiece, clickedPiece, clickedPosition, socket, choice) {
  var playersRoom = findObjectByKey(roomsArray, 'roomName', room.roomName);
  if (playersRoom.turn == "black") {
    if (choice == true) {
      playersRoom.player1Pieces[0][selectedPiece.id - 1].promote();
      playersRoom.player1Pieces[1][selectedPiece.id - 1].promote();
      //console.log(playersRoom.player1Pieces[0][selectedPiece.id-1]);
      selectedPiece = playersRoom.player1Pieces[0][selectedPiece.id - 1];
    }
  } else {
    if (choice == true) {
      playersRoom.player2Pieces[0][selectedPiece.id - 1].promote();
      playersRoom.player2Pieces[1][selectedPiece.id - 1].promote();
      //console.log(playersRoom.player2Pieces[0][selectedPiece.id-1]);
      selectedPiece = playersRoom.player2Pieces[0][selectedPiece.id - 1];
    }
  }
  //socket.emit('updatePlayerView', selectedPiece, clickedPosition, clickedPosition);
  //socket.broadcast.to(playersRoom.roomName).emit('updateOpponentView', selectedPiece, convertPiecePosition(clickedPosition), convertPiecePosition(clickedPosition));
  updateView(playersRoom, selectedPiece, clickedPosition, clickedPosition, socket);
  updateTurns(playersRoom, socket);
}

function updateView(room, selectedPiece, clickedPiece, clickedPosition, socket) {
  var playersRoom = findObjectByKey(roomsArray, 'roomName', room.roomName);

  socket.emit('updatePlayerView', selectedPiece, clickedPiece, clickedPosition);
  socket.broadcast.to(playersRoom.roomName).emit('updateOpponentView', selectedPiece, convertPiecePosition(clickedPiece), convertPiecePosition(clickedPosition));

}

function updateTurns(room, socket) {
  var playersRoom = findObjectByKey(roomsArray, 'roomName', room.roomName);
  if (playersRoom.turn == "red") {
    playersRoom.updateTurn("black");
    socket.broadcast.to(playersRoom.player1.id).emit('turn', playersRoom, "your turn");
  } else {
    playersRoom.updateTurn("red");
    socket.broadcast.to(playersRoom.player2.id).emit('turn', playersRoom, "your turn");
  }
}

/*setInterval(function() {
  console.log(roomsArray.length);
}, 1000);*

function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}

function showPossibleMoves(player1Pieces, player2Pieces, index) {
  var possibleMovesArray = new Array();
  var selectedPieceName = player1Pieces[index].pieceName;
  if (player1Pieces[index].upgraded == true) {
    selectedPieceName = player1Pieces[index].pieceUpgradedName;
  }
  switch (selectedPieceName) {
    case 'Pedina':
      possibleMoves(player1Pieces, player2Pieces, index, movesPedina, possibleMovesArray);
      break;
    case 'PedinaPromossa':
      possibleMoves(player1Pieces, player2Pieces, index, movesGenOro, possibleMovesArray);
      break;
    case 'Alfiere':
      possibleMoves(player1Pieces, player2Pieces, index, movesAlfiere, possibleMovesArray);
      break;
    case 'AlfierePromosso':
      possibleMoves(player1Pieces, player2Pieces, index, movesAlfierePromosso, possibleMovesArray);
      break;
    case 'Torre':
      possibleMoves(player1Pieces, player2Pieces, index, movesTorre, possibleMovesArray);
      break;
    case 'TorrePromossa':
      possibleMoves(player1Pieces, player2Pieces, index, movesTorrePromossa, possibleMovesArray);
      break;
    case 'Lanciere':
      possibleMoves(player1Pieces, player2Pieces, index, movesLanciere, possibleMovesArray);
      break;
    case 'LancierePromosso':
      possibleMoves(player1Pieces, player2Pieces, index, movesGenOro, possibleMovesArray);
      break;
    case 'Cavallo':
      possibleMoves(player1Pieces, player2Pieces, index, movesCavallo, possibleMovesArray);
      break;
    case 'CavalloPromosso':
      possibleMoves(player1Pieces, player2Pieces, index, movesGenOro, possibleMovesArray);
      break;
    case 'GenArg':
      possibleMoves(player1Pieces, player2Pieces, index, movesGenArg, possibleMovesArray);
      break;
    case 'GenArgPromosso':
      possibleMoves(player1Pieces, player2Pieces, index, movesGenOro, possibleMovesArray);
      break;
    case 'GenOro':
      possibleMoves(player1Pieces, player2Pieces, index, movesGenOro, possibleMovesArray);
      break;
    case 'Re':
      possibleMoves(player1Pieces, player2Pieces, index, movesRe, possibleMovesArray);
      break;
    default:
      alert('Nobody Wins!');
  }

  return possibleMovesArray;
}

function possibleMoves(player1Pieces, player2Pieces, index, pieceMoveSet, possibleMovesArray) {

  for (var x = 0; x < pieceMoveSet.length; x++) {
    move = pieceMoveSet[x];
    switch (move) {
      case 'diagUpRight':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 1, 1, false);
        break;
      case 'right':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 0, 1, false);
        break;
      case 'diagDownRight':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, -1, 1, false);
        break;
      case 'down':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, -1, 0, false);
        break;
      case 'diagDownLeft':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, -1, -1, false);
        break;
      case 'left':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 0, -1, false);
        break;
      case 'diagUpLeft':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 1, -1, false);
        break;
      case 'upUp':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 1, 0, true);
        break;
      case 'rightRight':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 0, 1, true);
        break;
      case 'downDown':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, -1, 0, true);
        break;
      case 'leftLeft':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 0, -1, true);
        break;
      case 'leftUp':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 2, -1, false);
        break;
      case 'rightUp':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 2, 1, false);
        break;
      case 'diagDiagUpLeft':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 1, -1, true);
        break;
      case 'diagDiagUpRight':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 1, 1, true);
        break;
      case 'diagDiagDownLeft':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, -1, -1, true);
        break;
      case 'diagDiagDownRight':
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, -1, 1, true);
        break;
      default:
        setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, 1, 0, false);
    }
  }
}

function convertToNewPos(position, c) {
  r = boardCoordinates[position];

  var newPos = r + "-" + c;
  return newPos;
}

function setMovement(player1Pieces, player2Pieces, index, possibleMovesArray, y, x, special) {

  var coordinate = player1Pieces[index].currentPosition.split("-");

  var r = boardCoordinates.indexOf(coordinate[0]) + y;
  var c = parseInt(coordinate[1]) + x;

  piecePosition = r + "-" + c;
  var occupied;
  var newMove;
  if (special) {
    var oldMoveR = parseInt(boardCoordinates.indexOf(coordinate[0]));
    var oldMoveC = parseInt(coordinate[1]);
    if (y == -1 && x == 0) {
      for (; r >= 0; r--) {
        newMove = convertToNewPos(r, c);
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
        occupied = checkIfOccupied(player1Pieces, player2Pieces, newMove);
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
    if (checkIfOccupied(player1Pieces, player2Pieces, newMove) == false || checkIfOccupied(player1Pieces, player2Pieces, newMove) == "eat") {
      possibleMovesArray.push(newMove);
    }
  }
}

function checkIfOccupied(player1Pieces, player2Pieces, movement) {
  var checkPlayer1Piece = findObjectByDoubleKey(player1Pieces, 'currentPosition', 'captured', movement, false);
  var checkPlayer2Piece = findObjectByDoubleKey(player2Pieces, 'currentPosition', 'captured', movement, false);
  //console.log("Movement: " + movement);


  if (checkPlayer1Piece) {
    if (checkPlayer1Piece.property == "player1") {
      return true;
    }
  } else if (checkPlayer2Piece) {
    //console.log("piece: " + checkPlayer2Piece.pieceName + " position: " + checkPlayer2Piece.currentPosition);
    if (checkPlayer2Piece.property == "player2") {
      return "eat";
    }
    //return true;
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
}*/

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

/*
function Player(id) {
  this.id = id;
  this.room;
  this.playing = true;
  this.faction;

  this.setRoom = function (value) {
    this.room = value;
  }

  this.setFaction = function (value) {
    this.faction = value;
  }
  return this;
}

function Room(roomName) {
  this.roomName = roomName;
  this.player1;
  this.player2;
  this.gameStarted = false;
  this.playing = false;
  this.piecesList;
  this.turn = "black";
  this.player1Pieces;
  this.player2Pieces;

  this.updateTurn = function (value) {
    this.turn = value;
  }

  this.endGame = function () {
    this.playing = false;
    this.turn = false;
  }

  this.setPieces = function (value) {
    this.piecesList = value;
  }

  this.startGame = function (value) {
    this.playing = true;
  }

  this.setPlayer1 = function (value) {
    this.player1 = value;
    this.player1.setFaction("black");
  }

  this.setPlayer2 = function (value) {
    this.player2 = value;
    this.player2.setFaction("red");
  }

  this.setPlayer1Pieces = function (value) {
    this.player1Pieces = value;
  }

  this.setPlayer2Pieces = function (value) {
    this.player2Pieces = value;
  }
  return this;
}*/