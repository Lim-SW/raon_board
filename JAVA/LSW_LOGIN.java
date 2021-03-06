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

@WebServlet("/LSW_LOGIN")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class LSW_LOGIN extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public LSW_LOGIN() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		
		String id = request.getParameter("id");
		String pw = request.getParameter("pw");
		String option = request.getParameter("option");
		
		try {
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		
		String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
		
		try (Connection connection = DriverManager.getConnection(connectionUrl);) {
			if(option==null) {}
			else {
				if(option.equals("admin")) {
					Statement stmt = connection.createStatement();
		        	ResultSet rs = stmt.executeQuery("select PwdCompare('"+pw+"', (select password from LSW_admin where id='"+id+"')) from LSW_admin");
		        	int DBPW = 0;
			        while(rs.next()) {DBPW = rs.getInt(1);}
			        if(DBPW==1) {
			        	HttpSession session = request.getSession();
			        	session.setAttribute("admin", "admin");
			        	response.getWriter().write("admin");
			        	}
				}
				
				else if(option.equals("login")) {
					Statement stmt = connection.createStatement();
		        	ResultSet rs = stmt.executeQuery("select PwdCompare('"+pw+"', (select password from LSW_user where id='"+id+"' AND isDeleted = 0)) from LSW_user");
		        	int DBPW = 0;
			        while(rs.next()) {DBPW = rs.getInt(1);}
			        if(DBPW==1) {
			        	HttpSession session = request.getSession();
			        	session.setAttribute("id", id);
			        }
			        else {
			        	response.getWriter().write("Login is Failed");
			        }
				}
				
				else if(option.equals("off")) {
					HttpSession session = request.getSession();
					session.removeAttribute("admin");
				}
				else {
					HttpSession session = request.getSession();
					if(session.getAttribute("id")!=null) {
						session.removeAttribute("id");
					}
				}
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
