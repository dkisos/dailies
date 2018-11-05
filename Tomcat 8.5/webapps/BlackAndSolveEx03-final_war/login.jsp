<%--
  Created by IntelliJ IDEA.
  User: OferMe
  Date: 17-Oct-16
  Time: 4:22 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css"/>
    <link rel="stylesheet" type="text/css" href="css/login.css">
    <link rel="stylesheet" type="text/css" href="css/users.css">
    <link rel="stylesheet" type="text/css" href="css/alerts.css">
    <link rel="stylesheet" type="text/css" href="css/animate.css">
    <script type="text/javascript" src="script/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="script/utils.js"></script>
    <script type="text/javascript" src="script/login.js"></script>
    <title>Login</title>
</head>
<body>
<%
    Object errorMessage = request.getAttribute("username_error");
    if (errorMessage != null) {
        String alert="<div class=\"alert errorColor animated flash \"> <span class=\"closebtn\" onclick=\"closeAlert(this)\">&times;</span>" + errorMessage + "</div>";
%>
<div id="alertDiv">
    <%=alert%>
</div>
<%} %>

<div id="user-details" class="user-details">
</div>

<form name="form-login" class="form-horizontal" id="form-login" method="GET" action="/BlackAndSolveEx03-final_war/login">
    <div class="form-group">
        <div class="col-sm-2"><h1>Welcome</h1></div>
    </div>
    <div class="form-group">
        <label for="username" class="col-sm-2 control-label">User Name</label>
        <div class="col-sm-3">
            <input type="text" class="form-control" id="username" placeholder="Moshe" name="username">
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <label class="radio-inline">
                <input type="radio" name="playerTypeOption" class="playerType" id="inlineRadio1" value="human" checked> Human
            </label>
            <label class="radio-inline">
                <input type="radio" name="playerTypeOption" class="playerType" id="inlineRadio2" value="robot"> Robot
            </label>
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-default" id="sing-in-button">Sign in</button>
            <!--<input type="hidden" name="requestType" value="login"/>-->
        </div>
    </div>
</form>

</body>
</html>
