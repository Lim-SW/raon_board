package LSWBoard;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet implementation class DeleteServlet
 */
@WebServlet("/DeleteServlet")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class DeleteServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public DeleteServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		request.setCharacterEncoding("UTF-8");
		
		String path = "";
		String val = "";
    	//MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8");
    	Enumeration<?> fileNames = request.getParameterNames();
    	LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		
	    String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    String log = "\n";
	    String postNum = request.getParameter("postNum");
	    
    	File file = null;
    	log+="========="+ip+"=========\n";
    	log+="==="+formdatenow+"==\n";
    	fileNames = request.getParameterNames();
    	while(fileNames.hasMoreElements()) {
    		path = request.getParameter("path")+request.getParameter("folder")+"\\";
    		val = (String) fileNames.nextElement();
			if(val.equals("postNum")) {
				continue;
			}
			val = request.getParameter(val);
			if(val.contains(".")) {
				if(postNum.equals("")) {
					path += val;
				}
				else {
					path += "["+postNum+"] "+val;
				}
				file = new File(path);
				file.delete();
				log+="<파일삭제> "+val+"\n";
			}
    	}
    	log+="=================================";
    	System.out.println(log);
	}

}
