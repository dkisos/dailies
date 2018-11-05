/**
 * Created by OferMe on 22-Oct-16.
 */

var refreshRate = 2000;
var afterRefresh = 3000;
var gameInfo;
var userInfo;
var updateGameInfoIntr;
var updateTableUsersListIntr;
var isGameEndIntr;
$(function () {

    $.ajaxSetup({cache: false});
    utils_getUserSessionInfo(utils_showUserDetails,setWindowTitle);
    showAlert("Welcome!! Waiting For More Players.","infoColor","rubberBand",100);
    $("#playZone *").prop("disabled", true);
    $("#drawFakeBoard").prop("disabled", false);
    console.log("playZone disabled");
   // utils_getGameInfo(showGameRoomInitialBoardAndSlices);
    //utils_getGameInfo(showGameRoomBoardAndSlices);

    getBoardInfo(showGameRoomBoardAndSlices);

    updateGameInfoIntr = setInterval(showGameDetails, refreshRate);
    updateTableUsersListIntr = setInterval(ajaxTableUsersList, refreshRate);

});

function setWindowTitle(userInfo) {
    if(userInfo.gameTitle!=null) {
        document.title = userInfo.gameTitle;
    }
}

function showGameRoomInitialBoardAndSlices(gameInfo) {
    showSlices(gameInfo);
    getBoardInfo(drawGameRoomBoard);
}

function getBoardInfo(handleData) {
    $.ajax({
        url: "gameRoom",
        data: {
            requestType: "gameBoard"},
        success: function (boardAndSlices) {
            handleData(boardAndSlices);
        }
    });

}

function showTableUsersList(users) {

    $("#playersList").empty();

    $("#usersBadge").html(Object.keys(users).length);
    $.each(users || [], function (name, user) {
        var img = user.type === "robot" ? '<img id="playerTypeImg" class="robotPlayer" />' : '<img id="playerTypeImg" class="humanPlayer" />';
        var currentPlayerImg = user.isCurrentPlayer && gameInfo.isActive ? '<img id="playerTurnImg" src="images/my_turn.png" />' : '';

        if (name === userInfo.userName) {
            user.isCurrentPlayer ? myTurn() : notMyTurn();
        }
        $('<tr><td>' + img + ' ' + name + '</td><td>' + user.numOfMoves + '/' + gameInfo.maxMoves + '</td><td>' + user.score + '</td><td>' + currentPlayerImg + '</td></tr>').appendTo($("#playersList"));
    });
}

function ajaxTableUsersList() {
    $.ajax({
        url: "tableUserslist",
        success: function (users) {
            showTableUsersList(users);
        }
    });
}
function notMyTurn() {
    $(".playElem").prop("disabled", true);
    $(".UserDetailsTurnImg").hide();
    $(".UserDetailsTurnImg").removeClass("animated tada");

}
function myTurn() {

    if(gameInfo.isActive) {
        $(".UserDetailsTurnImg").show();
        $(".UserDetailsTurnImg").addClass("animated tada");
        // clearInterval(updateTableUsersListIntr);
        if (userInfo.userType === "robot") {
            $(".playElem").prop("disabled", true);
            playTurn();
        }
        else {
            $(".playElem").prop("disabled", false);
            turnCounter.updateButtons();
            console.log("turnCounter.updateButtons();");
        }
    }
}

function drawGameRoomBoard(boardAndSlicesInfo) {
    console.log("drawGameRoomBoard");
    $("#board").empty();
    var rows = boardAndSlicesInfo.boardSize.x;
    var cols = boardAndSlicesInfo.boardSize.y;
    var board =boardAndSlicesInfo.boardStringMatrix;
    for (var row = 0; row < rows; row++) {
        var tableRow = '<tr>';

        for (var col = 0; col < cols; col++) {
            var square = board[row][col];
            var status = square === "X" ? "BlackSquareType" : square === " " ? "WhiteSquareType" : "UndefinedSquareType";
            var animation = status ==="UndefinedSquareType"?"":" animated flip"
            tableRow += '<td><button id="' + row + '-' + col + '" class="board-button ' + status + ' unSelected "></button></td>';
        }
        tableRow += '</tr>';

        $(tableRow).appendTo($("#board"));
    }
    var buttons = $("button.board-button");
    $.each(buttons, function (index, b) {
        b.onclick = function () {
            toggleSelected($(this));
        }
    });
}
function drawGameRoomRowSlices(boardAndSlicesInfo) {
    console.log("drawGameRoomRowSlices");
    $("#rowSlices").empty();
    var rows = boardAndSlicesInfo.boardSize.x;
    for (var row = 0; row < rows; row++) {
        var rowBlocks = boardAndSlicesInfo.slicesInfo.rowSlicesStrings[row];
        rowBlocks = rowBlocks === undefined ? [row.toString()] : rowBlocks;
        var label = document.createElement("LABEL");
        label.innerHTML = "";
        label.className = "rowSlicesLabels";

        for (var i = 0; i < rowBlocks.length; i++) {
            var res =boardAndSlicesInfo.slicesInfo.rowsPerfectBlocks[row][i]==true?'<span style="color: red">'+rowBlocks[i]+' </span>':rowBlocks[i] + " ";
            label.innerHTML += res;
        }
        $('<tr><td>' + label.outerHTML + '</td></tr>').appendTo($("#rowSlices"));
    }
}
function drawGameRoomColSlices(boardAndSlicesInfo) {
    console.log("drawGameRoomColSlices");
    $("#colSlices").empty();
    var cols = boardAndSlicesInfo.boardSize.y;
    for (var col = 0; col < cols; col++) {
        var colBlocks = boardAndSlicesInfo.slicesInfo.colSlicesStrings[col];
        colBlocks = colBlocks === undefined ? [col.toString()] : colBlocks;
        var label = document.createElement("LABEL");
        label.className = "colSlicesLabels";
        label.innerHTML = "";
        for (var i = 0; i < colBlocks.length; i++) {
            var res =boardAndSlicesInfo.slicesInfo.colsPerfectBlocks[col][i]==true?'<span style="color: red">'+colBlocks[i]+' <br></span>':colBlocks[i] + "<br>";
            label.innerHTML += res;
        }
        $(label).appendTo($("#colSlices"));

    }
}
function drawGameRoomSlices(boardAndSlicesInfo) {
    drawGameRoomRowSlices(boardAndSlicesInfo);
   // drawGameRoomRowSlices(perfectBlocksInfo.rowSlicesStrings,perfectBlocksInfo.rowsPerfectBlocks);

    drawGameRoomColSlices(boardAndSlicesInfo);
  //  drawGameRoomColSlices(perfectBlocksInfo.colSlicesStrings,perfectBlocksInfo.colsPerfectBlocks)
}
function showGameRoomBoardAndSlices(boardAndSlicesInfo) {
    drawGameRoomSlices(boardAndSlicesInfo);
   // drawGameRoomSlices(boardAndSlicesInfo.slicesInfo);
    drawGameRoomBoard(boardAndSlicesInfo);
}

function showGameDetails() {
   var showGameInfo= function(_gameInfo) {
        $("#gameDetails").empty();
        if (_gameInfo.maxPlayers === _gameInfo.numOfPlayers) {
            startGame();
        }
        else {
            $("<tr><th style='color:red;'> Wait!</th><th>" + _gameInfo.gameTitle + "</th><th> Players: " + _gameInfo.numOfPlayers + "/" + _gameInfo.maxPlayers + "</th><th>" + "Moves :" + _gameInfo.maxMoves + "</th></tr>").appendTo($("#gameDetails"));
        }
    }
   utils_getGameInfo(showGameInfo);
}

function startGame() {
    clearInterval(updateGameInfoIntr);
    $("<tr><th style='color:green;'> Active!</th><th>" + userInfo.gameTitle + "</th><th>Uploaded By: "+gameInfo.uploader+"</th><th> Players: " +
        gameInfo.numOfPlayers + "/" + gameInfo.maxPlayers + "</th><th>" + "Moves :" + gameInfo.maxMoves + "</th><th>Size: "+
        gameInfo.boardSize.x+"X"+gameInfo.boardSize.y+"</th></tr>").appendTo($("#gameDetails"));
    $("#playZone *").prop("disabled", false);
    $("#alertDiv").empty();
    showAlert("Game Started !!!","successColor","flash",100);
    isGameEndIntr=setInterval(getIsGameEnd,refreshRate);
}





