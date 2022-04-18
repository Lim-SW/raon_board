<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="LSWBoard.LSW_SQL" %>
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
    			<input id="title" class = 'titleInput' type="text" maxlength='30' placeholder="제목을 입력해주세요. (최대 30글자)"></input>
    		</div>
		</div>
		<button id="send" class="writebutton" type="button">작성 완료</button>
	</div>
	<%}
	else{%>
	<h1>PLEASE LOGIN</h1>
	<%} %>

</body>

<%
    LSW_SQL LSW_SQL = new LSW_SQL();
%>

<script>
	var LSWup = new LSWUpDownPrototype('sample', 'LSWup', 1000, 300, 'Upload', 0);
    LSWup.loadFunc.LoadLSWUpDown();
	var LSWEditor = new LSWEditorPrototype('lsw1', 1000, 400, 'sample');
	LSWEditor.loadFunc.LoadLSWEditor();
	
	var button = document.getElementById('send');
	var title = document.getElementById('title');
	
	button.onclick = function(){
		var titleStr = title.value;
		var content = LSWEditor.APIList.getLSWEditPlaceValueById('lsw1');
		var userid = '<%=(String)session.getAttribute("id")%>'
		if(title.value==''){
			alert('제목을 입력해주세요.');	
		}
		else{
			LSWup.eventList.OnMoveFileDone_LSW = function (){
				setTimeout(function (){location.href="http://112.136.138.139:6522/LSWBoard/LSWB_main.jsp";}, 800);
			}
			if(LSWup.APIList.LswIsFileThereAPI('LSWup')!=0){
				LSWup.eventList.OnUpLoadDone_LSW = function(randNum,result){
		            LSWup.APIList.LswInsertPostAPI(titleStr,content,userid,randNum,result);
	            }
	            LSWup.APIList.LswFileUpAPI('LSWup');
			}
			else{
				LSWup.APIList.LswInsertPostAPI(titleStr,content,userid);
			}
            
	        LSWup.eventList.OnStartUpload_LSW = function(){
	        	button.style.pointerEvents = 'none';
	        	title.style.pointerEvents = 'none';
	        	LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'none';
	        	LSWEditor.APIList.getLSWButtonPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'none';
	        	LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.contentEditable = false;
	        }
	    	
	        LSWup.eventList.OnStopUpload_LSW = function(){
	        	button.style.pointerEvents = 'auto';
	        	title.style.pointerEvents = 'auto';
	        	LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'auto';
	        	LSWEditor.APIList.getLSWButtonPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'auto';
	        	LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.contentEditable = true;
	        }
		}
    }
	

</script>

</html>