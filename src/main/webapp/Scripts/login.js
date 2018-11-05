/**
 * Created by User on 06/10/2016.
 */

$(function () {
$("body").hide();
    $.ajax({
        url: "login",
        type: 'POST',
        data: {
            request_type: "setDBPath",
        },
        success: function (dbPath) {
            console.log(dbPath);
            console.log("seccess");

        }
    });

    if(document.cookie) {
        loginByCookie();
    }
    else {
        $("body").show();
    }
});

function login() {
    $.ajax({
        url: "login",
        type: 'POST',
        data: {
            request_type: "Login",
            username: $("#username").val(),
            password: $("#password").val()
        },
        success: function (validUser) {
            if (validUser == 0) {
                document.getElementById("errorField").innerHTML = "Username or password are not valid";
                document.getElementById("errorField").style.color = '#F8F8FF';
            }
            else {
                console.log(validUser);
                if(!document.cookie){setCookie("id",validUser,365);}
                window.location.replace("searchAndFeed.html");
            }
        }
    });
}
