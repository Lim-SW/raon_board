<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="LSWBoard.LSW_SQL" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link href="favicon.ico" rel="icon" type="image/x-icon" />
    <title>LSWBoard_modify</title>
</head>
<jsp:include page="LSWB_header.jsp"></jsp:include>
<body>
	<%
	String postNum = request.getParameter("postNum");
	LSW_SQL lsql = new LSW_SQL();
	String title = lsql.getTitle(postNum);
	title = title.replace("'","\\'");
	String userid = lsql.getUserId(postNum);
	String content = lsql.getContent(postNum);
	content = content.replace("'","\\'");
	String filelist = lsql.getFiles(postNum);
	
	if(userid.equals((String)session.getAttribute("id"))) {  %>		
    <div class="center">
		<div id="sample">
			<div>
    			<h3>Title: </h3>
    			<input id="title" class = 'titleInput' type="text" maxlength='50' placeholder="제목을 입력해주세요. (최대 50글자)"></input>
    		</div>
    	</div>
    	<button id="back" class="writebutton" type="button">취소</button>
		<button id="send" class="writebutton" type="button">수정 완료</button>
		<button id="del" class="writebutton" type="button">체크파일 삭제</button>
	</div>
	<%}else{ %>
	<h1>This is not proper access</h1>
	<%} %>
</body>

<script>
	modifyjsp('<%=postNum%>', '<%=content%>','<%=(String)session.getAttribute("id")%>',"<%=filelist%>", '<%=title%>');
</script>

</html>