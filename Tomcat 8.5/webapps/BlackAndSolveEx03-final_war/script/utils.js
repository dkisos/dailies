/**
 * Created by OferMe on 26-Oct-16.
 */

//-----------------------Alerts-------------------------
function closeAlert(x) {
    var alert = $(x).parent();
    alert.addClass("fadeOut");
    setTimeout(function () {
        alert.remove()
    }, 1000);
}
function showAlert(text, alertClass, animationClass, heightPx) {
    animationClass = animationClass === undefined ? "fadeInDown" : animationClass;
    heightPx = heightPx === undefined ? '' : 'style="height:' + heightPx + 'px"';
    $('<div ' + heightPx + '  class="alert animated ' + animationClass + " " + alertClass + '"> <span class="closebtn" onclick="closeAlert(this)">&times;</span>' + text + '</div>').appendTo($("#alertDiv"));
}

function showAlert2(text, alertClass) {
    $('<div class="alert animated fadeInDown ' + alertClass + '"> <span class="closebtn" onclick="this.parentElement.style.display=' + "'none'" + ';">&times;</span>' + text + '</div>').appendTo($("#alertDiv"));
}

//-----------------------Game/User Info-------------------------

function utils_getGameInfoTrString(gameInfo, index) {
    var IndexTd = index === undefined ? "" : "<td>" + index + "</td>";
    var res = IndexTd + "<td>" + gameInfo.gameTitle + "</td><td>" + gameInfo.uploader + "</td><td>" + gameInfo.numOfPlayers + "/" + gameInfo.maxPlayers + "</td><td>" + gameInfo.maxMoves + "</td><td>" + gameInfo.boardSize.x + "X" + gameInfo.boardSize.y + "</td>";
    return res;
}

function utils_getGameInfo(handleData, optionalGameTitle) {
    $.ajax({
        url: "gamePreview",
        data: {gameTitle: optionalGameTitle},
        success: function (jsonGameInfo) {
            console.log("try3");
            gameInfo = jsonGameInfo;
            handleData(jsonGameInfo);
        }
    });
}

function utils_getUserSessionInfo(showUserDetailsFunction,handleData) {
    $.ajax({
        url: "gameRoom",
        data: {requestType: "userSessionInfo"},
        success: function (jsonUserInfo) {
            userInfo = jsonUserInfo;

            showUserDetailsFunction(jsonUserInfo);

            if(handleData!=undefined) {
                handleData(jsonUserInfo);
            }

        }
    });
}

function utils_showUserDetails(jsonUserInfo) {
    var typeImg = jsonUserInfo.userType === "robot" ? '<img id="playerTypeImg" class="robotPlayer" />' : '<img id="playerTypeImg" class="humanPlayer"/>';
    //$("#user-details").html("Logged In : " + typeImg + " " + jsonUserInfo.userName);
    console.log("UserDetailsTurnImg");
    $('<h4><img class="UserDetailsTurnImg" src="images/my_turn.png" hidden>Logged In:  '+ typeImg + '  '+ jsonUserInfo.userName +'<img class="UserDetailsTurnImg" src="images/my_turn.png" hidden></h4>').appendTo($("#user-details"));
}


////----------------board---------------
function drawColSlices(gameInfo) {
    $("#colSlices").empty();
    var cols = gameInfo.boardSize.y;
    for (var col = 0; col < cols; col++) {
        var colBlocks = gameInfo.colSlices[col];
        colBlocks = colBlocks === undefined ? [col.toString()] : colBlocks;
        var label = document.createElement("LABEL");
        label.className = "colSlicesLabels";
        label.innerHTML = "";
        for (var i = 0; i < colBlocks.length; i++) {
            label.innerHTML += (colBlocks[i] + "<br>");
        }
        $(label).appendTo($("#colSlices"));

    }
}
function drawRowSlices(gameInfo) {
    $("#rowSlices").empty();
    var rows = gameInfo.boardSize.x;
    for (var row = 0; row < rows; row++) {
        var rowBlocks = gameInfo.rowSlices[row];
        rowBlocks = rowBlocks === undefined ? [row.toString()] : rowBlocks;
        var label = document.createElement("LABEL");
        label.innerHTML = "";
        label.className = "rowSlicesLabels";
        for (var i = 0; i < rowBlocks.length; i++) {
            label.innerHTML += (rowBlocks[i] + " ");
        }
        $('<tr><td>' + label.outerHTML + '</td></tr>').appendTo($("#rowSlices"));
    }
}
function showSlices(gameInfo) {
    drawColSlices(gameInfo);
    drawRowSlices(gameInfo);
}
function toggleSelected(cell) {
    cell.toggleClass('unSelected');
    cell.toggleClass('selected');
}
function drawInitialBoard(gameInfo) {
    $("#board").empty();
    var rows = gameInfo.boardSize.x;
    var cols = gameInfo.boardSize.y;
    for (var row = 0; row < rows; row++) {
        var tableRow = '<tr>';
        for (var col = 0; col < cols; col++) {
            tableRow += '<td><button id="' + row + '-' + col + '" class="board-button UndefinedSquareType unSelected"></button></td>';
        }
        tableRow += '</tr>';

        $(tableRow).appendTo($("#board"));
    }
    var buttons = $("button.board-button");
    console.log("try2");
    $.each(buttons, function (index, b) {
        b.onclick = function () {
            toggleSelected($(this));
        }
    });
}
function utils_showInitialBoard(gameInfo) {
    drawColSlices(gameInfo);
    drawRowSlices(gameInfo);
    drawInitialBoard(gameInfo)
}


////----------------------- TEMP----------------------------------------------
function showFakeGameRoomBoard(gameInfo) {

    $("#board").empty();
    var rows = gameInfo.boardSize.x;
    var cols = gameInfo.boardSize.y;
    for (row = 0; row < rows; row++) {
        var tableRow = '<tr>';
        for (col = 0; col < cols; col++) {
            tableRow += '<td><button id="' + row + '-' + col + '" class="board-button unSelected UndefinedSquareType"></button></td>';
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
function drawFakeBoard() {
    var rows = $("#rows").val();
    var cols = $("#cols").val();
    gameInfo = {
        "numOfPlayers": 0,
        "maxPlayers": 2,
        "maxMoves": 15,
        "rowSlices": [],
        "colSlices": [],
        "boardSize": {"x": rows, "y": cols}
    };
    showSlices(gameInfo);
    showFakeGameRoomBoard(gameInfo);
}