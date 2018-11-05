$(function () {

        $.ajax({
            url: "notificationsPageServlet",
            type: 'POST',
            data: {
                request_type: "getUnreadNotifications"
            },
            success: function (unreadNotifications) {
                console.log(unreadNotifications);
                $("#msgNotifier").find('span').html(unreadNotifications);
            }
        });
});

function notifierClick() {
    window.location.replace("notificationsPage.html");
}