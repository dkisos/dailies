/**
 * Created by Ron on 31-Aug-17.
 */

var printIndex;
$(function () {
    var currentSearch = getUrlParameter("search_for");
    if(currentSearch != null) {
        $.ajax({
            url: "searchServlet",
            type: 'POST',
            data: {request_type: "searchUsersAndBusinesses",
                searchText:currentSearch },
            success: function (usersAndBusinesses) {
                if(usersAndBusinesses != null || usersAndBusinesses.length !=0) {
                    printIndex = 0;
                    usersAndBusinesses.forEach(printUsersAndBusinesses);
                }
                else{
                    alert("No result showing for "+ "'" +currentSearch + "'");
                }
            }
        });
    }
    showSessionUserProfilePic();
    loadLogedInUserFriends();
});

function printUsersAndBusinesses(toPrint) {
    printIndex = printIndex +1;
    var picUrl = "Resources/empty_profile.jpg";
    if (toPrint.profilePic != null)
        picUrl = toPrint.profilePic;
    var img =
        '<img id="smallProfilePic"' +
        'src="'+ picUrl +'"' +
        'class="img-rounded" alt="" style="margin-right: 3px" width="25" height="25">'
    if (toPrint.fname != null) {
        var name = toPrint.fname + " " + toPrint.lname;
        var linkToUser = getLinkWithStyle(printIndex + "Form", "profilePageServlet", name , "float: left", [["request_type", "loadUserProfile"], ["user_id", toPrint.id]]);
        var currText2 = img + linkToUser + "<span style ='float: left; margin-left: 10px'> Email: " + toPrint.email + "</span>";
        $('#resultsPanelBody').append('<div><p style ="float: left">' + currText2 + '</p></div><br>');
        $('#resultsPanelBody').append('<hr class="hr-soften">');
    }
    else {
        var linkToBusiness = getLinkWithStyle(printIndex + "Form", "businessPage", toPrint.name, "float: left", [["request_type", "loadBusinessPage"], ["business_id", toPrint.id]]);
        var currText = img+ linkToBusiness + "<span style ='float: left; margin-left: 10px'> City: " + toPrint.city + "</span><span style ='float: left ; margin-left: 10px'> Number: " + toPrint.phone + "</span>";
        $('#resultsPanelBody').append('<div><p style ="float: left">' + currText + '</p></div><br>');
        $('#resultsPanelBody').append('<hr class="hr-soften">');
    }
}