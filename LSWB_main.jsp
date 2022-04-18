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
    <title>LSWBoard</title>
</head>
<jsp:include page="LSWB_header.jsp"></jsp:include>
<body>
    <div class="center">
		<div class="inside" id="sample"></div>
	</div>
	<div class="board_list_wrap">
        <div class="board_list">
            <div class="board_list_head">
                <div class="num">번호</div>
                <div class="tit">제목</div>
                <div class="writer">글쓴이</div>
                <div class="date">작성일</div>
            </div>
            <div class="board_list_body">
            <%
            LSW_SQL test = new LSW_SQL();
        	List arr = new ArrayList(test.getPostList());
            for(int i=arr.size()-1;i>=0;i--){%>
                <div class="item">
                    <div class="num"><%=((ArrayList) arr.get(i)).get(0)%></div>
                    <div class="tit"><a href='http://112.136.138.139:6522/LSWBoard/LSWB_view.jsp?num=<%=((ArrayList) arr.get(i)).get(0)%>'><%=((ArrayList) arr.get(i)).get(1)%></a></div>
                    <div class="writer"><%=((ArrayList) arr.get(i)).get(2)%></div>
                    <%Object temp = ((ArrayList) arr.get(i)).get(3);
                    String str = temp.toString();
                    StringTokenizer stringTokenizer = new StringTokenizer( str, "." );
                    String[] strArr = new String[stringTokenizer.countTokens()];                    
            		strArr[0] = stringTokenizer.nextToken();%>
                    <div class="date"><%=strArr[0]%></div>
                </div>
            <%}%>
            </div>
        </div>
    </div>
    <%if((String)session.getAttribute("id")!=null) {%>
    <div class="write_button">
    	<button class="writebutton" type="button" onclick = "location.href = 'http://112.136.138.139:6522/LSWBoard/LSWB_post.jsp'">글쓰기</button>
    </div>
    <%} %>
</body>

<script>

</script>

</html>