/**
 * Created by Ron on 27-Aug-17.
 */

$(function () {
    getNotifications();
    $("#msgNotifier").find('span').html("");
    loadLogedInUserFriends();
    showSessionUserProfilePic();

});

function printFriendResponse(not) {
    if (not.isApproved) {
        printUserFriendNotification(not, "Accepted");
    }
    else {
        printUserFriendNotification(not, "Did Not Accepted");
    }
}


function printResponse(not) {
    if (not.isApproved) {
        printUserNotification(not, "Agree");
    }
    else {
        printUserNotification(not, "Did Not Agree");
    }
}

function getNotifications() {
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "getUserNotifications"
        },
        success: function (notificationsList) {
            console.log("notificationsList");
            console.log(notificationsList);
            printNotifications(notificationsList);

        }
    });
}

function printPendingBusinessNotification(not) {
    $("#notificationDiv").append(
        '<div id="not' + not.id + '" class="row">' +
        '   <img src="' + not.business_profile_pic + '"  class="col-lg-1 small_profile_pic"/>' +
        '   <span>' +
        '       <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showBusinessProfile(this)"><b>' + not.business_name + ":  " + '</b></button>' +
        '   </span>' +
        '   <span id="notMsg">' +
        '         <span id="senderLinkSpan">' +
        '             <button  data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>' +
        '         </span>' +
        "       Applied For " +
        '         <span id="jobName">' + not.job_name + '</span>' +
        '   </span>' +
        '   <div id="hireRejectBtns" style="float:right">' +
        '       <button class="btn btn-sm btn-primary" data-type="' + not.type + '" data-apply-id="' + not.apply_id + '" data-not-id="' + not.id + '" data-job-id="' + not.job_id + '" onclick="HireOrRejectClick(this)">Hire</button>' +
        '       <button class="btn btn-sm btn-danger" data-type="' + not.type + '" data-apply-id="' + not.apply_id + '" data-not-id="' + not.id + '" data-job-id="' + not.job_id + '" onclick="HireOrRejectClick(this)">Reject</button>' +
        '   </div><span style="float: right; padding-right: 10px"><small>' + not.notDate + ' ' + not.notTime + '</small></span>' +
        '</div>');
}

function HireOrRejectClick(btn) {
    var hiredOrRejectText = $(btn).text();
    var type = $(btn).attr("data-type");
    var notId = $(btn).attr("data-not-id");
    var applyId = $(btn).attr("data-apply-id");
    var jobId = $(btn).attr("data-job-id");
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "handleHireRejectRequest",
            not_id: notId,
            apply_id: applyId,
            job_id: jobId,
            type: type,
            /* Ofer: 05-Sep-17 */
            is_hire: $(btn).text() == "Hire" || $(btn).text() == "Accept"
        },
        success: function (flag) {
            var senderLinkSpan = $("#not" + notId).find("#senderLinkSpan");
            console.log((senderLinkSpan));
            var jobName = $("#not" + notId).find("#jobName");
            if (type == 0) {
                $("#not" + notId).find("#notMsg").empty();
                $("#not" + notId).find("#notMsg").append(' You ');
                $("#not" + notId).find("#notMsg").append(hiredOrRejectText + " ");
                $("#not" + notId).find("#notMsg").append(senderLinkSpan);
                $("#not" + notId).find("#notMsg").append(' For ');
                $("#not" + notId).find("#notMsg").append(jobName);
                $("#not" + notId).find("#hireRejectBtns").remove();
            } else if (type == 4) {
                $("#not" + notId).find("#notMsg").empty();
                $("#not" + notId).find("#notMsg").append(' You ');
                $("#not" + notId).find("#notMsg").append(hiredOrRejectText + "ed");
                $("#not" + notId).find("#notMsg").append(' Job: ');
                $("#not" + notId).find("#notMsg").append(jobName);
                $("#not" + notId).find("#hireRejectBtns").remove();
            }
        }
    });
}

function printUserNotification(not, message) {
    /* Ofer: 05-Sep-17 */
    var msg2 = not.type == 1 ? ' To Hire You For ' : ' For Job: ';
    $("#notificationDiv").append('\
        <div class="row" id="notify" >\
        <img src="' + not.sender_profile_pic + '"  class="col-lg-1 small_profile_pic"/>\
            <span>\
                <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showUserProfile(this)"><b>' + not.business_name + ":  " + '</b></button>\
            </span>\
            <span>\
                <button data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>\
            </span>\
            <span>' + message + msg2 + not.job_name + '</span>\
            <span style="float: right ; padding-right: 10px"><small>' + not.notDate + ' ' + not.notTime + '</small></span>\
        </div>');
}

function printUserFriendNotification(not, message) {
    $("#notificationDiv").append('\
        <div class="row" id="notify" >\
        <img src="' + not.sender_profile_pic + '"  class="col-lg-1 small_profile_pic"/>\
            <span>\
                <button data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>\
            </span>\
            <span>' + message + ' your friend request</span>\
            <span style="float: right; padding-right: 10px"><small>' + not.notDate + ' ' + not.notTime + '</small></span>\
        </div>');
}

function printNotPendingBusinessNotification(not) {
    var hireOrRejectText = not.isApproved == true ? " Hired " : " Rejected ";
    $("#notificationDiv").append(
        '<div id="not' + not.id + '" class="row">' +
        '   <img src="' + not.business_profile_pic + '"  class="col-lg-1 small_profile_pic"/>' +
        '   <span>' +
        '       <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showBusinessProfile(this)"><b>' + not.business_name + ":  " + '</b></button>' +
        '   </span>' +
        '   <span id="notMsg">' +
        ' You ' + hireOrRejectText +
        '         <span id="senderLinkSpan">' +
        '             <button  data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>' +
        '         </span>' +
        ' For ' +
        '         <span id="jobName">' + not.job_name + '</span>' +
        '   </span><span style="float: right; padding-right: 10px"><small>' + not.notDate + ' ' + not.notTime + '</small></span>' +
        '</div>');
}

function printFriendRequest(not) {
    /* Ofer: 05-Sep-17 */
    $("#notificationDiv").append('\
    <div class="row" id="notify" >\
            <img src="' + not.sender_profile_pic + '"  class="col-lg-1 small_profile_pic"/>\
            <span>\
                <button data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>\
            </span>\
            <span> sent you a friend request </span>\
            <div id="hireRejectBtns" style="float:right">\
              <button id="acceptBtn" class="btn btn-sm btn-primary" data-reciver-id="' + not.reciver_id + '" data-sender-id="' + not.sender_id + '" data-not-id="' + not.id + '" onclick="AcceptOrRejectFriendClick(this)">Accept</button>\
              <button id="rejectBtn"  class="btn btn-sm btn-danger" data-reciver-id="' + not.reciver_id + '" data-sender-id="' + not.sender_id + '" data-not-id="' + not.id + '" onclick="AcceptOrRejectFriendClick(this)">Reject</button>\
            </div>\
            <span style="float: right; padding-right: 10px"><small>' + not.notDate + ' ' + not.notTime + '</small></span>\
        </div>');
    renameBtnId();
    if (not.isPending == 0) {
        var acceptBtnId = '#acceptBtn' + not.id;
        var rejectBtnId = '#rejectBtn' + not.id;
        var acceptMessage = "Accepted ", rejectMessage = "Rejected ";
        var div = $('<div id="replacedMessage" class="text-muted" style="float:right"></div>')
        $(acceptBtnId).replaceWith(div);
        $(rejectBtnId).remove();
        if (not.isApproved) {
            $("#replacedMessage").html(acceptMessage);
        }
        else {
            $("#replacedMessage").html(rejectMessage);
        }
    }
}

function printPendingJobSuggestion(not) {
    $("#notificationDiv").append(
        '<div id="not' + not.id + '" class="row">' +
        '   <img src="' + not.business_profile_pic + '"  class="col-lg-1 small_profile_pic"/>' +
        '   <span>' +
        '       <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showBusinessProfile(this)"><b>' + not.business_name + ":  " + '</b></button>' +
        '   </span>' +
        '   <span id="notMsg">' +
        '         <span id="senderLinkSpan">' +
        '             <button  data-id="' + not.sender_id + '" class="btn btn-link" onclick="showUserProfile(this)">' + not.sender_name + '</button>' +
        '         </span>' +
        "       Suggest You For " +
        '         <span id="jobName">' + not.job_name + '</span>' +
        '   </span>' +
        //Ofer :04-Sep-17
        '   <div id="hireRejectBtns" style="float:right">' +
        '       <button class="btn btn-sm btn-primary" data-type="' + not.type + '" data-apply-id="' + not.apply_id + '" data-not-id="' + not.id + '" data-job-id="' + not.job_id + '" onclick="HireOrRejectClick(this)">Accept</button>' +
        '       <button class="btn btn-sm btn-danger" data-type="' + not.type + '" data-apply-id="' + not.apply_id + '" data-not-id="' + not.id + '" data-job-id="' + not.job_id + '" onclick="HireOrRejectClick(this)">Reject</button>' +
        '   </div><span style="float: right"><small>' + not.notDate + ' ' + not.notTime + '</small></span>' +
        '</div>');
}

function printNotPendingJobSuggestion(not) {
    var hireOrRejectText = not.isApproved == true ? " Accepted " : " Rejected ";
    $("#notificationDiv").append(
        '<div id="not' + not.id + '" class="row">' +
        '   <img src="' + not.business_profile_pic + '"  class="col-lg-1 small_profile_pic"/>' +
        '   <span>' +
        '       <button data-id="' + not.business_id + '" class="btn btn-link" onclick="showBusinessProfile(this)"><b>' + not.business_name + ":  " + '</b></button>' +
        '   </span>' +
        '   <span id="notMsg">' +
        ' You ' + hireOrRejectText +
        ' Job ' +
        '         <span id="jobName">' + not.job_name + '</span>' +
        '   </span><span style="float: right"><small>' + not.notDate + ' ' + not.notTime + '</small></span>' +
        '</div>');
}

function printNotifications(notifications) {
    notifications.forEach(function (not) {

        switch (not.type) {
            case 0:
                if (not.isPending) {
                    printPendingBusinessNotification(not);
                } else {
                    printNotPendingBusinessNotification(not);
                }
                break;
            case 1:
                printResponse(not);
                break;
            case 2:
                printFriendRequest(not);
                break;
            case 3:
                printFriendResponse(not);
                break;
            case 4:
                if (not.isPending) {
                    printPendingJobSuggestion(not);
                } else {
                    printNotPendingJobSuggestion(not);
                }
                break;
            case 5:
                printResponse(not);
                break;
        }
        /* Ofer: 05-Sep-17 */
        $("#notificationDiv").append('<hr>');
    });

}

function AcceptOrRejectFriendClick(btn) {
    var reciverId = $(btn).attr("data-reciver-id");
    var notId = $(btn).attr("data-not-id");
    var senderId = $(btn).attr("data-sender-id");
    var jobId = $(btn).attr("data-job-id");
    var isAccepted = $(btn).text() == "Accept";
    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "handleAcceptdOrRejectFriendRequest",
            not_id: notId,
            reciver_id: reciverId,
            sender_id: senderId,
            job_id: jobId,
            is_accepted: $(btn).text() == "Accept"
        },
        success: function (flag) {
            var acceptBtnId = '#acceptBtn' + notId;
            var rejectBtnId = '#rejectBtn' + notId;
            var acceptMessage = "Accepted ", rejectMessage = "Rejected ";
            var div = $('<div id="replacedMessage" class="text-muted" style="float:right"></div>')
            $(acceptBtnId).replaceWith(div);
            $(rejectBtnId).remove();
            if (isAccepted) {
                $("#replacedMessage").html(acceptMessage);
            }
            else {
                $("#replacedMessage").html(rejectMessage);
            }
        }
    });
}

function getUserInfo(userId, div) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getUserInfo",
            user_id: userId
        },
        success: function (userInfo) {
            $(div).find("#userName").text(userInfo.fname + " " + userInfo.lname);

        }
    });
}

function getBusinessInfo(id, div) {
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessInfo",
            business_id: id
        },
        success: function (businessInfo) {
            $(div).find("#businessName").text(businessInfo.name + ":  ");
            $(div).find("#businessImg").attr("src", businessInfo.profilePicUrl);
        }
    });
}

function renameBtnId() {
    $("#acceptBtn").each(function () {
        var newAcceptID = 'acceptBtn' + $(this).attr("data-not-id");
        $(this).attr('id', newAcceptID);
    });
    $("#rejectBtn").each(function () {
        var newRejectID = 'rejectBtn' + $(this).attr("data-not-id");
        $(this).attr('id', newRejectID);
    });

}