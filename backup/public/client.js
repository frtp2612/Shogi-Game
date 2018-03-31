var socket = io();

const container = document.getElementById("container");
const boardCoordinates = Array("A", "B", "C", "D", "E", "F", "G", "H", "I");
var roomName;
var possibleMoves;

function convertPosition(position) {
    var coordinate = position.split("-");
  
    var r = boardCoordinates[8 - boardCoordinates.indexOf(coordinate[0])];
    var c = 10 - parseInt(coordinate[1]);
  
    var piecePosition = r + "-" + c;
    return piecePosition;
}

$(document).ready(function(){
    // HANDLE CLICK EVENTS
    $(document).on("click", "#loginButton", function(){
        var username = $("input").val();
        if(username != "") {
            socket.emit("login", username);
        }
    });

    $(document).on("click", "#registerButton", function(){
        var username = $("input.username").val();
        var email = $("input.email").val();
        var password = $("input.password").val();
        if(username != "" && email != "" && password != "") {
            socket.emit("register", username, password, email);
        }
    });

    $(document).on("click", "a.register", function(){
        socket.emit("changePage", "register");
    });

    $(document).on("click", "a.forgot", function(){
        socket.emit("changePage", "forgot");
    });

    $(document).on("click", "a.login", function(){
        socket.emit("changePage", "login");
    });

    $(document).on("click", ".rules", function() {
        socket.emit("rules");
    });

    $(document).on("click", ".close", function() {
        $(".modal").remove();
    });

    $(document).on("click", "#createRoomButton", function(){
        var roomName = $(".roomName").val();
        //console.log(roomName);
        if(roomName != "") {
            //socket.emit("joinNewRoom", roomName);
            socket.emit("createRoom", roomName);
        }
    });

    $(document).on("click", "#joinRoomButton", function(){
        var roomName = $(this).attr("value");
        //console.log(roomName);
        if(roomName != "") {
            socket.emit("joinRoom", roomName);
            //socket.emit("joinRoom", roomName);
        }
    });

    $(document).on("click", "#startMatchButton", function(){
        socket.emit("matchStart");
        $(this).remove();
    });

    socket.on("turn", function(msg) {
        var moving = false;
        var dropping = false;
        var selectedPiece;

        if(msg == "your turn") {

            $(".turn").text(msg);

            $("td").bind("click");
            $("#capturedBoard.own").bind("click");

            $("td").on("click", function( event ) {

                if(moving == false && dropping == false) {
                    if($(this).children().length > 0) {
                        if($('> img', this).hasClass('own')) {
                            selectedPiece = $(this).attr("data-name");
                            socket.emit("movements", selectedPiece);
                            moving = true;
                        }
                    }
                } else if(moving == true && dropping == false){
                    var clickedPosition = $(this).attr("data-name");
                    if(selectedPiece != clickedPosition) {
                        if(possibleMoves != undefined && jQuery.inArray(clickedPosition, possibleMoves) > -1){
                            socket.emit("move", selectedPiece, clickedPosition);
                            socket.emit("hideMovements", selectedPiece);
                            moving = false;
                        }
                    } else if(selectedPiece == clickedPosition) {
                        socket.emit("hideMovements", selectedPiece);
                        moving = false;
                    }
                }

                if(dropping == true && moving == false) {
                    var clickedPosition = $(this).attr("data-name");
                    if(selectedPiece != clickedPosition && !$("[data-name=\"" + clickedPosition + "\"]").hasClass("own")) {
                        if(possibleMoves != undefined && jQuery.inArray(clickedPosition, possibleMoves) > -1) {
                            socket.emit("drop", selectedPiece, clickedPosition);
                            socket.emit("hideDropPositions", selectedPiece);
                            dropping = false;
                        }
                    } else {
                    }
                }
            });
    
            $( "#capturedBoard.own" ).on("click", "li", function( event ) {
                selectedPiece = $(this).attr("data-name");
                if(moving == false && dropping == false) {
                    socket.emit("showDrop", selectedPiece);
                    dropping = true;
                } else {
                    socket.emit("hideDrop", selectedPiece);
                    dropping = false;
                }
            });
        } else {

            $("td").unbind("click");
            $("#capturedBoard.own").unbind("click");

            $(".turn").text("Wait for your opponent to move...");

        }
    });

    // SOCKET ACTIONS
    socket.on("showRoom", function(roomName) {
        $(".rooms > ul").append("<li>" + roomName + "<button id='joinRoomButton' value='" + roomName + "'>Join Room</button></li>");
    });

    socket.on("displayPage", function(pageContent) {
        $(container).html(pageContent);
    });

    socket.on("connectedUsers", function(playersList) {
        //console.log(playersList);
        var users = "";
        for(var i in playersList) {
            if(playersList[i].insideRoom == true && playersList[i].id != socket.id) {
                users += "<li class='busy'>" + playersList[i].name + "</li>";
            } else if(playersList[i].insideRoom == false && playersList[i].id != socket.id) {
                users += "<li class='idle'>" + playersList[i].name + "</li>";
            }
        }

        $(".connectedUsers > ul").html(users);
    });

    socket.on("rooms", function(roomsList, socketRoom) {
        var rooms = "";
        for(var i in roomsList) {
            if(roomsList[i].connectedUsers < 2) {
                rooms += "<li><span class='room'>" + roomsList[i].name + "</span><span class='createdBy'>Created by " + roomsList[i].player1.name + "</span><span class='connected'>Connected users: " + roomsList[i].connectedUsers + "/2</span><button id='joinRoomButton' value='" + roomsList[i].name + "'>Join Room</button></li>";
            } else {
                rooms += "<li><span class='room'>" + roomsList[i].name + "</span><span class='createdBy'>Created by " + roomsList[i].player1.name + "</span><span class='connected'>Connected users: " + roomsList[i].connectedUsers + "/2</span></li>";
            }
        }

        $(".rooms > ul").html(rooms);
    });

    socket.on("displayRules", function(element) {
        $("body").append($(element));
    });
    /*****GAME ACTIONS *******/

    socket.on('updateTopBar', function(who, player) {
        $(".top-bar > ." + who).text(player);
    });

    socket.on("displayPieces", function(piecesList) {
        //console.log(piecesList[0]);
        var piece;
        //console.log(piecesList);
        for(var index in piecesList){
            piece = piecesList[index];
            if(piece.property == "player1"){
                $("[data-name=\"" + piece.currentPosition + "\"]").html("<img class='own' src='/images/layout/" + piece.name + ".svg'>");
            } else {
                $("[data-name=\"" + piece.currentPosition + "\"]").html("<img src='/images/layout/" + piece.name + "Opp.svg'>");
            }
        }
    });

    socket.on("joined", function(msg) {
        console.log(msg);
    });

    socket.on("askToStart", function(msg) {
        $(".turn").html(msg);
    });

    socket.on("showButton", function(element) {
        $(".turn").html(element);
    });

    socket.on("highlightSelectedPiece", function(position) {
        $("[data-name=\"" + position + "\"]").addClass("active");
    });

    socket.on("removeHighlightSelectedPiece", function(position) {
        $("[data-name=\"" + position + "\"]").removeClass("active");
        $("td").removeClass("possible");
        $("img:not(.own).clickable").removeClass("clickable");
    });

    socket.on("showMovements", function(moves) {
        possibleMoves = moves;
        for(var index in moves) {
            $("[data-name=\"" + moves[index] + "\"]").addClass("possible");
            $("[data-name=\"" + moves[index] + "\"] > img").addClass("clickable");
        }
    });

    socket.on("clearBoard", function() {
        $("td").removeClass("possible");
        $("img:not(.own).clickable").removeClass("clickable");
    });

    socket.on("clearAll", function() {
        $("td").html("");
    });

    socket.on("endGame", function(msg, img) {
        var win = "<div class='modal'><div class='modal-box'><span>You " + msg +"</span><div class='end'><img src='/images/layout/"+ img +".svg'></div><button value='Close' class='close'>Close</button></div></div>";
        var lose = "<div class='modal'><div class='modal-box'><span>You " + msg +"</span><ul><li><button value='Rematch'>Rematch</button></li><li><button value='Close' class='close'>Close</button></li></ul></div></div>";
        if(msg == "won") {
            $("body").append($(win));
        } else {
            $("body").append($(lose));
        }
    });

    socket.on("wantToUpgrade", function(piece, opponentPiece, position){
        var upgrade = "<div class='modal'><div class='modal-box'><span>Promotion Possibile</span><div><img src='/images/layout/" + piece.name + ".svg'></div><div class='to'><img src='/images/layout/arrow.svg'></div><div><img src='/images/layout/" + piece.upgradedName + ".svg'></div><ul><li><button value='Promote'>Promote</button></li><li><button value='Close'>Close</button></li></ul></div></div>";
        $("body").append($(upgrade));
        var choice;
        $( "button" ).on("click", function( event ) {
            var clicked = $(this).val();
            if(clicked == "Promote") {
                choice = true;
                socket.emit("upgrade", piece, opponentPiece, position, choice);
            } else if(clicked == "Close"){
                choice = false;
                socket.emit("upgrade", piece, opponentPiece, position, choice);
            }
            $(".modal").remove();
        });
    });

    socket.on("updatePlayerView", function(piece, oldPosition, newPosition, dropping) {
        if(dropping == true) {
            $("#capturedBoard.own > [data-name=\"" + oldPosition + "\"]").remove();
        } else {
            $("[data-name=\"" + oldPosition + "\"]").html("");
        }
        new Audio("/audio/move.mp3").play();
        if(piece.promoted == true) {
            $("[data-name=\"" + newPosition + "\"]").html("<img class='own' src='/images/layout/" + piece.upgradedName + ".svg'>");
        } else {
            $("[data-name=\"" + newPosition + "\"]").html("<img class='own' src='/images/layout/" + piece.name + ".svg'>");
        }
    });

    socket.on("updateOpponentView", function(piece, oldPosition, newPosition, dropping) {
        
        if(dropping == true) {
            $("#capturedBoard.opponent > [data-name=\"" + oldPosition + "\"]").remove();
        } else {
            $("[data-name=\"" + oldPosition + "\"]").html("");
        }
        new Audio("/audio/move.mp3").play();
        if(piece.promoted == true) {
            $("[data-name=\"" + newPosition + "\"]").html("<img src='/images/layout/" + piece.upgradedName + "Opp.svg'>");
        } else {
            $("[data-name=\"" + newPosition + "\"]").html("<img src='/images/layout/" + piece.name + "Opp.svg'>");
        }
    });

    socket.on("addPieceToDrops", function(piece) {
        $("#capturedBoard.own").append("<li data-name='" + piece.id + "'><img src='/images/layout/" + piece.name + ".svg'></li>");
    });

    socket.on("addOpponentPieceToDrops", function(piece) {
        $("#capturedBoard.opponent").append("<li data-name='" + piece.id + "'><img src='/images/layout/" + piece.name + "Opp.svg'></li>");
    });

    /****ERRORS HANDLER****/

    socket.on("error", function(msg) {
        console.log(msg);
    });
});