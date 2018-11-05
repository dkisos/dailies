/**
 * Created by Ron on 19-May-17.
 */

$(function () {
    document.getElementById("file2").onchange = function () {
        document.getElementById("uploadPictureForm").submit();
        window.location.replace("profilePage.html");
    };
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getUserName"},
        success: function (userName) {
            document.getElementById('UserName').innerHTML = userName;
        }
    });
});

