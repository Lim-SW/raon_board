<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="LSWBoard.LSW_SQL" %>
<!DOCTYPE html>
<head>
    <link href="LSWB.css" rel="stylesheet" />
    <meta charset="UTF-8">
    <link href="favicon.ico" rel="icon" type="image/x-icon" />
	<title>LSWBoard_admin</title>
	<script src="LSWB_admin.js"></script>
</head>

<body>
	<nav class="topbar" id="topbar"></nav>
	<div id="container">
	<h1 class="admin_banner">ADMIN PAGE</h1>
	<div class="admin_login">
		<h2 class="admin_id">ID : 
			<input id="admin_id" class="login_text" type="text" maxlength='10'></input>
		</h2>
		<h2 class="admin_pw">PASSWORD : 
			<input id="admin_pw" class="login_text" type='password' maxlength='10'></input>
		</h2>
	</div>
	<button class="admin_button" onclick=login();>LOG IN</button>
	</div>
	<div id="container2">
	</div>
</body>

</html>