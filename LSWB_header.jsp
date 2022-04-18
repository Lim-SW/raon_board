<head>
    <link href="LSWB.css" rel="stylesheet" />
    <script src="LSWUp&Down.JS"></script>
    <script src="LSWEditor_ExecCommand.JS"></script>
</head>
<body>
    <nav class="topbar" id="topbar">
        <a href="LSWB_main.jsp" class="topbarText">LSWBoard</a>
        <%if((String)session.getAttribute("id")==null) {%>
        <button id="login" class="login hover3" type="button"
        onclick = "location.href = 'http://112.136.138.139:6522/LSWBoard/LSWB_login.jsp'">LOGIN</button>
    	<%}
        else{%>
        <H1 class="idisplay">ID: <%=(String)session.getAttribute("id")%></H1>
        <button id="login" class="login hover3" type="button" onclick = logout();>LOGOUT</button>
    	<%} %>
    	
    </nav>
</body>
<script>
	function logout(){
		var formData = new FormData();
		formData.append('option','logout');
		var req = new XMLHttpRequest();
		req.open('POST','/LSWBoard/LSW_LOGIN');
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            	location.reload();
            }
        }
	}
</script>
</html>