var business_id;
var business_name;

$(function () {
    business_id = getUrlParameter("business_id");
     business_name = getUrlParameter("business_name");
    getJobOffers(printJobsList, business_id, business_name);
    loadProfilePic(business_id);
    loadLogedInUserFriends();
    getFriendsList(addFriendsToMultiSelectionDropDown);


});

function addFriendsToMultiSelectionDropDown(item) {
    var friend = item.left;
    console.log("friends:");
    console.log(friend);
    var option = "<option id=" + friend.id + ">" + friend.fname + " " + friend.lname + "</option>"
    $("#friendsSelect").append(option);
    $("#friendsSelect").trigger("chosen:updated");
}

function getFriendsList(handleData) {
    $.ajax({
        url: "profilePageServlet",
        type: 'POST',
        data: {request_type: "getFriends"},
        success: function (friendListWithLogedInData) {
            friendListWithLogedInData.forEach(handleData);
        }
    });
}

function loadProfilePic(business_id) {

    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessInfo",
            business_id: business_id
        },
        success: function (_businessInfo) {
            showProfilePic(_businessInfo.profilePicUrl);
        }
    });

}

function getJobOffers(handleObj, id, name) {

    $("#editJobPanelHeaderTitle").text(name + " Jobs:");
    $("#jobsPanelBody").empty();
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {
            request_type: "getBusinessJobOffers",
            business_id: id
        },
        success: function (_jobOffers) {
            console.log(_jobOffers);
              handleObj(_jobOffers);
        }
    });
}


function printJobsList(jobs) {
    jobs.forEach(printJob2);
}


function deleteJobById(id) {
    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: {
            request_type: "deleteJobById",
            job_id:id
        },
        success: function (flag) {
            if(flag==0){
                console.log("fail");
            }else {
                $("#job"+id).remove();
                console.log("success");

            }
        }
    });
}

function deleteJob(id) {
    id = id == null ? $("#jobsPanelBody").find(".selectedOfer").attr('id').substring(3) : id;
    if (confirm("Are You Sure You Want To Delete?") == true) {
        deleteJobById(id);
    } else {
        console.log("You pressed Cancel!");
    }
}

function selectThis(elem) {
    $(elem).addClass(" selectedOfer");
    $(elem).siblings().removeClass("selectedOfer");
    $("#editJobItem").removeClass("disabled");
    $("#deleteJobItem").removeClass("disabled");
    $("#sendEmploymentReqItem").removeClass("disabled");


}

function printJob2(job) {
    $("#jobsPanelBody").append('<div id="job' + job.jobId + '" onclick="selectThis(this)"></div>');
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
        '<div class="row"><label class="control-label col-sm-2">Workers: </label>' + job.workers_num +'/'+job.max_workers_num+ '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Details: </label>' + job.details + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Requirements: </label>' + job.requirements + '</div>' +
        '<div class="row"><label class="control-label col-sm-2">Applicants: </label>' + '<div id="applicantsListDiv"></div>' + '</div>' +
        '</div>');
    $("#jobsPanelBody").append('<hr class="hr-soften">');
}

function addJobOffer() {
    window.location.replace(String.format("jobPage.html?job_id={0}&business_id={1}&business_name={2}",null,business_id,business_name));
}
function editJobOffer() {
    var jobId = $("#jobsPanelBody").find(".selectedOfer").attr('id').substring(3);
    window.location.replace(String.format("jobPage.html?job_id={0}&business_id={1}&business_name={2}", jobId, business_id, business_name));
}

function sendEmploymentRequests() {
    var friendsNames;
    var friendsIds = [];
    var jobId = $("#jobsPanelBody").find(".selectedOfer").attr('id').substring(3);
    if ($("#friendsSelect").chosen().val().length != 0) {
        friendsNames = $("#friendsSelect").chosen().val();
        friendsNames.forEach(function (f) {
            friendsIds.push($("option:contains('" + f + "')").prop('id'));
            console.log($("option:contains('" + f + "')").prop('id'));
        })
        allNull = false;
    }else{
        alert("Must Pick SomeOne.");
    }

    $.ajax({
        url: "notificationsPageServlet",
        type: 'POST',
        data: {
            request_type: "sendEmploymentRequests",
            friends: friendsIds,
            business_id:business_id,
            job_id:jobId,
            sender_id:currentUserLoggedIn.id
        },
        success: function () {
            alert("Job Suggestions Successfully sent.");
            $('#myModal').modal('toggle');

        }
    });
}
function getJobsFilter(jobId) {
    $.ajax({
        url: "FeedServlet",
        type: 'GET',
        data: {
            request_type: "getJobsTitleList"
        },
        success: function (listOfJobs) {
            var newID = '#title';
            if(jobId !=-1) {
                newID=newID+jobId;
            }
            listOfJobs.forEach(insertJobsToDropDown);
            $("#option0").remove();
            $(newID).chosen();
            $(newID).chosen({allow_single_deselect: true});
        }
    })
}
function getCities(jobId) {
    var newID = '#jobLocation';
    if(jobId !=-1) {
        newID= newID+jobId;
    }
    //if($(this).attr("data-job-id")){newID=+ $(this).attr("data-job-id");}
    cities.forEach(insertLocationToDropBox);
    $("#optionL0").remove();
    $(newID).chosen();
    $(newID).chosen({allow_single_deselect: true});
}

function insertLocationToDropBox(city) {
    $('<option>' + city.engName.toLowerCase() + '</option>').insertAfter("#optionL0");
}
function insertJobsToDropDown(jobName) {
    $('<option>' + jobName + '</option>').insertAfter("#option0");
}

function renameTitleAndLocationId() {
    $("#title").each(function () {
        var newID = 'title' + $(this).attr("data-job-id");
        $(this).attr('id', newID);
    });

    $("#jobLocation").each(function () {
        var newID = 'jobLocation' + $(this).attr("data-job-id");
        $(this).attr('id', newID);
    });
}