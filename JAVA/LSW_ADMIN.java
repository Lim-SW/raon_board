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
        	int selectedE = 0;
        	int selectedU = 0;
        	if(option.equals("1")) {
        		ResultSet rs = stmt.executeQuery("SELECT defEditor, defUpload from LSW_admin");
            	while(rs.next()) {
            		selectedE = rs.getInt(1);
            		selectedU = rs.getInt(2);
            		response.getWriter().write(rs.getInt(1)+"/"+rs.getInt(2)+",");
            		}
    	        rs = stmt.executeQuery("SELECT * from Editors where number ="+selectedE);
    	        while(rs.next()) {response.getWriter().write(rs.getInt(1)+"/"+rs.getString(2)+"/"+rs.getInt(3)+",");}
            	rs = stmt.executeQuery("SELECT * from Uploaders where number ="+selectedU);
    	        while(rs.next()) {response.getWriter().write(rs.getInt(1)+"/"+rs.getString(2)+"/"+rs.getInt(3)+",");}
    	        rs = stmt.executeQuery("SELECT path from LSW_admin");
    	        while(rs.next()) {response.getWriter().write(rs.getString(1));}
        	}
        	else if(option.equals("2")) {
        		ResultSet rs = stmt.executeQuery("SELECT * from Editors");
            	while(rs.next()) {
            		response.getWriter().write(rs.getInt(1)+"/"+rs.getString(2)+"/"+rs.getInt(3)+",");
            	}
            	response.getWriter().write("\n");
        		rs = stmt.executeQuery("SELECT * from Uploaders");
            	while(rs.next()) {
            		response.getWriter().write(rs.getInt(1)+"/"+rs.getString(2)+"/"+rs.getInt(3)+",");
            	}
        	}
        	else if(option.equals("3")) {
        		ResultSet rs = stmt.executeQuery("SELECT id from LSW_user");
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
        	else if(option.equals("6")) {
        		ResultSet rs = stmt.executeQuery("SELECT path from LSW_admin");
            	while(rs.next()) {
            		response.getWriter().write(rs.getString(1));
            	}
        	}
        } catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
