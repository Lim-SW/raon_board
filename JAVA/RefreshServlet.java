package LSWBoard;


import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class RefreshServlet
 */
@WebServlet("/RefreshServlet")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class RefreshServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public RefreshServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
    	String postNum = request.getParameter("postNum");
		
    	String path = request.getParameter("path")+request.getParameter("folder");
    	File dir = new File(path);
    	File files[] = dir.listFiles();

    	for (int i = 0; i < files.length; i++) {
    		int start = files[i].getName().indexOf("[");
    		int end = files[i].getName().indexOf("]");
    		String number = files[i].getName().substring(start+1,end);
    		if(number.equals(postNum)) {
    			String tempName = files[i].getName();
        	    response.getWriter().write(tempName.substring(end+2,tempName.length())+"/");
        	    response.getWriter().write(Long.toString(files[i].length())+"/");
    		}
    	}
    }

}
