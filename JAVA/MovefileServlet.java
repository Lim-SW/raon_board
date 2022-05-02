package LSWBoard;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/MovefileServlet")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class MovefileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public MovefileServlet() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    
	    LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		
		File rpf = new File(request.getParameter("path"));
		if(!rpf.exists()) {rpf.mkdir();}
		String path = request.getParameter("path")+ip;
		rpf = new File(path);
		if(!rpf.exists()) {rpf.mkdir();}
		String realPath = request.getParameter("path")+request.getParameter("folder");
		rpf = new File(realPath);
		if(!rpf.exists()) {rpf.mkdir();}
		
		int index = Integer.parseInt(request.getParameter("index"));
		String postNum = request.getParameter("postNum");
		String randNum = request.getParameter("randNum");
		String log = "\n";
		log+="========="+ip+"=========\n";
		log+="==="+formdatenow+"==\n";
		log+="postNum : ["+postNum+"]\n";
		
		for(int i=0;i<index;i++) {
			String name = request.getParameter("name"+i);
			log+="<파일옮김> "+name+"\n";
			File checkFile = new File(path+"\\["+randNum+"] "+name);
			if(checkFile.exists()) {
				Path oldfile = Paths.get(path+"\\["+randNum+"] "+name);
				Path newfile = Paths.get(realPath+"\\["+postNum+"] "+name);
				File nf = new File(realPath+"\\["+postNum+"] "+name);
				if(postNum.equals("")) {
					newfile = Paths.get(realPath+"\\"+name);
					nf = new File(realPath+"\\"+name);
				}
				int n = 1;
				String newName = "";
				while(nf.exists()) {
					int li = name.lastIndexOf(".");
					newName = name.substring(0, li)+"("+n+")"+name.substring(li, name.length());
					newfile = Paths.get(realPath+"\\["+postNum+"] "+newName);
					nf = new File(realPath+"\\["+postNum+"] "+newName);
					if(postNum.equals("")) {
						newfile = Paths.get(realPath+"\\"+newName);
						nf = new File(realPath+"\\"+newName);
					}
					n++;
				}
				if(newName!="") {log+="└><중복된 파일명 변경> "+newName+"\n";
				response.getWriter().write(newName+"/");}
				else {response.getWriter().write(name+"/");}
				Files.move(oldfile, newfile, StandardCopyOption.ATOMIC_MOVE);
				
				checkFile.delete();
			}
		}

		log+="=================================";
		System.out.println(log);
	}

}
