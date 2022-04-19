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

/**
 * Servlet implementation class LSW_SEND
 */
@WebServlet("/LSW_SEND")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class LSW_SEND extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public LSW_SEND() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
    	response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		String title = request.getParameter("title");
		String content = request.getParameter("content");
		String userid = request.getParameter("userid");
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
        	ResultSet rs;
        	int number = 0;
        	
        	if(option.contains("modify")) {
        		rs = stmt.executeQuery("SELECT COUNT(number) FROM LSW_post");
        		number = Integer.parseInt(option.split("/")[1]);
        	}
        	else {
        		rs = stmt.executeQuery("SELECT COUNT(number) FROM LSW_post");
        		while(rs.next()) {
                	number = rs.getInt(1)+1;
                }
        	}
            
            response.getWriter().write(String.valueOf(number));
            stmt = connection.createStatement();
            
            if(option.contains("modify")) {
            	stmt.executeUpdate("UPDATE LSW_post SET title='"+title+"', content='"+content+"', modified=GETUTCDATE() where number="+option.split("/")[1]);
            }
            else {
            	stmt.executeUpdate("insert into LSW_post values ("+number+",'"+title+"','"+userid+"',GETUTCDATE(),null,'"+content+"',0)");
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
	}

}
