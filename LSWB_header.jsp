<head>
    <link href="LSWB.css" rel="stylesheet" />
    <script src="LSW_B.js"></script>
    
    <%@ page import="java.sql.Connection" %>
    <%@ page import="java.sql.DriverManager" %>
    <%@ page import="java.sql.ResultSet" %>
    <%@ page import="java.sql.Statement" %>
    <%
    	int option=-1; 
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
    	String connectionUrl =
            "jdbc:sqlserver://localhost:1433;"
                    + "database=LSWBoard;"
                    + "user=LSWB_admin;"
                    + "password=admin6521;"
    				+ "encrypt=true;trustServerCertificate=true;";
    	try (Connection connection = DriverManager.getConnection(connectionUrl);) {
    		Statement stmt = connection.createStatement();
    		ResultSet rs = stmt.executeQuery("SELECT defOption from LSW_admin");
        	while(rs.next()) {
        		option = rs.getInt(1);
        	}
    	}
    	if(option==0){ %>
    		<script src="LSWUp&Down.JS"></script>
    		<script src="LSWEditor_ExecCommand.JS"></script>
    	<%
    	}
    	else if(option==1){
    		//다른 에디터,업로더 import
    	}
    	else{System.out.println("옵션오류");}
    %>

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

</html>