var jobOBJ;
var business_id;
var business_name;
var jobId;
$(function () {
    jobId = getUrlParameter("job_id");
    business_id = getUrlParameter("business_id");
    business_name = getUrlParameter("business_name");
    loadProfilePic(business_id);
    if (jobId != 'null') {
        $.ajax({
            url: "editBusinessServlet",
            type: 'POST',
            data: {
                request_type: "getJobOfferByID",
                job_id: jobId
            },
            success: function (job) {
                jobOBJ = job;
                printJob3(job);
            }
        });
    } else {
        printNewJob();
        console.log("NewJob");
    }
})

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

function printNewJob() {
    $("#jobInfoPanelHeaderTextDiv").text("New Job");
    $("#jobInfoPanelBody").append('<div id="jobNew"></div>');
    var div = $('#jobNew');
    // language=HTML
    div.append(
        '<div >\n' +
        '    <form id="jobForm" method="POST"  action="/editBusinessServlet">\n' +
        '        <input type="hidden" name="request_type" value="addJobOffer">\n' +
        '        <input type="hidden" name="jobId" value="">\n' +
        '        <input type="hidden" name="business_id" value="' + business_id + '">\n' +
        '        <input type="hidden" name="business_name" value="' + business_name + '">\n' +

        '        <div class="row">\n' +
        '            <label for="title" class="col-sm-2 control-label">Title:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                 <select id="title" data-placeholder="Click To Select Your Skills" name="title"' +
        '                       class="chosen-select chosen-ltr form-control" required>\n' +
        '                    <option id="option0"></option>' +
        '                  </select>' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobLocation" class="col-sm-2 control-label">Location:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '               <select id="jobLocation" data-placeholder="Click To Select Location" name="jobLocation"\n' +
        '                    class="chosen-select chosen-ltr form-control" required>\n' +
        '                  <option id="optionL0"></option>' +
        '                </select>' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="startDate" class="col-sm-2 control-label">From:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startDate" type="date" name="startDate" value="" required/>\n' +
        '            </div>\n' +
        '            <label for="startTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startTime" type="time" name="startTime" value="" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="endDate" class="col-sm-2 control-label">To:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endDate" type="date" name="endDate" value="" required/>\n' +
        '            </div>\n' +
        '            <label for="endTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endTime" type="time" name="endTime" value="" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobSalary" class="col-sm-2 control-label">Salary:</label>\n' +
        '            <div class="col-sm-10">\n' +
        /* Ofer: 05-Sep-17 */
        '                <input id="jobSalary" class="form-control" type="number" name="jobSalary"\n' +
        '                       placeholder="Job Salary" value="" min="0" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobNumOfWorkers" class="col-sm-2 control-label">Workers:</label>\n' +
        '            <div class="col-sm-10">\n' +
        /* Ofer: 05-Sep-17 */
        '                <input id="jobNumOfWorkers" class="form-control" type="number" name="jobNumOfWorkers"\n' +
        '                       placeholder="Workers Needed" value="" min="0" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="row ">\n' +
        '            <label for="details" class="col-sm-2 control-label">Job details:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="details" name="details"\n' +
        '                      placeholder="Job details"></textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="row ">\n' +
        '            <label for="requirements" class="col-sm-2 control-label">Requirements:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="requirements" name="requirements"\n' +
        '                      placeholder="Requirements"></textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </form>\n' +
        '</div>\n'
    );
    getJobsFilter(null);
    getCities();
}

function printJob3(job) {
    $("#jobInfoPanelHeaderTextDiv").text(job.name);
    $("#jobInfoPanelBody").append('<div id="job' + job.jobId + '"></div>');
    var div = $('#job' + job.jobId);
    // language=HTML
    div.append(
        '<div id="collapse' + job.jobId + '">\n' +
        '    <form id="jobForm" method="POST"  action="/editBusinessServlet">\n' +
        '        <input type="hidden" name="request_type" value="updateJob">\n' +
        '        <input type="hidden" name="jobId" value="' + job.jobId + '">\n' +
        '        <input type="hidden" name="business_id" value="' + business_id + '">\n' +
        '        <input type="hidden" name="business_name" value="' + business_name + '">\n' +

        '        <div class="row">\n' +
        '            <label for="title" class="col-sm-2 control-label">Title:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <select id="title" data-placeholder="' + job.name + '" data-job-id="' + job.jobId + '" name="title"' +
        '                       class="chosen-select chosen-ltr form-control" required>\n' +
        '                     <option id="option0"></option>' +
        '                 </select>' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobLocation" class="col-sm-2 control-label">Location:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '                <select id="jobLocation" data-placeholder="' + job.jobLocation + '" data-job-id="' + job.jobId + '" name="jobLocation"\n' +
        '                       class="chosen-select chosen-ltr form-control" required>\n' +
        '                       <option id="optionL0"></option>' +
        '                </select>' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="startDate" class="col-sm-2 control-label">From:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startDate" type="date" name="startDate" value="' + formatDateToYYYY_MM_DD(job.startDate) + '" required/>\n' +
        '            </div>\n' +
        '            <label for="startTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="startTime" type="time" name="startTime" value="' + job.startTime + '" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="endDate" class="col-sm-2 control-label">To:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endDate" type="date" name="endDate" value="' + formatDateToYYYY_MM_DD(job.endDate) + '" required/>\n' +
        '            </div>\n' +
        '            <label for="endTime" class="col-sm-2 control-label">Time:</label>\n' +
        '            <div class="col-sm-4">\n' +
        '                <input id="endTime" type="time" name="endTime" value="' + job.endTime + '" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row">\n' +
        '            <label for="jobSalary" class="col-sm-2 control-label">Salary:</label>\n' +
        '            <div class="col-sm-10">\n' +
        /* Ofer: 05-Sep-17 */
        '                <input id="jobSalary" class="form-control" type="number" name="jobSalary"\n' +
        '                       placeholder="Salary" value="' + job.salary + '" min="0" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="row">\n' +
        '            <label for="jobNumOfWorkers" class="col-sm-2 control-label">Workers:</label>\n' +
        '            <div class="col-sm-10">\n' +
        /* Ofer: 05-Sep-17 */
        '                <input id="jobNumOfWorkers" class="form-control" type="number" name="jobNumOfWorkers"\n' +
        '                       placeholder="Workers Needed" value="' + job.max_workers_num + '" min="0" required/>\n' +
        '            </div>\n' +
        '        </div>\n' +

        '        <div class="row ">\n' +
        '            <label for="details" class="col-sm-2 control-label">Job details:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="details" name="details"\n' +
        '                      placeholder="Job details">' + job.details + '</textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="row ">\n' +
        '            <label for="requirements" class="col-sm-2 control-label">Requirements:</label>\n' +
        '            <div class="col-sm-10">\n' +
        '            <textarea class="form-control" rows="5" id="requirements" name="requirements"\n' +
        '                      placeholder="Requirements">' + job.requirements + '</textarea>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </form>\n' +
        '</div>\n'
    );
    getJobsFilter(job.name);
    getCities();
    $("#jobLocation_chosen").find("span").html(job.jobLocation);
}

/* Ofer: 05-Sep-17 */
function saveNewJob() {
    if ($("#startDate").val() == "" || $("#startTime").val() == "" || $("#jobNumOfWorkers").val() == "" || $("#jobSalary").val() == "") {
        alert("You Have To Fill The Red Fields.");
        var alertColor = "#ff6058"

        $("#startDate").css("background-color", alertColor);
        $("#startTime").css("background-color", alertColor);
        $("#jobNumOfWorkers").css("background-color", alertColor);
        $("#jobSalary").css("background-color", alertColor);

    }
    else {
        $("#jobForm").submit();
    }
}

function getCities() {
    cities.forEach(insertLocationToDropBox);
    $("#optionL0").remove();
    $('#jobLocation').chosen();
    $('#jobLocation').chosen({allow_single_deselect: true});
}

function getJobsFilter(nameToLoad) {
    $.ajax({
        url: "FeedServlet",
        type: 'GET',
        data: {
            request_type: "getJobsTitleList"
        },
        success: function (listOfJobs) {

            listOfJobs.forEach(insertJobsToDropDown);
            $("#option0").remove();
            $('#title').chosen();
            $('#title').chosen({allow_single_deselect: true});
            if (!jobId.eq("null")) {
                $("#title_chosen").find("span").html(nameToLoad);
            }
        }
    })
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