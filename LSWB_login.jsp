<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8" />
	<link href="favicon.ico" rel="icon" type="image/x-icon" />
	<title>LSWBoard_login</title>
</head>
 <jsp:include page="LSWB_header.jsp"></jsp:include>
<body>
<%
	boolean tf = false;
	if((String)session.getAttribute("id")==null) {
		tf = true;
%>
<div>
	<h2 class="login_id">ID : 
	<input id="lpb_login" class="login_text" type="text" maxlength='10'></input>
	</h2>
	<h2 class="login_pw">PASSWORD : 
	<input id="lpb_pw" class="login_text" type='password' maxlength='10'></input>
	</h2>
</div>
<div>
	<button id=loginb class="lpb_login" type="button">로그인</button>
	<button id=acb class="lpb_pw" type="button">계정생성</button>
</div>
<div id="account">
	<h2 class="login_id">New ID : 
	<input id="ac_login" class="login_text" type="text" maxlength='10'></input>
	</h2>
	<h2 class="login_pw">New PASSWORD : 
	<input id="ac_pw" class="login_text" type='password' maxlength='10'></input>
	</h2>
	<button id="acsubmit" class="acsubmit" type="button">입력완료</button>
</div>
<%} %>
</body>
<script>
	loginjsp(<%=tf%>);
</script>
</html>