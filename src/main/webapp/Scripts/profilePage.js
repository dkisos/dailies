/**
 * Created by Ron on 19-May-17.
 */

var currentUserShown;
var AddFriendBtn = $('<a href="#" id="addFriendButton" onclick="addAsFriend()">Add As Friend</a>');
var RemoveFriendBtn = $('<a href="#" id="removeFriendButton" onclick="removeFriend()">Remove Friend</a>');
var PendingBtn = $('<a href="#" id="pendingButton" disabled="true">Pending</a>');

$(function () {
    var userId;
    userId = getUrlParameter('user_id');
    $("#editProfileBtn").addClass("disabled");
    if (userId == null) {
        getUserFromSession();
    }
    else {
        getUserFromUrlId(userId);
    }
    loadLogedInUserFriends();
    checkIfPendingFriendRequest(userId);
    if ($(this).find("AddFriendBtn")) {
        checkIfFriends();
    }
});

function insertAddFriendButton() {
    $("#moreDropDown").append(
        '<li><a href="#" id="addFriendButton" onclick="addAsFriend()">Add As Friend</a></li>');
}

function isOwnProfile(userId) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "checkIfMyProfile",
            profile_id: userId
        },
        success: function (flag) {
            if (falge == 1)
                $("#AddFriendBtn").hide();
        }
    });
}

function checkIfFriends() {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getFriends"},
        success: function (friendListWithLogedInData) {
            if (friendListWithLogedInData != null)
                friendListWithLogedInData.forEach(checkIfFriendHelper);
        }
    });
}

function checkIfFriendHelper(friend) {
    var pair = friend;
    var userData = pair.left;
    var isLogedIn = pair.right;
    if (userData.id == currentUserShown.id) {
        $("#addFriendButton").replaceWith(RemoveFriendBtn);
        $("#friendshipBtn").removeClass("disabled");
    }
}

function checkIfPendingFriendRequest(userID) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data:
            {
                request_type: "checkIfPendingRequest",
                user_Tocheck: userID
            },
        success: function (isPanding) {
            if (isPanding == 1) {
                $("#addFriendButton").replaceWith(PendingBtn);
                $("#friendshipBtn").addClass("disabled");
            }
        }
    });
}

function getUserFromUrlId(userId) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getUserInfo",
            user_id: userId
        },
        success: function (userInfo) {
            currentUserShown = userInfo;
            console.log(userInfo)
            printUser(userInfo);
            //printUserInfoPanelBody(currentUserShown.about)
        }
    });
}

function getUserFromSession() {
    $("#addFriendButton").remove();
    $("#editProfileBtn").removeClass("disabled");

    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getUserDataByEmailFromSession"},
        success: function (userData) {
            currentUserShown = userData;
            printUser(userData);
            //printUserInfoPanelBody(currentUserShown.about);
        }
    });
}

function friendsClick() {
    setActive($("#showFriendsBtn"));
    $("#userInfoPanelBody").empty();
    var id = currentUserShown.id;
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getCurrentUserShownFriends",
            currentUserShownId: currentUserShown.id
        },
        success: function (friendList) {
            if (friendList != null)
                friendList.forEach(printFriendList);
        }
    });
}

function printFriendList(friend) {
    var name = friend.fname + " " + friend.lname;
    var picUrl = "Resources/empty_profile.jpg";
    if (friend.profilePic != null)
        picUrl = friend.profilePic;
    var img =
        '<img id="smallProfilePic"' +
        'src="' + picUrl + '"' +
        'class="img-rounded" alt="" style="margin-right: 3px" width="25" height="25">'

    var linkToUser = getLinkWithStyle(friend.id + "Form", "profilePageServlet", name, "float: left", [["request_type", "loadUserProfile"], ["user_id", friend.id]]);
    var currText2 = img + linkToUser + "<span style ='float: left; margin-left: 10px'> Email: " + friend.email + "</span>";
    $('#userInfoPanelBody').append('<div><p style ="float: left">' + currText2 + '</p></div><br>');
    $('#userInfoPanelBody').append('<hr class="hr-soften">');
}

function printUser(userData) {
    /*document.getElementById('userName').innerHTML = userData.fname + " " + userData.lname;
     document.getElementById('userEmail').innerHTML = userData.email;
     if (userData.address != null && userData.address != "")
     document.getElementById('userLocation').innerHTML = userData.address;
     if (userData.skills != null && userData.skills != "")
     document.getElementById('userSkills').innerHTML = userData.skills;*/
    if (userData.profilePic != null && userData.profilePic != "")
        document.getElementById('profilePic').src = userData.profilePic;
    if (userData.CV != null && userData.CV != "") {
        var url = "location.href='" + userData.CV + "';"
        document.getElementById("CVbtnn").setAttribute("onClick", url);
    }
    printAbout();
}

function aboutClick() {
    setActive($("#aboutBtnn"));
    printAbout();
}

function printAbout() {
    $("#userInfoPanelBody").empty();
    var panel = $("#userInfoPanelBody");
    panel.append(
        '<div class="row"><label class="control-label col-sm-2">Name: </label>' + currentUserShown.fname + ' ' + currentUserShown.lname + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Email: </label>' + currentUserShown.email + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Address: </label>' + currentUserShown.address + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Skills: </label></div>' +
        '<div class="row" style="margin-left: 3px"><label class="control-label"></label>' + currentUserShown.skills + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">About: </label></div>' +
        '<div class="row" style="margin-left: 3px"><label class="control-label"></label>' + currentUserShown.about + '</div>')
}

function jobHistoryClick() {
    setActive($("#jobHistoryBtn"));
    $("#userInfoPanelBody").empty();
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getFinishedJobOffersForUser",
            currentUserIdSearch: currentUserShown.id
        },
        success: function (jobOffersPairs) {
            if (jobOffersPairs != null)
                jobOffersPairs.forEach(printJobOffer);
        }
    });
}

function futureJobsClick() {
    setActive($("#futureJobsBtn"));
    $("#userInfoPanelBody").empty();
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getFutureJobOffersForUser",
            currentUserIdSearch: currentUserShown.id
        },
        success: function (jobOffersPairs) {
            if (jobOffersPairs != null)
                jobOffersPairs.forEach(printJobOffer);
        }
    });
}

/* Ofer: 05-Sep-17 */
function printJobOffer(jobOfferPair) {
    var pair = jobOfferPair;
    var business = pair.left;
    var job = pair.right;
    $("#userInfoPanelBody").append('<div id="job' + job.jobId + '"></div>');
    var div = $("#job" + job.jobId);

    var picUrl = "Resources/empty_profile.jpg";
    if (business.profilePicUrl != null)
        picUrl = business.profilePicUrl;
    var img =
        '<img id="smallProfilePic"' +
        'src="' + picUrl + '"' +
        'class="img-rounded" alt="" style="margin-right: 3px" width="25" height="25">'
    var linkToBusiness = '<button data-id="' + business.id + '" class="btn btn-link" onclick="showBusinessProfile(this)"><b>' + business.name + ":  " + '</b></button>';
    //var linkToBusiness = getLinkWithStyle(business.id + "Form", "businessPage", business.name + ":", "float: left", [["request_type", "loadBusinessPage"], ["business_id", business.id]]);
    // language=HTML
    div.append(
        '<a href="#collapse' + job.jobId + '" data-toggle="collapse">' +img+" in:"+linkToBusiness+" "+ job.name + '</a>' +
        '<span style="float:right;" class="col-md-5">Posted On: <small>' + job.postDate + ' on ' + job.postTime + '</small></span>\n' +
        '<div id="collapse' + job.jobId + '" class="collapse">\n' +
        '<div class="row"><label class="control-label col-sm-2">Location: </label>' + job.jobLocation + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">From: </label>' + job.startDate + '  ' + job.startTime + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">To: </label>' + job.endDate + ' ' + job.endTime + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Salary: </label>' + job.salary + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Workers: </label>' + job.workers_num + '/' + job.max_workers_num + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Details: </label>' + job.details + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Requirements: </label>' + job.requirements + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Applicants: </label>' + '<div id="applicantsListDiv"></div>' + '</div>' +
        '</div>');
    $("#userInfoPanelBody").append('<hr class="hr-soften">');


}

function businessesClick() {
    setActive($("#businessesBtn"));
    $("#userInfoPanelBody").empty();
    $("#userInfoPanelHeaderButtonDiv").append(
        '<div align="right">\n' +
        '     <button id="addFeedbackBtn" class="btn btn-default btn-md" onclick="addBusiness()">Add Business</button>\n' +
        '</div>');
    var mapstr;
    var mydatas = new Map();
    $(function () {
        $.ajax({
            url: "businessPage",
            type: 'POST',
            data: {
                request_type: "getCurrentUserBusinesssesList",
                currentUserShownId: currentUserShown.id,
            },
            success: function (businessesList) {
                if (businessesList != null)
                    businessesList.forEach(printBusiness)
            }
        });
    });
}

function printBusiness(business) {
    picUrl = 'Resources/empty_profile.jpg';
    if (business.profilePicUrl != null)
        picUrl = business.profilePicUrl;
    var img =
        '<img id="smallProfilePic"' +
        'src="' + picUrl + '"' +
        'class="img-rounded" alt="" style="margin-right: 3px" width="25" height="25">'

    var linkToBusiness = getLinkWithStyle(business.id + "Form", "businessPage", business.name + ":", "float: left", [["request_type", "loadBusinessPage"], ["business_id", business.id]]);
    var currText = img + linkToBusiness + "<span style ='float: left; margin-left: 10px'> City: " + business.city + "</span><span style ='float: left ; margin-left: 10px'> Number: " + business.phone + "</span>";
    $('#userInfoPanelBody').append('<div><p style ="float: left">' + currText + '</p></div><br>');
    $('#userInfoPanelBody').append('<hr class="hr-soften">');
}

function printUserInfoPanelBody(userInfoBodyText) {
    $("#userInfoPanelBody").empty();
    if (userInfoBodyText != null && userInfoBodyText != "")
        $('#userInfoPanelBody').append('<span>' + userInfoBodyText + '</span><br>');
}

var recomendationIndex = 0;

function recommendationsClick() {
    setActive($("#recommendationsBtn"));
    recommendationForm = "<div class='row'> <div class='col-md-5'> <label for='recommendationText'>Enter Recommendation:</label> </div> <textarea class='form-control' rows='2' id='recommendationText'></textarea> </div><div id = 'recomendationsPlace'></div>"
    var header = $("#userInfoPanelHeaderButtonDiv");
    header.append("<button onclick='registerRecommendation()' class='btn btn-outline btn-primary btn-large'>Submit</button>")
    printUserInfoPanelBody(recommendationForm);
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getCurrentUserRecommendation",
            currentUserShownId: currentUserShown.id,
        },
        success: function (recommendationList) {
            $('#recomendationsPlace').empty();
            recomendationIndex = 0;
            if (recommendationList != null)
                recommendationList.forEach(printRecommendation);
        }
    });
}

function printRecommendation(recommendation) {
    recomendationIndex = recomendationIndex + 1;
    var linkToUser = getLinkWithStyle(recomendationIndex + "Form", "profilePageServlet", recommendation.userInputedName + ":", "float: left", [["request_type", "loadUserProfile"], ["user_id", recommendation.userInputedId]]);
    var currText2 = linkToUser + "<span style ='float: left; margin-left: 10px'> Recommended: " + recommendation.recommendation + "</span>";
    $('#recomendationsPlace').append('<div><p style ="float: left">' + currText2 + '</p></div><br>');
    $('#recomendationsPlace').append('<hr class="hr-soften">');
}

function registerRecommendation() {
    var rec = $("#recommendationText").val();
    if (rec != null && rec != "") {
        $.ajax({
            url: "profilePageServlet",
            type: 'POST',
            data: {
                request_type: "registerRecommendation",
                currentUserLogedInId: currentUserLoggedIn.id,
                currentUserLogedInName: currentUserLoggedIn.fname + " " + currentUserLoggedIn.lname,
                currentUserShownId: currentUserShown.id,
                recommendation: rec
            },
            success: function (recommendationList) {
                $('#recomendationsPlace').empty();
                recomendationIndex = 0;
                if (recommendationList != null)
                    recommendationList.forEach(printRecommendation);
            }
        });
    }
}

function addAsFriend() {
    if (currentUserLoggedIn.id != currentUserShown.id) {
        $.ajax({
            url: "profilePageServlet",
            type: 'POST',
            data: {
                request_type: "addFriend",
                currentUserLogedInId: currentUserLoggedIn.id,
                currentUserShownId: currentUserShown.id,
            },
            success: function (flag) {
                if (flag == 1) {
                    $("#addFriendButton").replaceWith(PendingBtn);
                    $("#friendshipBtn").addClass("disabled");
                    alert("Friend request Sent");
                }
            }
        });
    }
}

function setActive(item) {

    var v = $('#profile-nav').find("li");
    v.each(function () {
        $(this).removeClass("active");
    });
    $("#userInfoPanelHeaderButtonDiv").empty();

    $("#userInfoPanelHeaderTextDiv").html($(item).text());
    $(item).parent().addClass("active");
}

function addBusiness() {
    window.location.replace("/editBusinessProfilePage.html");
}

function removeFriend() {
    if (currentUserLoggedIn.id != currentUserShown.id) {
        $.ajax({
            url: "profilePageServlet",
            type: 'POST',
            data: {
                request_type: "removeFriend",
                currentUserLogedInId: currentUserLoggedIn.id,
                currentUserShownId: currentUserShown.id,
            },
            success: function (flag) {
                if (flag == 1) {
                    $("#removeFriendButton").replaceWith(AddFriendBtn);
                    $("#friendshipBtn").removeClass("disabled");
                    loadLogedInUserFriends();
                    alert("friend removed");
                }
            }
        });
    }
}