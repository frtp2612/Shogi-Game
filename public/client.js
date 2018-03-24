var socket = io();

var container = document.getElementById('container');
var roomName;
var myPiecePossibleMoves;

$(document).ready(function(){
    // HANDLE CLICK EVENTS
    $(document).on('click', '#loginButton', function(){
        var username = $('input').val();
        console.log(username);
        if(username != "") {
            socket.emit("login", username);
        }
    });

    $(document).on('click', '#createRoomButton', function(){
        var roomName = $('.roomName').val();
        //console.log(roomName);
        if(roomName != "") {
            //socket.emit("joinNewRoom", roomName);
            socket.emit("createRoom", roomName);
        }
    });

    $(document).on('click', '#joinRoomButton', function(){
        var roomName = $(this).attr('value');
        //console.log(roomName);
        if(roomName != "") {
            socket.emit("joinRoom", roomName);
            //socket.emit("joinRoom", roomName);
        }
    });

    $(document).on('click', '#startMatchButton', function(){
        socket.emit("matchStart");
    });

    socket.on('turn', function(msg) {
        
        if(msg == "your turn") {
            var moving = false;
            var dropping = false;
            var clickedPiece;
            console.log("your turn");
            $('td').bind('click');
            $('img.own').bind('click');
            $('#capturedBoard.own').bind('click');

            $( "td" ).on('click', function( event ) {
                //event.stopPropagation();
                if(moving == true) {
                    clickedPosition = $(this).attr('data-name');
                    if(clickedPiece != clickedPosition && !$("[data-name=\"" + clickedPosition + "\"]").hasClass('own')) {
                        for(var index in myPiecePossibleMoves) {
                            if(myPiecePossibleMoves[index] == clickedPosition) {
                                socket.emit("moveToNewPosition", clickedPiece, clickedPosition);
                                socket.emit("hideMovements", clickedPiece);
                                moving = false;
                                break;
                            }
                        }
                    } else {
                        console.log('you can t move on your own pieces');
                    }
                } else if(dropping == true) {
                    clickedPosition = $(this).attr('data-name');
                    if(clickedPiece != clickedPosition && !$("[data-name=\"" + clickedPosition + "\"]").hasClass('own')) {
                        for(var index in myPiecePossibleMoves) {
                            if(myPiecePossibleMoves[index] == clickedPosition) {
                                socket.emit("dropToPosition", clickedPiece, clickedPosition);
                                socket.emit("hideDropPositions", clickedPiece);
                                dropping = false;
                                break;
                            }
                        }
                    } else {
                        console.log('you can t move on your own pieces');
                    }
                }
            });

            $('img.own').on('click', function( event ) {
                event.stopPropagation();
                clickedPiece = $(this).parent().attr('data-name');
                if(!$(this).parent().hasClass('active')) {
                    if(moving == false) {
                        socket.emit("showMovements", clickedPiece);
                        moving = true;
                    }
                } else {
                    if(moving == true && $(this).hasClass('clickable')) {
                        clickedPosition = $(this).parent().attr('data-name');
                        socket.emit("moveToNewPosition", clickedPiece, clickedPosition);
                        socket.emit("hideMovements", clickedPiece);
                        moving = false;
                    } else {
                        socket.emit("hideMovements", clickedPiece);
                        moving = false;
                    }
                }
                
            });

            $( "#capturedBoard.own" ).on('click', 'li', function( event ) {
                //event.stopPropagation();
                clickedPiece = $(this).attr('data-name');
                if(moving == false && dropping == false) {
                    socket.emit("showDropPositions", clickedPiece);
                    dropping = true;
                } else {
                    socket.emit("hideDropPositions", clickedPiece);
                    dropping = false;
                }
            });

        } else {
            $('td').unbind('click');
            $('img.own').unbind('click');
            $('#capturedBoard.own').unbind('click');
            console.log("it's your opponent's turn");
        }
    });

    // SOCKET ACTIONS
    socket.on('showRoom', function(roomName) {
        $('.rooms > ul').append("<li>" + roomName + "<button id='joinRoomButton' value='" + roomName + "'>Join Room</button></li>");
    });

    socket.on('displayPage', function(pageContent) {
        $(container).html(pageContent);
    });

    socket.on('connectedUsers', function(playersList) {
        //console.log(playersList);
        var users = "";
        for(var i in playersList) {
            if(playersList[i].insideRoom == true && playersList[i].id != socket.id) {
                users += "<li class='busy'>" + playersList[i].name + "</li>";
            } else if(playersList[i].insideRoom == false && playersList[i].id != socket.id) {
                users += "<li class='idle'>" + playersList[i].name + "</li>";
            }
        }

        $('.connectedUsers > ul').html(users);
    });

    socket.on('rooms', function(roomsList, socketRoom) {
        var rooms = "";
        for(var i in roomsList) {
            if(roomsList[i].connectedUsers < 2) {
                rooms += "<li><span class='room'>" + roomsList[i].name + "</span><span class='createdBy'>Created by " + roomsList[i].player1.name + "</span><span class='connected'>Connected users: " + roomsList[i].connectedUsers + "/2</span><button id='joinRoomButton' value='" + roomsList[i].name + "'>Join Room</button></li>";
            } else {
                rooms += "<li><span class='room'>" + roomsList[i].name + "</span><span class='createdBy'>Created by " + roomsList[i].player1.name + "</span><span class='connected'>Connected users: " + roomsList[i].connectedUsers + "/2</span></li>";
            }
        }

        $('.rooms > ul').html(rooms);
    });

    /*****GAME ACTIONS *******/
    socket.on('displayPieces', function(piecesList) {
        //console.log(piecesList[0]);
        var piece;
        //console.log(piecesList);
        for(var index in piecesList[0]){
            piece = piecesList[0][index];
            $("[data-name=\"" + piece.currentPosition + "\"]").html("<img id='" + piece.id + "' class='own' src='/images/layout/" + piece.name + ".svg'>");
        }

        for(var index in piecesList[1]){
            piece = piecesList[1][index];
            $("[data-name=\"" + piece.currentPosition + "\"]").html("<img id='" + piece.id + "' src='/images/layout/" + piece.name + "Opp.svg'>");
        }
    });

    socket.on('joined', function(msg) {
        console.log(msg);
    });

    socket.on('askToStart', function(msg) {
        console.log(msg);
    });

    socket.on('highlightSelectedPiece', function(position) {
        $("[data-name=\"" + position + "\"]").addClass('active');
    });

    socket.on('removeHighlightSelectedPiece', function(position) {
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

    socket.on('clearBoard', function() {
        $('td').removeClass('possible');
        $('img:not(.own).clickable').removeClass('clickable');
    });

    socket.on('wantToUpgrade', function(piece, clickedPiece, clickedPosition){
        var upgrade = "<div class='modal'><div class='modal-box'><span>Miglioramento Possibile</span><div><img src='/images/layout/"+ piece.name +".svg'></div><div class='to'><img src='/images/layout/arrow.svg'></div><div><img src='/images/layout/" + piece.upgradedName + ".svg'></div><ul><li><button value='Migliora'>Migliora</button></li><li><button value='Annulla'>Annulla</button></li></ul></div></div>";
        $('body').append($(upgrade));
        var choice;
        $( "button" ).on('click', function( event ) {
            var clicked = $(this).val();
            if(clicked == "Migliora") {
                choice = true;
                socket.emit('upgrade', piece, clickedPiece, clickedPosition, choice);
            } else if(clicked == "Annulla"){
                choice = false;
                socket.emit('upgrade', piece, clickedPiece, clickedPosition, choice);
            }
            $('.modal').remove();
        });
        
    });

    socket.on('updatePlayerView', function(piece, oldPosition, newPosition, dropping) {
        $("[data-name=\"" + oldPosition + "\"]").html("");
        if(dropping == true) {
            $("[data-name=\"" + oldPosition + "\"]").remove();
        }
        new Audio("/audio/move.mp3").play();
        if(piece.promoted == true) {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + piece.id + "' class='own' src='/images/layout/" + piece.upgradedName + ".svg'>");
        } else {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + piece.id + "' class='own' src='/images/layout/" + piece.name + ".svg'>");
        }
    });

    socket.on('updateOpponentView', function(piece, oldPosition, newPosition, dropping) {
        $("[data-name=\"" + oldPosition + "\"]").html("");
        if(dropping == true) {
            $("[data-name=\"" + oldPosition + "\"]").remove();
        }
        new Audio("/audio/move.mp3").play();
        if(piece.promoted == true) {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + piece.id + "' src='/images/layout/" + piece.upgradedName + "Opp.svg'>");
        } else {
            $("[data-name=\"" + newPosition + "\"]").html("<img id='" + piece.id + "' src='/images/layout/" + piece.name + "Opp.svg'>");
        }
    });

    socket.on('addPieceToDrops', function(piece) {
        $("#capturedBoard.own").append("<li data-name='" + piece.id + "'><img src='/images/layout/" + piece.name + ".svg'></li>");
    });

    socket.on('addOpponentPieceToDrops', function(piece) {
        $("#capturedBoard.opponent").append("<li data-name='" + piece.id + "'><img src='/images/layout/" + piece.name + "Opp.svg'></li>");
    });

    /****ERRORS HANDLER****/

    socket.on('error', function(msg) {
        console.log(msg);
    });
});