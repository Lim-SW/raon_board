<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8" />
	<link href="favicon.ico" rel="icon" type="image/x-icon" />
	<title>LSWB_login</title>
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
	<button class="lpb_login" type="button" onclick=login();>로그인</button>
	<button class="lpb_pw" type="button" onclick=displayAccount();>계정생성</button>
</div>
<div id="account">
	<h2 class="login_id">New ID : 
	<input id="ac_login" class="login_text" type="text" maxlength='10'></input>
	</h2>
	<h2 class="login_pw">New PASSWORD : 
	<input id="ac_pw" class="login_text" type='password' maxlength='10'></input>
	</h2>
	<button class="acsubmit" type="button" onclick=createAccount();>입력완료</button>
</div>
<%} %>
</body>
<script>
	if(!<%=tf%>){location.href="http://112.136.138.139:6522/LSWBoard/LSWB_main.jsp";}
	
	function displayAccount(){
		document.getElementById("account").style.display="block";
	}
	function createAccount(){
		var id = document.getElementById("ac_login").value;
		var pw = document.getElementById("ac_pw").value;
		if(id==''||pw==''){
			alert('ID나 PASSWORD를 잘못 입력하셨습니다.');
		}
		else{
			var formData = new FormData();
			formData.append('id',id);
			formData.append('pw',pw);
			var req = new XMLHttpRequest();
			req.open('POST','/LSWBoard/LSW_ACCOUNT');
            req.send(formData);
			
			req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                    if(req.responseText.length>10){
						alert('이미 존재하는 ID 입니다.');
					}
					else{
						login(id,pw);
					}
                }
            }
		}
	}
	function login(id,pw){
		if(id==undefined){
			var id = document.getElementById("lpb_login").value;
		}
		if(pw==undefined){
			var pw = document.getElementById("lpb_pw").value;
		}
		
		if(id==''||pw==''){
			alert('ID나 PASSWORD를 잘못 입력하셨습니다.');
		}
		else{
			var formData = new FormData();
			formData.append('id',id);
			formData.append('pw',pw);
			formData.append('option','login');
			var req = new XMLHttpRequest();
			req.open('POST','/LSWBoard/LSW_LOGIN');
	        req.send(formData);
	        req.onreadystatechange = function () {
	            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
					if(req.responseText.length>10){
						alert("ID나 PASSWORD가 올바르지 않습니다.");
					}
					else{
						window.location = document.referrer;
					}
	            }
	        }
		}
	}
</script>
</html>