/**
 * Created by OferMe on 04-Oct-16.
 */
var refreshRate = 2000;
var userInfo="";

$(function () {
    //prevent IE from caching ajax calls
    $.ajaxSetup({cache: false});

    setFileUpload()
    utils_getUserSessionInfo(utils_showUserDetails);

    //The users list is refreshed automatically every second
    setInterval(ajaxUsersList, refreshRate);
    setInterval(ajaxGamesList, refreshRate);
    //The chat content is refreshed only once (using a timeout) but
    //on each call it triggers another execution of itself later (1 second later)
    // triggerAjaxChatContent();
    $("#enterGameButton").prop( "disabled", true );
});
function setFileUpload () {
        $('input[type="file"]').ajaxfileupload({
            'action': 'testServlet',
            'onComplete': function (data) {
                if (data.status==false){
                    showAlert("File must be with .xml extension.","errorColor","flash");
                }
                else {
                    $.each(data || [], function (index, game) {
                        showAlert(game.fileName + " : " + game.msg, game.msgStatus);
                    });
                }
            },
            'onStart': function () {
                console.log("onStart");
            }
        });
}

function ajaxGamesList() {
    $.ajax({
        url: "gameslist",
        success: function (games) {
            refreshGamesList(games);
        }
    });
}

function refreshGamesList(games) {
    $("#gamesList").empty();
    $("#gamesBadge").html(Object.keys(games).length);
    var index = 1;
    $.each(games || [], function (name, gameInfo) {

        gameInfo.index = index;
        var tableRow = document.createElement("tr");
        tableRow.id = name.replace(" ", "_");
        tableRow.innerHTML=utils_getGameInfoTrString(gameInfo,index);
        tableRow.onclick = function () {
            $("#gamePreview").empty();
            $('<thead>'+$("#gameTableHead").html()+'</thead><tbody>'+this.innerHTML+'</tbody>').appendTo($("#gamePreview"));
            showGamePreview(gameInfo);

        }
        /*tableRow.innerHTML = "<td>" + index + "</td><td>" + name + "</td><td>"+gameInfo.uploader+"</td><td>" + gameInfo.numOfPlayers + "/" + gameInfo.maxPlayers +
            "</td><td>" + gameInfo.maxMoves + "</td><td>"+gameInfo.boardSize.x+"X"+gameInfo.boardSize.y+"</td>;"*/
        //showAlert("im here","infoColor");
       /* tableRow.innerHTML=utils_getGameInfoTrString(gameInfo,index);*/
        $(tableRow).appendTo($("#gamesList"));
        index++;
    });
}


function ajaxUsersList() {
    $.ajax({
        url: "userslist",
        data:{requestType:"getUsers"},
        success: function (users) {
            console.log("here");
            refreshUsersList(users);
        }
    });
}

function refreshUsersList(users) {

    //clear all current users
    $("#userslist").empty();
    $("#usersBadge").html(users.length);
    $.each(users || [], function (index,user) {
        var img;
        if (user.userType === "robot") {
            img = '<img id="playerTypeImg" class="robotPlayer" />';
        }
        else {
            img = '<img id="playerTypeImg" class="humanPlayer" />';
        }
        $('<li id ="' + user.userName + '" >' + img + ' ' + user.userName + '</li>').appendTo($("#userslist"));
    });
}

/*function drawColSlices(cols, colSlices) {

    for (col = 0; col < cols; col++) {

        var colBlocks = colSlices[col];

        var lable = document.createElement("LABEL");
        lable.innerHTML = "";
        lable.style.width = "20px";
        lable.style.textAlign = "center";
            for(k=0;k<colBlocks.length;k++) {
                lable.innerHTML += (colBlocks[k] + "<br>");
            }
        $(lable).appendTo($("#colSlices"));

    }
}
function drawRowSlices(rows, rowSlices) {
    for (row = 0; row < rows; row++) {
        var rowBlocks = rowSlices[row];
        var lable = document.createElement("LABEL");
        lable.innerHTML = "";
        lable.style.height = "15px";
        lable.style.textAlign = "center";
        for(k=0;k<rowBlocks.length;k++) {
            lable.innerHTML += (rowBlocks[k] + " ");
        }
        $(lable).appendTo($("#rowSlices"));
        $('<br>').appendTo($("#rowSlices"));
    }
}
function drawGameRoomBoard(rows, cols) {
    for (row = 0; row < rows; row++) {
        var tableRow = '<tr>';
        for (col = 0; col < cols; col++) {
            tableRow += '<td><button class="board-button"></button></td>';
        }
        tableRow += '</tr>';

        $(tableRow).appendTo($(boardPreview));
    }
}
function showBoard(boardPreview) {
    var rows = boardPreview.boardSize.x;
    var cols = boardPreview.boardSize.y;

    drawColSlices(cols, boardPreview.colSlices);
    drawRowSlices(rows, boardPreview.rowSlices);
    drawGameRoomBoard(rows, cols);
}*/
function showGamePreview(gameInfo) {

    if (gameInfo.isActive) {
        var fullImg = '<img id="fullGameImg" class="fullBoardImg"> </img>';
        $("#board").empty();
        $(fullImg).appendTo($("#board"));
        $("#enterGameButton").prop( "disabled", true );
    }
    else {
        $("#enterGameButton").prop( "disabled", false );
        utils_showInitialBoard(gameInfo);
    }
    $("#sendedSelectedGameTitle").val(gameInfo.gameTitle);

}





