<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="LSWBoard.LSW_SQL" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link href="favicon.ico" rel="icon" type="image/x-icon" />
    <title>LSWBoard_view</title>
</head>
<jsp:include page="LSWB_header.jsp"></jsp:include>
<body>
    <% 
        String number = request.getParameter("num");
        LSW_SQL viewPage = new LSW_SQL();
        String title = viewPage.getTitle(number);
        String userid = viewPage.getUserId(number);
        String date = viewPage.getPosted(number);
        String modify = viewPage.getModified(number);
        String[] dateS = new String[1];
        String filelist = viewPage.getFiles(number);
        
        if (date!=null){
            StringTokenizer stringTokenizer = new StringTokenizer( date, "." );
            dateS = new String[stringTokenizer.countTokens()];                    
            dateS[0] = stringTokenizer.nextToken();
        }
        else{dateS[0] = "-";}
	    if(modify!=null){
	    	StringTokenizer stringTokenizer = new StringTokenizer( modify, "." );
		    String[] modifyS = new String[stringTokenizer.countTokens()];                    
		    modifyS[0] = stringTokenizer.nextToken();
		    modify = modifyS[0];
	    }
	    else{modify = "Last Modified : -";}
		if(number!=null&&!title.equals("")){%>
    	<div class = "center">
			<div class="postTitle">
	    	<h1><%=title %></h1>
	    	<h5>Posted : <%=dateS[0] %></h5>
	    	<h5><%=modify %></h5>
	    	<h5 class = "postWriter">작성자 : <%=userid %></h5>	    	
	    	</div>
	    <%if(viewPage.getIsDeleted(number)==0){ %>
		<div id="sample">	    

	    </div>
	    <iframe id="ifr"></iframe>

		<button id="dnld" class="writebutton" type="button">파일다운로드</button>
		<%
		if(userid.equals((String)session.getAttribute("id"))){ %>
		<button id="del" class="writebutton" type="button">게시글삭제</button>
		<button id="modify" class="writebutton" type="button">게시글수정</button>
		<%} %>
		<%} %>
	</div>
	<%} else{ %>
	<h1>This is not proper access</h1>
	<%} %>
</body>

<% 	
String content = new String("");
content = viewPage.getContent(number);
%>

<script>
	viewjsp("<%=number%>",'<%=content%>','<%=userid%>','<%=filelist%>');
</script>

</html>