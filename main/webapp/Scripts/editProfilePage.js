/**
 * Created by Ron on 04-Aug-17.
 */

$(function () {
    loadLogedInUserFriends();
    getUserFromSession();
});

function getUserFromSession() {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getUserDataByEmailFromSession"},
        success: function (userData) {
            printUser(userData)
        }
    });
}

function printUser(userData) {
    document.getElementById('fname').value = userData.fname;
    document.getElementById('lname').value = userData.lname;
    document.getElementById('email').value = userData.email;
    if (userData.address != null && userData.address != "")
        document.getElementById('address').value = userData.address;
    if (userData.skills != null && userData.skills != "")
        document.getElementById('skills').value = userData.skills;
    if (userData.about != null && userData.about != "")
        document.getElementById('about').value = userData.about;
    if (userData.profilePic != null && userData.profilePic != "")
        document.getElementById('profilePicDisplay').src = userData.profilePic;
}


/*function readURL(input) {
 if (input.files && input.files[0]) {
 var reader = new FileReader();

 reader.onload = function (e) {
 $('#profilePicDisplay')
 .attr('src', e.target.result)
 .width(150)
 .height(200);
 };
 reader.readAsDataURL(input.files[0]);
 }
 var picElement = document.getElementById('profilePicDisplay');
 if (picElement.style.visibility === 'hidden') {
 picElement.style.visibility = "visible";
 }
 }*/

function registerUpdates() {
    var error = false;
    var image = document.getElementById('profilePic').files[0];
    var cv =  document.getElementById('cv').files[0];
    var formData = new FormData();
    formData.append("profilePic", image);
    formData.append("cv", cv);


    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "registerTextUpdates",
            fname: $("#fname").val(),
            lname: $("#lname").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            address: $("#address").val(),
            skills: $("#skills").val(),
            about: $("#about").val()
        },

        success: function (errorMessege) {
            if (errorMessege !== "") {
                error = true;
                $('#res').empty();
                $('<h5 style="color: white"> Email already exist.</h5>').appendTo($('#res'));
            }
            console.log("first ajax success ");
        },
        error: function () {
            console.log("first ajax error ");
        }
    });

    setTimeout(function () {

        $.ajax({
            url: "profilePageServlet",
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (error === false)
                    window.location.replace("profilePage.html");
            },
            error: function () {
                window.location.replace("profilePage.html");

            }
        });

    }, 3000);

}