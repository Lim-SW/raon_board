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
		if(title!=null) {
			title = title.replaceAll("'","");
		}
		String content = request.getParameter("content");
		if(content!=null) {
			content = content.replaceAll("'","");
		}
		
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
        	String number = "";
        	String filename = "";
        	String filesize = "";
        	String path = "";
        	
        	if(option.equals("modify")) {
        		number = request.getParameter("postNum");
        	}
        	else if(option.equals("delete")) {
        		number = request.getParameter("postNum");
        		filename = request.getParameter("filename");
        	}
        	else if(option.equals("insert")) {
        		number = request.getParameter("postNum");
        		filename = request.getParameter("filename");
        		filesize = request.getParameter("filesize");
        		path = request.getParameter("path")+"\\["+number+"] "+filename;
        	}
        	else {
        		rs = stmt.executeQuery("SELECT COUNT(number) FROM LSW_post");
        		while(rs.next()) {
                	number = String.valueOf(rs.getInt(1)+1);
                }
        	}
            
            response.getWriter().write(String.valueOf(number));
            stmt = connection.createStatement();
            
            if(option.equals("modify")) {
            	stmt.executeUpdate("UPDATE LSW_post SET title='"+title+"', content='"+content+"', modified=getdate() at time zone 'Korea Standard Time' where number="+number);
            }
            else if(option.equals("delete")) {
            	stmt.executeUpdate("DELETE FROM LSW_files where postNum ="+number+" AND name ='"+filename+"'");
            }
            else if(option.equals("insert")) {
            	stmt.executeUpdate("insert into LSW_files values ("+number+",'"+filename+"',"+filesize+", '"+path+"')");
            }
            else {
            	stmt.executeUpdate("insert into LSW_post values ("+number+",'"+title+"','"+userid+"',getdate() at time zone 'Korea Standard Time' ,null,'"+content+"',0)");
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
	}

}
