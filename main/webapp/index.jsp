<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login Form</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
    <link rel="stylesheet" type="text/css" href="CSS/bootstrap.min.css"/>
    <link rel="stylesheet" href="CSS/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js"></script>
    <script src="Scripts/jquery-3.1.1.js"></script>
    <script src="Scripts/login.js"></script>
</head>

<body>
<div class="login">
    <h1>Login</h1>
    <div>
        <!--<form method="POST" id="LoginForm" action="/login" name = "LoginServlet">-->
        <input id="username" style=".inputFields" type="text" placeholder="Username" required="required" name="username"
               value="ofer@gmail.com"/>
        <input id="password" style=".inputFields" type="password" placeholder="Password" required="required"
               name="password" value="2"/>
        <button type="button" class="btn btn-primary btn-block btn-large form-control" onclick="login()">Let me in
        </button>
        <span id="errorField"></span>
        <!--</form>-->
    </div>
    <a style="color: white" href="signIn.html">Not a member yet?</a>
</div>

</body>
</html>
