
/**
 * Created by OferMe on 06-Oct-16.
 */
var userInfo;
$(function () {
 /*   var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
showAlert(time,"infoColor","flash",100);

    $("#form-login").css("background-color","green");*/

    $("#sing-in-button").prop( "disabled", true );

    $("#username").change(function () {
        console.log("change");
        if ($("#username").val()==="") {

            $("#sing-in-button").prop( "disabled", true );
        }
        else {

            $("#sing-in-button").prop( "disabled", false );
        }
    });
    utils_getUserSessionInfo(showNotLoggedUserDetails,redirect)

})


function showNotLoggedUserDetails(jsonUserInfo) {
    $("#user-details").html("<h4>Unregistered user, please Login.</h4>");
}
function redirect(jsonUserInfo) {
    if (jsonUserInfo.userName!=undefined){//user logged in
        if(jsonUserInfo.gameTitle!=undefined){//user in a middle of a game
            window.location.href="/BlackAndSolveEx03-final_war/gameRoom.html";
        }
        else{
            window.location.href="/BlackAndSolveEx03-final_war/waitingRoom.html"
        }
    }
}
