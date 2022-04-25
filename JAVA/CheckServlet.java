package LSWBoard;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/CheckServlet")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class CheckServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public CheckServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		
		String path = request.getParameter("path")+ip;
		File folder = new File(path);
		String log = "\n";
		
		InputStream postNumIs = request.getPart("postNum").getInputStream();
		InputStreamReader postNumReader = new InputStreamReader(postNumIs);
		Stream<String> postNumString= new BufferedReader(postNumReader).lines();
	    String postNum = postNumString.collect(Collectors.joining());
	    
		if (!folder.exists()) {
			try{
			    folder.mkdir();
		        } 
		        catch(Exception e){
			    e.getStackTrace();
			}     
		}

		log+="========="+ip+"=========\n";
		log+="==="+formdatenow+"==\n";
		log+="postNum : ["+postNum+"]\n";
		String param = "name";
		boolean flag = false;
		InputStream is = request.getPart(param).getInputStream();
		InputStreamReader inputStreamReader = new InputStreamReader(is);
	    Stream<String> streamOfString= new BufferedReader(inputStreamReader).lines();
	    String fileName = streamOfString.collect(Collectors.joining());
	    
	    is = request.getPart(fileName).getInputStream();
	    inputStreamReader = new InputStreamReader(is);
	    streamOfString= new BufferedReader(inputStreamReader).lines();
	    long fileSize = Long.parseLong(streamOfString.collect(Collectors.joining()));
	    String fileName2 = "["+postNum+"] "+fileName;
	    File checkFile = new File(path+"\\"+fileName2);
	    double percent = Math.round((double)checkFile.length()/(double)fileSize*10000)/100.00;
	    if(checkFile.exists()) {
			if(checkFile.length() != fileSize) {
				log+="<덜올림> "+fileName+"\n";
				log+="└> "+percent+"% => ("+checkFile.length()+"/"+fileSize+")\n";
				response.getWriter().write(fileName+"/"+percent+"/"+checkFile.length()+"/");
				flag = true;
			}
			else {
				response.getWriter().write(fileName+"/"+percent+"/"+checkFile.length()+"/");
			}
		}
		log+="=================================";
		
		if(flag) {System.out.println(log);}
	}
}
