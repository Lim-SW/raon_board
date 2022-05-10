<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link href="favicon.ico" rel="icon" type="image/x-icon" />
    <title>LSWBoard_post</title>
</head>
<jsp:include page="LSWB_header.jsp"></jsp:include>
<body>
	<%if((String)session.getAttribute("id")!=null) {%>
    <div class="center">
		<div id="sample">
		    <div>
    			<h3>Title: </h3>
    			<input id="title" class = 'titleInput' type="text" maxlength='50' placeholder="제목을 입력해주세요. (최대 50글자)"></input>
    		</div>
		</div>
		<button id="back" class="writebutton" type="button">취소</button>
		<button id="send" class="writebutton" type="button">작성 완료</button>
	</div>
	<%}
	else{%>
	<h1>This is not proper access</h1>
	<%} %>

</body>

<script>
	postjsp('<%=(String)session.getAttribute("id")%>');
</script>

</html>