package LSWBoard;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


@WebServlet("/LSW_ADMIN")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class LSW_ADMIN extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public LSW_ADMIN() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String option = request.getParameter("option");
		try {
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		} catch (ClassNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}  
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
        	Statement stmt = connection.createStatement();
        	int selected = 0;
        	
        	HttpSession session = request.getSession();
        	if(option.equals("6")||option.equals("7")){
            	if(option.equals("6")) {
            		ResultSet rs = stmt.executeQuery("SELECT path from LSW_admin");
                	while(rs.next()) {
                		response.getWriter().write(rs.getString(1));
                	}
            	}
            	else if(option.equals("7")) {
            		ResultSet rs = stmt.executeQuery("SELECT defOption from LSW_admin");
                	while(rs.next()) {
                		response.getWriter().write(rs.getString(1));
                	}
            	}
        	}
        	else if(session.getAttribute("admin")!=null){
            	if(option.equals("1")) {
            		ResultSet rs = stmt.executeQuery("SELECT defOption from LSW_admin");
                	while(rs.next()) {
                		selected = rs.getInt(1);
                	}
                	rs = stmt.executeQuery("SELECT * from LSW_defOption where number ="+selected);
        	        while(rs.next()) {response.getWriter().write(rs.getString(2)+"/"+rs.getString(3)+",");}
        	        rs = stmt.executeQuery("SELECT path from LSW_admin");
        	        while(rs.next()) {response.getWriter().write(rs.getString(1));}
            	}
            	else if(option.equals("2")) {
            		ResultSet rs = stmt.executeQuery("SELECT * from LSW_defOption");
                	while(rs.next()) {
                		response.getWriter().write(rs.getString(2)+"/"+rs.getString(3)+",");
                	}
            	}
            	else if(option.equals("3")) {
            		ResultSet rs = stmt.executeQuery("SELECT id from LSW_user where isDeleted=0");
                	while(rs.next()) {
                		response.getWriter().write(rs.getString(1)+"/");
                	}
            	}
            	else if(option.equals("3.5")) {
            		ResultSet rs = stmt.executeQuery("SELECT id from LSW_user where isDeleted=1");
                	while(rs.next()) {
                		response.getWriter().write(rs.getString(1)+"/");
                	}
            	}
            	else if(option.equals("4")) {
            		ResultSet rs = stmt.executeQuery("SELECT number, title, userid from LSW_post where isDeleted=1");
                	while(rs.next()) {
                		response.getWriter().write(rs.getString(1)+"/"+rs.getString(2)+"/"+rs.getString(3)+",");
                	}
            	}
            	else if(option.equals("5")) {
            		ResultSet rs = stmt.executeQuery("SELECT number, title, userid from LSW_post where isDeleted=0");
                	while(rs.next()) {
                		response.getWriter().write(rs.getString(1)+"/"+rs.getString(2)+"/"+rs.getString(3)+",");
                	}
            	}
            	else if(option.equals("CD")) {
            		stmt.executeUpdate("UPDATE LSW_admin SET path='"+request.getParameter("path")+"' where id='dlj0605';");
            		response.getWriter().write("완료");
            	}
            	else if(option.equals("DP")) {
            		stmt.executeUpdate("UPDATE LSW_post SET isDeleted=1 where number="+request.getParameter("postNum")+";");
            		response.getWriter().write("완료");
            	}
            	else if(option.equals("RP")) {
            		stmt.executeUpdate("UPDATE LSW_post SET isDeleted=0 where number="+request.getParameter("postNum")+";");
            		response.getWriter().write("완료");
            	}
            	else if(option.equals("DU")) {
            		stmt.executeUpdate("UPDATE LSW_user SET isDeleted=1 where id='"+request.getParameter("id")+"';");
            		stmt.executeUpdate("UPDATE LSW_post SET isDeleted=1 where userid='"+request.getParameter("id")+"';");
            		response.getWriter().write("완료");
            	}
            	else if(option.equals("RU")) {
            		stmt.executeUpdate("UPDATE LSW_user SET isDeleted=0 where id='"+request.getParameter("id")+"';");
            		response.getWriter().write("완료");
            	}
            	else if(option.equals("CO")) {
            		stmt.executeUpdate("UPDATE LSW_defOption SET selected=0;");
            		stmt.executeUpdate("UPDATE LSW_defOption SET selected=1 where number="+request.getParameter("selected"));
            		stmt.executeUpdate("UPDATE LSW_admin SET defOption="+request.getParameter("selected"));
            		
            		response.getWriter().write("완료");
            	}
        	}

        	else {
        		response.getWriter().write("세션없음");
        	}
        	

        } catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
