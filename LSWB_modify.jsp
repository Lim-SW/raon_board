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
	String userid = lsql.getUserId(postNum);
	String content = lsql.getContent(postNum);
	
	if(userid.equals((String)session.getAttribute("id"))) {  %>		
    <div class="center">
		<div id="sample">
			<div>
    			<h3>Title: </h3>
    			<input id="title" class = 'titleInput' type="text" maxlength='30' placeholder="제목을 입력해주세요. (최대 30글자)" value="<%=title%>"></input>
    		</div>
    	</div>
    	<button class="writebutton" type="button" onclick=back();>취소</button>
		<button id="send" class="writebutton" type="button" onclick=send();>수정 완료</button>
	</div>
	<%}else{ %>
	<h1>This is not proper access</h1>
	<%} %>
</body>

<script>
	var LSWdown = new LSWUpDownPrototype('sample', 'LSWdown', 1000, 300, 'Download', 0);
	LSWdown.eventList.OnDownIframeLoaded_LSW = function(iFrame){
		LSWdown.APIList.LswRefreshAPI('LSWdown','<%=postNum%>');
	}
	LSWdown.loadFunc.LoadLSWUpDown();
	var LSWup = new LSWUpDownPrototype('sample', 'LSWup', 1000, 300, 'Upload', 0);
	LSWup.loadFunc.LoadLSWUpDown();
	var LSWEditor = new LSWEditorPrototype('lsw1','1000','400','sample');
	LSWEditor.eventList.OnEditorLoaded_LSW = function(id, iFrame){
		LSWEditor.APIList.setContentOnEditor(id,'<%=content%>');
	}
	LSWEditor.loadFunc.LoadLSWEditor();
	
	function back(){
		window.location = document.referrer;
	}
	
	function send(){
		var button = document.getElementById('send');
		var title = document.getElementById('title');
		var titleStr = title.value;
		var content = LSWEditor.APIList.getLSWEditPlaceValueById('lsw1');
		var userid = '<%=(String)session.getAttribute("id")%>'
		if(title.value==''){
			alert('제목을 입력해주세요.');	
		}
		else{
			LSWup.eventList.OnMoveFileDone_LSW = function (){
				setTimeout(function (){location.href="http://112.136.138.139:6522/LSWBoard/LSWB_view.jsp?num="+<%=postNum%>;}, 800);
			}
			if(LSWup.APIList.LswIsFileThereAPI('LSWup')!=0){
				LSWup.eventList.OnUpLoadDone_LSW = function(randNum,result){
		            //여기 업데이트문으로 바꿔야함
					LSWup.APIList.LswInsertPostAPI(titleStr,content,userid,"modify/"+'<%=postNum%>',randNum,result);
	            }
	            LSWup.APIList.LswFileUpAPI('LSWup');
			}
			else{
				//여기랑
				LSWup.APIList.LswInsertPostAPI(titleStr,content,userid,"modify/"+'<%=postNum%>');
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