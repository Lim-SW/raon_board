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
    <title>LSWBoard_modify</title>
</head>
<jsp:include page="LSWB_header.jsp"></jsp:include>
<body>		
    <div class="center">
		<div class="inside" id="sample"></div>
	</div>
</body>

<%
    LSW_SQL test = new LSW_SQL();
%>

<script>
	var LSWup = new LSWUpDownPrototype('sample', 'LSWup', 1000, 300, 'Upload', 1);
	//온로드 이벤트 필요함
	LSWup.loadFunc.LoadLSWUpDown();
	var LSWEditor = new LSWEditorPrototype('lsw1','1000','400','sample');
	//온로드 이벤트 필요함
	LSWEditor.loadFunc.LoadLSWEditor();
    var LSWdown = new LSWUpDownPrototype('sample', 'LSWdown', 1000, 300, 'Download', 1);
  	//온로드 이벤트 필요함
  	LSWdown.loadFunc.LoadLSWUpDown();
</script>

</html>