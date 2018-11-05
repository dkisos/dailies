/**
 * Created by OferMe on 24-Oct-16.
 */
var turnCounter = {
    turnsInMove: 0,
    turns:0,

    updateButtons: function () {
        if(this.turnsInMove === 2){
            $("#playTurnBtn").prop("disabled", true);
            $("#finishTurnBtn").addClass("btn-danger");
        }else{
            $("#playTurnBtn").prop("disabled", false);
            $("#playTurnBadge").html("#" + (this.turnsInMove + 1));
            $("#finishTurnBtn").removeClass("btn-danger");
            this.turns === 0 ? $("#undoBtn").prop("disabled", true) : $("#undoBtn").prop("disabled", false);
        }
    },
    addOne: function () {
        if(userInfo.userType=="human") {
            this.turnsInMove++;
            this.turns++;
            this.updateButtons();
        }
    },
    subOne: function () {
        if(userInfo.userType=="human") {
            if(this.turnsInMove>0){
            this.turnsInMove--;
            }
            this.turns--;
            this.updateButtons();
        }
    },
    reset: function () {
        if(userInfo.userType=="human") {
            this.turnsInMove = 0;
            this.updateButtons();
        }
    },
};
function showWinLoseList(srcList,destList) {
   // console.log(src);
   // $('<h1>Winners:</h1><br>').appendTo(destList);

    $.each(srcList||[],function(index,player){
        $('<h4>'+index+'. '+player+'</h4>').appendTo(destList);
    })

}
function resetGame() {
    console.log("resetGame");
    $.ajax({
        url: "gameRoom",
        data: {
            requestType: "resetGame"
        },
        success: function (endGameInfo) {
            console.log("game was reset");
        }
    });
}
function showEndGameInfo(endGameInfo) {

    $("#myPopup").toggleClass("flip show","");
    $("#mainGameDiv *").prop("disabled",true);
    showWinLoseList(endGameInfo.winners,$("#winnersList"));
    showWinLoseList(endGameInfo.losers,$("#losersList"));
    clearInterval(updateGameInfoIntr) ;
    clearInterval(updateTableUsersListIntr);
    clearInterval(isGameEndIntr);
   // setTimeout(resetGame,3000);
    resetGame();
    console.log("resetGame Without Timeout");
}
function getEndGameInfo() {
    $.ajax({
        url: "gameRoom",
        data: {
            requestType: "endGameInfo"
        },
        success: function (endGameInfo) {
           showEndGameInfo(endGameInfo);
        }
    });
}
function getIsGameEnd() {
    $.ajax({
        url: "gameRoom",
        data: {
            requestType: "isGameEnd"
        },
        success: function (isGameEnd) {

            if(isGameEnd==true){
                getEndGameInfo();
            }
        }
    });
}

function playTurn() {
    var selectedSquaresIdList = [];
    var selectedSquaresList = $(".selected");
    console.log(selectedSquaresList);
    $.each(selectedSquaresList || [], function (index, s) {
        selectedSquaresIdList.push(s.id);
    });

    var comment = $("#commentInput").val();
    var squareStatus = $('input[name=squareStatusType]:checked').val();
    if(selectedSquaresIdList.length===0&&userInfo.userType==="human"){
        showAlert("You Have To Choose Squares First.","infoColor");
    }
    else {
        $.ajax({
            url: "gameRoom",
            data: {
                requestType: "playTurn",
                selectedSquaresIdList: selectedSquaresIdList,
                comment: comment,
                newStatus: squareStatus
            },
            success: function (boardAndSlicesInfo) {
                $(".selected").addClass("animated flip");
                setTimeout(function () {showGameRoomBoardAndSlices(boardAndSlicesInfo);},850);

                turnCounter.addOne();
            }
        });
    }
}

function finishTurn() {
    console.log("finishTurn");
    $.ajax({
        url: "gameRoom",
        data: {
            requestType: "finishTurn"
        },
        success: function (boardAndSlicesInfo) {
            showGameRoomBoardAndSlices(boardAndSlicesInfo);
            turnCounter.reset();
            //updateTableUsersListIntr = setInterval(ajaxTableUsersList, refreshRate);
            getIsGameEnd();
        }
    });
}

function undo() {
    $.ajax({
        url: "gameRoom",
        data: {
            requestType: "undo",
        },
        success: function (boardAndSlicesInfo) {
            showGameRoomBoardAndSlices(boardAndSlicesInfo);
            turnCounter.subOne();
        }
    });
}
