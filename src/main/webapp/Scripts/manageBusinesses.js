$(function () {
    $.ajax({
        url: "businessPage",
        type: 'POST',
        data: {request_type: "getOwnerBusinessesList"},
        success: function (businesses) {
            var mapstr;
            var map = new Map();
            mapstr = JSON.stringify(businesses);
            map = JSON.parse(mapstr);

            for (var id in map) {
                var link = getLink(id + map[id] + "Form", "businessPage", map[id], [["request_type", "loadBusinessPage"], ["business_id", id]]);
                console.log(id);

                $("#businessInfoPanelBody").append('<div id="business'+id+'Div">'+link + createEditDeleteButtons(id, map[id])+'<hr class="hr-soften"></div>');
            }
        }
    });
    loadLogedInUserFriends();
});



function deleteBusinessById(id) {
    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: {
            request_type: "deleteBusinessById",
            business_id:id
        },
        success: function (flag) {
            if(flag==0){
                console.log("fail");
            }else {
                console.log("success");
                $("#business"+id+"Div").remove();

            }
        }
    });
}

function deleteBusinessClick(id, name) {
    if (confirm("Are You Sure You Want To Delete " + name + " ?") == true) {
        console.log("You pressed OK!");
        console.log(id, name);
        deleteBusinessById(id);
    } else {
        console.log("You pressed Cancel!");
    }
}
function editBusinessClick(id) {
    $.ajax({
        url: "editBusinessServlet",
        type: 'POST',
        data: {
            request_type: "redirectToEditBusinessById",
            business_id:id
        },
        success: function (flag) {
            if(flag==0){
                window.location.replace("/ErrorPage.html");
            }else {
                window.location.replace("/editBusinessProfilePage.html?business_id="+id);
            }
        }
    });
}

function createEditDeleteButtons(id, name) {
    var res = '<div align="right">' +
        '<button class="btn btn-outline btn-primary btn-xs editDeleteBtn" onclick="editJobsClick('+id+',\''+name+'\')">Edit Jobs</button>' +
        '<button class="btn btn-outline btn-primary btn-xs editDeleteBtn" onclick="editBusinessClick('+id+')">Edit Business</button>' +
        '<button class="btn btn-outline btn-danger btn-xs editDeleteBtn" onclick="deleteBusinessClick('+id+',\''+name+'\')">Delete</button>' +

        '</div>'
    return res;
}

function addBusiness() {
window.location.replace("/editBusinessProfilePage.html");
}

