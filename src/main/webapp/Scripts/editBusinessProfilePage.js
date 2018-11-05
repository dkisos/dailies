var businessObj;


$(function () {
    loadLogedInUserFriends();

    var businessId = getUrlParameter('business_id');
    if (businessId != null) {
        $.ajax({
            url: "businessPage",
            type: 'POST',
            data: {
                request_type: "getBusinessInfo",
                business_id: businessId
            },
            success: function (_businessInfo) {
                businessObj = _businessInfo;
                console.log(_businessInfo);
                printBusinessInfo(_businessInfo);
            }
        });
    }
    else {
// Ofer 4/7
        console.log("addNewBusiness");
        $(document).prop('title', 'Add New Business');
        $("#editPageTitle").text('Add New Business');
        $("#submitBtn").replaceWith('<button id="submitBtn" onclick="addNewBusiness()" style="margin-top: 10px" class="btn btn-primary btn-block btn-large">Submit</button>');
        $("#profilePicDisplay").attr("src", "Resources/empty_profile.jpg");
    }
})



function addNewBusiness() {

    var image = document.getElementById('profilePic').files[0];
    var formData = new FormData();
    formData.append("request_type", "registerNewBusiness");
    formData.append("name", $("#name").val());
    formData.append("city", $("#city").val());
    formData.append("street", $("#street").val());
    formData.append("number", $("#number").val());
    formData.append("email", $("#email").val());
    formData.append("phone", $("#phone").val());
    formData.append("about", $("#about").val());
    formData.append("profilePic", image);

    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("first ajax success ");
            window.location.replace("/profilePage.html");
        },
        error: function () {
            console.log("first ajax error ");
        }
    });
}

function printBusinessInfo(businessInfo) {
    $(document).prop('title', 'Edit ' + businessInfo.name);
    $("#editPageTitle").text('Edit ' + businessInfo.name + ' Page');
    $("#name").val(businessInfo.name);
    $("#city").val(businessInfo.city);
    $("#street").val(businessInfo.street);
    $("#number").val(businessInfo.number);
    $("#email").val(businessInfo.email);
    $("#phone").val(businessInfo.phone);
    $("#about").val(businessInfo.about);
    $("#profilePicDisplay").attr("src", businessInfo.profilePicUrl)


}

function registerBusinessUpdates() {

    var image = document.getElementById('profilePic').files[0];
    var formData = new FormData();
    formData.append("request_type", "registerAllUpdates");
    formData.append("id", businessObj.id);
    formData.append("name", $("#name").val());
    formData.append("city", $("#city").val());
    formData.append("street", $("#street").val());
    formData.append("number", $("#number").val());
    formData.append("email", $("#email").val());
    formData.append("phone", $("#phone").val());
    formData.append("about", $("#about").val());
    formData.append("profilePic", image);

    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("first ajax success ");
            window.location.replace("/businessProfilePage.html?business_id=" + businessObj.id);
        },
        error: function () {
            console.log("first ajax error ");
        }
    });


}