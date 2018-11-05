var businessObj;

$(function () {
    var businessId = getUrlParameter('business_id');

    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessInfo",
            business_id: businessId
        },
        success: function (_businessInfo) {
            businessObj = _businessInfo;
            console.log(_businessInfo)
            printAbout(_businessInfo);
            showProfilePic(_businessInfo.profilePicUrl);
        }
    });
    loadLogedInUserFriends();
    doesUserOwnBusiness(showOwnersFeatures, businessId);
});

function showOwnersFeatures() {
    $("#businessNavBarMore").append(
        '<div style="float:right;" class="dropdown">\n' +
        '  <button class="btn btn-default navbar-btn dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\n' +
        '    More\n' +
        '    <span class="caret"></span>\n' +
        '  </button>\n' +
        '  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">\n' +
        '    <li><a href="#" onclick="editJobsClick(businessObj.id,businessObj.name)">Edit Job Offers</a></li>\n' +
        '    <li><a href="#" onclick="editBusinessClick(businessObj.id)">Edit Business Profile</a></li>\n' +
        '    <li role="separator" class="divider"></li>\n' +
        '    <li><a href="#" onclick="deleteBusinessClick(businessObj.id,businessObj.name)">Delete Business</a></li>\n' +
        '  </ul>\n' +
        '</div>');
}

//get user info by id
function getUserInfo(id) {//move to utils
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {
            request_type: "getUserInfo",
            user_id: id
        },
        success: function (userInfo) {
            console.log("in getUserInfo: " + userInfo);
            res = userInfo;
            return res;
        },
        error: function () {
            console.log("error in getUserInfo");

        }
    });
}


function setActive(item) {

    var v = $('#bussiness-nav').find("li");
    v.each(function () {
        $(this).removeClass("active");
    });
    $("#businessInfoPanelHeaderButtonDiv").empty();
    $("#businessInfoPanelHeaderTextDiv").html('<b>' + $(item).text() + '</b>');
    $(item).parent().addClass("active");
}

function aboutClick() {
    setActive($("#about"));
    $("#businessInfoPanelBody").empty();
    printAbout(businessObj);
}

function printAbout(businessInfo) {
    $("#businessName").html(businessInfo.name);
    $("#businessInfoPanelBody").append('<div id="about' + businessInfo.id + '"></div>');
    var div = $("#about" + businessInfo.id);

    var u = businessInfo.owner;
    var link = getLink(u.fname + u.lname + "Form", "profilePageServlet", u.fname + " " + u.lname, [["request_type", "loadUserProfile"], ["user_id", u.id]]);

    // language=HTML
    div.append(
        '<div class="row"><label class="control-label col-sm-2">Location: </label>' + businessInfo.city + ' ,' + businessInfo.street + ' ,' + businessInfo.number + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Email: </label>' + businessInfo.email + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Phone: </label>' + businessInfo.phone + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Owner: </label>' + link + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">About: </label>' + businessInfo.about + '</div>');

}

function showAddFeedbackBtn() {

    // if(businessObj.owner_id!=currentUserLoggedIn.id) {
    $("#businessInfoPanelHeaderButtonDiv").append('<div align="right">\n' +
        '                    <button id="addFeedbackBtn" class="btn btn-default btn-md" onclick="addFeedback()">Add Feedback</button>\n' +
        '                </div>')
    //  }

}

function cancelNewFeedback() {
    $("#newFeedback").remove();
    $("#addFeedbackBtn").attr("disabled", false);
}

function addFeedback() {
    $("#addFeedbackBtn").attr("disabled", true);
    $("#businessInfoPanelBody").prepend('<div id="newFeedback"></div>');
    var div = $("#newFeedback");

    // language=HTML
    div.append(
        '<div >\n' +
        '    <form  method="POST"  action="/businessPage">\n' +
        '        <input type="hidden" name="request_type" value="addFeedback">\n' +
        '        <input type="hidden" name="business_id" value="' + businessObj.id + '">\n' +

        '        <div class="row">\n' +
        '            <div class="col-md-3"></div>\n' +
        '            <div class="col-md-3 "><input type="submit" value="Save" class="btn btn-primary btn-outline btn-xs"/></div>\n' +
        '            <div class="col-md-3"><input type="button" value="Cancel" class="btn btn-danger btn-outline btn-xs" onclick="cancelNewFeedback()"/></div>\n' +
        '        </div>' +
        '        <div class="row">' +
        '            <label for="title" class="col-sm-2 control-label">Title:</label>' +
        '            <div class="col-sm-10">' +
        '                <input id="title" class="form-control" type="text" name="title"' +
        '                       placeholder="Title"  required/>' +
        '            </div>' +
        '        </div>' +
        '        <div class="row">' +
        '            <label for="feedback" class="col-sm-2 control-label">Feedback:</label>' +
        '            <div class="col-sm-10">' +

        '                <textarea class="form-control" rows="5" id="feedback" type="feedback" name="feedback" placeholder="Feedback"value="Feedback"></textarea>' +
        '            </div>' +
        '        </div>' +

        '    </form>' +
        '</div>' +
        '<hr class="hr-soften">'
    );

}

function printFeedback(feedback) {
    $("#businessInfoPanelBody").append('<div id="feedback' + feedback.id + '"></div>');
    var div = $("#feedback" + feedback.id);
    var userLink = getLink(feedback.uploaderId + "feedbackForm", "profilePageServlet", feedback.uploaderName, [["request_type", "loadUserProfile"], ["user_id", feedback.uploaderId]]);

    // language=HTML
    div.append(
        '<a href="#collapse' + feedback.id + '" data-toggle="collapse">' + feedback.title + '</a>' +
        '<span style="float:right;" class="col-md-6"><span class="col-md-4">Posted By: </span> <small>' + userLink + ' ' + feedback.uploadDate + ' on ' + feedback.uploadTime + '</small></span>\n' +
        '<div id="collapse' + feedback.id + '" class="collapse">\n' +
        '<div>' + feedback.feedback + '</div>' +

        '</div>');

    div.append('<hr class="hr-soften">');

    $("#" + feedback.uploaderId + "feedbackForm").addClass("col-md-3")
}

function feedbacksClick() {
    setActive($("#feedbacks"));

    $("#businessInfoPanelBody").empty();
    $("#businessInfoPanelHeaderButtonDiv").empty();
    showAddFeedbackBtn();

    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessFeedbacks",
            business_id: businessObj.id
        },
        success: function (_feedbacks) {
            _feedbacks.forEach(printFeedback);
        }
    });

}

function jobOffersClick() {
    setActive($("#jobOffers"));

    $("#businessInfoPanelBody").empty();
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessJobOffers",
            business_id: businessObj.id
        },
        success: function (_jobOffers) {
            _jobOffers.forEach(printJobOffer);
        }
    });

}

function printJobOffer(job) {
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getAllJobApplicantsByJobID",
            job_id: job.jobId
        },
        success: function (applicantList) {
            $("#businessInfoPanelBody").append('<div id="job' + job.jobId + '"></div>');
            var div = $("#job" + job.jobId);

            // language=HTML
            div.append(
                '<a href="#collapse' + job.jobId + '" data-toggle="collapse">' + job.name + '</a>' +
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
            $("#businessInfoPanelBody").append('<hr class="hr-soften">');
            console.log(job);
            applicantList.forEach(function (applicant) {

                if (applicant != null) {
                    console.log("applicant: " + applicant.id);
                    var userLink = getLinkWithStyle(applicant.id + "feedbackForm", "profilePageServlet", applicant.fname + " " + applicant.lname + "  ", "col-md-offset-1", [["request_type", "loadUserProfile"], ["user_id", applicant.id]]);

                    $("#job" + job.jobId).find("#applicantsListDiv").append(userLink);
                }
            })


        }
    });


}

function somthingClick() {
    //$("#businessInfoPanelHeader").html($("#somthing").text());
    setActive($("#somthing"));
    //$("#somthing").addClass("active");
    $("#businessInfoPanelBody").empty();
}

function getBusinessInfo(str) {
    var businessName = $("#businessName").text();
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessInfo",
            InfoType: str,
            BusinessName: businessName
        },
        success: function (_businessInfo) {
            if (str == "About") {
                //$("#businessInfoPanelBody").appendChild("<h1>"+businessInfo.name+"</h1>")
                //$("<h1>"+businessInfo.name+"</h1>").appendTo($("#businessInfoPanelBody"));
                $("#businessInfoPanelBody").html("<h1>" + _businessInfo.name + "</h1>");
            }
        }
    });
}

$(function () {
    $("#businessInfoPanelHeaderTextDiv").html('<b>' + $("#about").text() + '</b>');
})


function deleteBusinessClick(id, name) {
    if (confirm("Are You Sure You Want To Delete " + name + " ?") == true) {
        console.log("You pressed OK!");
        console.log(id, name);
        deleteBusinessById(id);
    } else {
        console.log("You pressed Cancel!");
    }
}

function deleteBusinessById(id) {
    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: {
            request_type: "deleteBusinessById",
            business_id: id
        },
        success: function (flag) {
            if (flag == 0) {
                console.log("fail");
            } else {
                console.log("success");
                $("#business" + id + "Div").remove();
                window.location.replace("/profilePage.html");

            }
        }
    });
}

function editBusinessClick(id) {
    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: {
            request_type: "redirectToEditBusinessById",
            business_id: id
        },
        success: function (flag) {
            if (flag == 0) {
                window.location.replace("/ErrorPage.html");
            } else {
                window.location.replace("/editBusinessProfilePage.html?business_id=" + id);
            }
        }
    });
}