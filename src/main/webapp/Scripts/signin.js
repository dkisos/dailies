/**
 * Created by OferMe on 13-May-17.
 */

function signUser() {

    $.ajax({
        url: "/signin",
        type: 'POST',
        data: {
            fname: $("#fname").val(),
            lname: $("#lname").val(),
            email: $("#email").val(),
            password: $("#password").val(),
        },
        success: function (id) {
            console.log(id);
            if (id == null) {
                $('#res').empty();
                $('<h5 style="color: white"> Email already exist.</h5>').appendTo($('#res'));
            }
            else {
               setCookie("id",id,365);
               window.location.replace("index.html")
            }
        }
    });


}