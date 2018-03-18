var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

var connectedUsers = document.getElementById('connectedUsers');

var rooms = document.getElementById('rooms');
var roomBox = document.getElementById('roomBox');

var roomPlayers = document.getElementById('roomPlayers');

// store new player elements
var modalBox = document.getElementById('modalBox');
var confirmButton = document.getElementById('confirmButton');
var playerNameTextField = document.getElementById('playerName');
var roomNameTextField = document.getElementById('roomName');

var playerName;
var roomName;

var client;


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

var oldBoardPositionY, oldBoardPositionX;

var clickedPiece;
var clickedPosition;

var moving = false;

var playerFaction;

$(document).ready(function(){

    $(document).on('click', '#createRoomButton', function(){
        roomName = roomNameTextField.value;
        if(roomName.value != "") {
            socket.emit("createRoom", roomName);
        }
    });

    $(document).on('click', "#rooms > li", function(){
        client = $(this).attr('id');
        roomName = $('.roomName', this).text();
        console.log(roomName);
        if(client != socket.id){
            socket.emit('joinRoom', roomName, playerName, client);
        } else {
            alert("you cannot join your own room");
        }
    });

    socket.on('connect', function() {
        socket.emit("join");
    });

    socket.on('placePieces', function(piecesList) {
        //console.log(piecesList[0]);
        var piece;
        //console.log(piecesList);
        for(index in piecesList[0]){
            piece = piecesList[0][index];
            $("[data-name=\"" + piece.currentPosition + "\"]").html("<img id='" + piece.id + "' class='own' src='/static/assets/layout/" + piece.pieceName + ".svg'>");
        }

        for(index in piecesList[1]){
            piece = piecesList[1][index];
            $("[data-name=\"" + piece.currentPosition + "\"]").html("<img id='" + piece.id + "' src='/static/assets/layout/" + piece.pieceName + ".svg'>");
        }
    });
    
    socket.on('success', function(player) {
        //modalBox.remove();
        //console.log(player);
        playerFaction = player.faction;
    });
    
    socket.on('error', function(msg) {
        console.log(msg);
    });
    
    socket.on('connected', function(player) {
        $(connectedUsers).append("<li id='" + player.id + "'>" + player.playerName + "</li>");
        console.log("A new player has connected: " + player.playerName);
    });
    
    socket.on('newRoom', function(roomName, room) {
        $(rooms).append("<li id='" + room.id + "'><ul><li>" + roomName+ "</li><li>" + room.player1.playerName + "</li></ul></li>");
    });

    socket.on('roomJoined', function(playerName) {
        console.log(playerName + " has joined your room");
    });

    socket.on('enterRoom', function(player, roomId) {

        playerFaction = player.faction;

        // hide useless contents
        $(connectedUsers).hide();
        $(roomBox).hide();
        $(rooms).hide();

        // generate the game board
        //generateBoard();

        // request the pieces list
        socket.emit("requestPieces", roomId);

        // update partecipants list
        //socket.emit("updatePartecipants", player.playerName, roomId);
    });

    socket.on('requestedPieces', function(piecesList){
        placePieces(piecesList);
    });

    socket.on('showPartecipants', function(playerName) {
        $(roomPlayers).append("<p>" + playerName + "</p>");
    });


    socket.on('turn', function(room, msg) {
        //console.log(room);
        //if(room.player1.id == socket.id && room.turn == room.player1.faction) {
            //console.log(room.turn);
            console.log(msg);
        if(msg == "your turn") {
            $('td').bind('click');
            $('img').bind('click');

            $( "table" ).on('click', 'td', function( event ) {
                //event.stopPropagation();
                clickedPosition = $(this).attr('data-name');
                if(moving == true) {
                    if(clickedPiece != clickedPosition) {
                        for(var index in myPiecePossibleMoves) {
                            if(myPiecePossibleMoves[index] == clickedPosition) {
                                console.log(clickedPosition);
                                socket.emit("moveToNewPosition", clickedPiece, clickedPosition, room);
                                socket.emit("hideMovements", clickedPiece, room);
                                moving = false;
                                break;
                            }
                        }
                    }
                }
            });

            $( "img" ).on('click', function( event ) {
                if(!$(this).parent().hasClass('active') && $(this).hasClass('own')) {
                    if(moving == false) {
                        clickedPiece = $(this).parent().attr('data-name');
                        socket.emit("showMovements", clickedPiece, $(this).attr('id'), room);
                        console.log(clickedPiece);
                        moving = true;
                    }
                } else {
                    if(moving == true && $(this).hasClass('clickable')) {
                        clickedPosition = $(this).parent().attr('data-name');
                        socket.emit("moveToNewPosition", clickedPiece, clickedPosition, room);
                        socket.emit("hideMovements", clickedPiece, room);
                        moving = false;
                    } else {
                        socket.emit("hideMovements", clickedPiece, room);
                        moving = false;
                    }
                }
                
            });

        } else {
            $('td').unbind('click');
            $('img').unbind('click');
            console.log("it's your opponent's turn");
        }
    });

    /**GAME LOGIC */
    socket.on('showSelectedPiece', function(position) {
        $("[data-name=\"" + position + "\"]").addClass('active');
    });

    socket.on('hideSelectedPiece', function(position) {
        $("[data-name=\"" + position + "\"]").removeClass('active');
        $('td').removeClass('possible');
        $('img:not(.own).clickable').removeClass('clickable');
    });

    socket.on('showSelectedPieceMovements', function(piecePossibleMoves) {
        myPiecePossibleMoves = piecePossibleMoves;
        for(var index in piecePossibleMoves) {
            $("[data-name=\"" + piecePossibleMoves[index] + "\"]").addClass("possible");
            $("[data-name=\"" + piecePossibleMoves[index] + "\"] > img").addClass("clickable");
        }
    });

    socket.on('wantToUpgrade', function(playersRoom, selectedPiece, clickedPiece, clickedPosition){
        var upgrade = "<div class='modal'><div class='modal-box'><span>Miglioramento Possibile</span><div><img src='/static/assets/layout/"+ selectedPiece.pieceName +".svg'></div><div class='to'><img src='/static/assets/layout/arrow.svg'></div><div><img src='/static/assets/layout/" + selectedPiece.pieceUpgradedName + ".svg'></div><ul><li><button value='Migliora'>Migliora</button></li><li><button value='Annulla'>Annulla</button></li></ul></div></div>";
        $('body').append($(upgrade));
        var choice;
        $( "button" ).on('click', function( event ) {
            var clicked = $(this).val();
            if(clicked == "Migliora") {
                choice = true;
                socket.emit('upgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition, choice);
            } else if(clicked == "Annulla"){
                choice = false;
                socket.emit('upgrade', playersRoom, selectedPiece, clickedPiece, clickedPosition, choice);
            }
            $('.modal').remove();
        });
        
    });

    socket.on('updatePlayerView', function(selectedPiece, oldPosition, newPosition) {
        $("[data-name=\"" + oldPosition + "\"]").html("");
        if(selectedPiece.upgraded == true) {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + selectedPiece.id + "' class='own' src='/static/assets/layout/" + selectedPiece.pieceUpgradedName + ".svg'>");
        } else {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + selectedPiece.id + "' class='own' src='/static/assets/layout/" + selectedPiece.pieceName + ".svg'>");
        }
    });

    socket.on('updateOpponentView', function(selectedPiece, oldPosition, newPosition) {
        $("[data-name=\"" + oldPosition + "\"]").html("");
        if(selectedPiece.upgraded == true) {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + selectedPiece.id + "' src='/static/assets/layout/" + selectedPiece.pieceUpgradedName + ".svg'>");
        } else {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + selectedPiece.id + "' src='/static/assets/layout/" + selectedPiece.pieceName + ".svg'>");
        }
    });

    socket.on('addPieceToDrops', function(room, piece) {
        console.log(piece);
        $("#capturedBoard.own").append("<li><img id='" + piece.id + "' src='/static/assets/layout/" + piece.pieceName + ".svg'></li>");
    });

    socket.on('addOpponentPieceToDrops', function(room, piece) {
        console.log(piece);
        $("#capturedBoard.opponent").append("<li><img id='" + piece.id + "' src='/static/assets/layout/" + piece.pieceName + ".svg'></li>");
    });
});

var board = document.getElementById('board');
var capturedBoard = document.getElementById('capturedBoard');
var boardStructure;
const boardX = 9;
const boardY = 9;
var coordinatePair;
var r, c;
var index = 0;

var check;
var selectedPiece;
var selectedPosition;
var boardPositionY;
var newPosition;
var playerId;
var pieces;

function resetBoard() {
    $('td').removeClass('possible');
    $('img.enemy.clickable').removeClass('clickable');
}

function hover(element, coordinates){
    coordinatePair = coordinates.split("-");
    r = coordinatePair[0];
    c = coordinatePair[1];

    console.log("Sei nella casella: " + r + " - " + c);
}
