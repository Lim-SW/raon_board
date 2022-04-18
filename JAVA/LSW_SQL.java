package LSWBoard;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
 
public class LSW_SQL {
    public void test() throws ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        
        /*
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM INFORMATION_SCHEMA.TABLES");
            
            while(rs.next()) {
            	System.out.println(rs.getString(3));
            }
        
            rs.close();
            stmt.close();
            connection.close();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        */
        
    }
    
    public ArrayList getPostList() throws ClassNotFoundException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        ArrayList arr = new ArrayList();
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM LSW_post where isDeleted = 0");
            
            while(rs.next()) {
            	ArrayList al = new ArrayList();
            	/*
            	System.out.println("게시물번호:"+rs.getInt(1));
            	System.out.println("제목:"+rs.getString(2));
            	System.out.println("작성자:"+rs.getString(3));
            	System.out.println("작성일자:"+rs.getTimestamp(4));
            	System.out.println("내용:"+rs.getString(6));
            	*/
            	al.add(rs.getInt(1));
            	al.add(rs.getString(2));
            	al.add(rs.getString(3));
            	al.add(rs.getTimestamp(4));
            	al.add(rs.getString(6));
            	
            	arr.add(al);
            }
            
            rs.close();
            stmt.close();
            connection.close();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }

        return arr;
    }
    
    public String getContent(String num) throws ClassNotFoundException {
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
        	Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT content FROM LSW_post where number="+num);
            int isDeleted = getIsDeleted(num);
            if(isDeleted == 1) {return null;}
            
            String content = new String("");
            
            while(rs.next()) {
            	content = rs.getString(1);
            }
            
            return content;
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        
    	return null;
    }
    
    public String getTitle(String num) throws ClassNotFoundException {
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
        	Statement stmt = connection.createStatement();
        	ResultSet rs = stmt.executeQuery("SELECT title FROM LSW_post where number="+num);
            int isDeleted = getIsDeleted(num);
            if(isDeleted == 1) {return null;}
        	
        	String title = new String("");
            
            while(rs.next()) {
            	title = rs.getString(1);
            }
            
            return title;
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        
    	return null;
    }
    
    public String getUserId(String num) throws ClassNotFoundException {
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
        	Statement stmt = connection.createStatement();
        	ResultSet rs = stmt.executeQuery("SELECT userid FROM LSW_post where number="+num);
            int isDeleted = getIsDeleted(num);
            if(isDeleted == 1) {return null;}
        	
        	String userid = new String("");
            
            while(rs.next()) {
            	userid = rs.getString(1);
            }
            
            return userid;
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        
    	return null;
    }
    
    public String getPosted(String num) throws ClassNotFoundException {
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
        	Statement stmt = connection.createStatement();
        	ResultSet rs = stmt.executeQuery("SELECT posted FROM LSW_post where number="+num);
            int isDeleted = getIsDeleted(num);
            if(isDeleted == 1) {return null;}
        	
        	Timestamp posted = new Timestamp(0);
            
            while(rs.next()) {
            	posted = rs.getTimestamp(1);
            }
            
            return posted.toString();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        
    	return null;
    }
    
    public String getModified(String num) throws ClassNotFoundException {
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
        	Statement stmt = connection.createStatement();
        	ResultSet rs = stmt.executeQuery("SELECT modified FROM LSW_post where number="+num);
            int isDeleted = getIsDeleted(num);
            if(isDeleted == 1) {return null;}
        	
        	Timestamp modified = new Timestamp(0);
            
            while(rs.next()) {
            	modified = rs.getTimestamp(1);
            }
            
            if(modified==null){
            	return null;
            }
            
            return "Last Modified : "+modified;
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        
    	return null;
    }
    
    public int getIsDeleted(String num) throws ClassNotFoundException{
    	Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");  
        String connectionUrl =
                "jdbc:sqlserver://localhost:1433;"
                        + "database=LSWBoard;"
                        + "user=LSWB_admin;"
                        + "password=admin6521;"
        				+ "encrypt=true;trustServerCertificate=true;";
 
        try (Connection connection = DriverManager.getConnection(connectionUrl);) {
        	Statement stmt = connection.createStatement();
        	ResultSet rs = stmt.executeQuery("SELECT isDeleted FROM LSW_post where number="+num);
	        int isDeleted = 0;
	        while(rs.next()) {
	        	isDeleted = rs.getInt(1);
	        }
	        if(isDeleted == 1) {
	        	return 1;
	        }
	        else {
	        	return 0;
	        }
        } catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
    }
    
}