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
    <div class = "center">
    <% 
        String number = request.getParameter("num");
        LSW_SQL viewPage = new LSW_SQL();
        String title = viewPage.getTitle(number);
        String userid = viewPage.getUserId(number);
        String date = viewPage.getPosted(number);
        String modify = viewPage.getModified(number);
        String[] dateS = new String[1];
        
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
    %>
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
		<%} %>
		<%} %>
	</div>
</body>

<% 	
String content = new String("");
content = viewPage.getContent(number);
%>

<script>

    var LSWdown = new LSWUpDownPrototype('sample', 'LSWdown', 1000, 300, 'Download', 1);
    LSWdown.eventList.OnIframeLoaded_LSW = function(){
        LSWdown.APIList.LswRefreshAPI('LSWdown','<%=number%>');
    }
    LSWdown.loadFunc.LoadLSWUpDown();
	
    var content = '<%=content%>';
    LSWdown.APIList.LswPostContentAPI('ifr', content);
    
    var dnButton = document.getElementById('dnld');
    LSWdown.eventList.OnRefreshDone_LSW = function(){
       	if(LSWdown.APIList.LswIsDownThereAPI('LSWdown')==0){dnButton.style.display='none';}
    }
    
    if(dnButton!=null)dnButton.onclick = function(){
    	LSWdown.APIList.LswFileDownAPI('LSWdown');
    	LSWdown.eventList.OnStartDownload_LSW = function(){
    		dnButton.disabled = true;
    	}
    	LSWdown.eventList.OnDownLoadDone_LSW = function(){
           	dnButton.disabled = false;
        }
    }
    
    var dlButton = document.getElementById('del');
    if(dlButton!=null)dlButton.onclick = function(){
        var yn = confirm("게시글을 삭제하시겠습니까?");
        if(yn){
            var postNum = window.location.search.split("num=")[1];
            var formData = new FormData();
            var req = new XMLHttpRequest();
            req.open("POST", '/LSWBoard/LSW_DELETE');
            formData.append('postNum',postNum);
            req.send(formData);
			req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                    location.href="http://112.136.138.139:6522/LSWBoard/LSWB_main.jsp";
                }
            }
        }
    }
    
</script>

</html>