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

@WebServlet("/LSW_ACCOUNT")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class LSW_ACCOUNT extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

    public LSW_ACCOUNT() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("UTF-8");
		
		String id = request.getParameter("id");
		String pw = request.getParameter("pw");
		//System.out.println(id+pw);
		try {
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		} catch (ClassNotFoundException e1) {
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
        	ResultSet rs = stmt.executeQuery("SELECT id FROM LSW_user where id='"+id+"'");
	        String IsID = "";
	        while(rs.next()) {
	        	IsID = rs.getString(1);
	        }
	        if(IsID=="") {
	        	int rs2 = stmt.executeUpdate("IF NOT EXISTS(SELECT id FROM LSW_user where id='"+id+"') "
	        			+ "BEGIN INSERT INTO LSW_user values('"+id+"',PwdEncrypt('"+pw+"'),0) END");
	        	response.getWriter().write("");
	        }
	        else {
	        	response.getWriter().write("that ID is already exist");
	        }
        } catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    
	}

}
