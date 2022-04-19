package LSWBoard;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
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

@WebServlet("/LSW_FILECON")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class LSW_FILECON extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public LSW_FILECON() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    
	    LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		
		String path = "D:\\LSWUpload\\"+ip;
		String realPath = "D:\\LSWUpload\\Uploaded";
		
		int index = Integer.parseInt(request.getParameter("index"));
		String postNum = request.getParameter("postNum");
		String randNum = request.getParameter("randNum");
		
		String log = "\n";
		log+="========="+ip+"=========\n";
		log+="==="+formdatenow+"==\n";
		log+="postNum : ["+postNum+"]\n";
		
		for(int i=0;i<index;i++) {
			String name = request.getParameter("name"+i);
			double size = Double.parseDouble(request.getParameter("size"+i));
			log+="<업로드> "+name+"\n";
			File checkFile = new File(path+"\\["+randNum+"] "+name);
			if(checkFile.exists()) {
				Path oldfile = Paths.get(path+"\\["+randNum+"] "+name);
				Path newfile = Paths.get(realPath+"\\["+postNum+"] "+name);
				File nf = new File(realPath+"\\["+postNum+"] "+name);
				int n = 1;
				String newName = "";
				while(nf.exists()) {
					int li = name.lastIndexOf(".");
					newName = name.substring(0, li)+"("+n+")"+name.substring(li, name.length());
					newfile = Paths.get(realPath+"\\["+postNum+"] "+newName);
					nf = new File(realPath+"\\["+postNum+"] "+newName);
					n++;
				}
				if(newName!="") {log+="└><중복된 파일명 변경> "+newName+"\n";}
				Files.move(oldfile, newfile, StandardCopyOption.ATOMIC_MOVE);
				checkFile.delete();
			}
		}
		
		File postList = new File(realPath+"\\#LSW_POSTED_NUMBER.txt");
		BufferedWriter writer = new BufferedWriter(new FileWriter(postList,true));
		BufferedReader reader = new BufferedReader(new FileReader(postList));
		boolean exist = false;
		String str;
		while (( str = reader.readLine()) != null) {
			if(str.equals(postNum)) {
				exist = true;
				break;
			}
		}
		if(!exist || str == null) {
			writer.write(postNum+"\n");
		}
		
		reader.close();
		writer.close();
		log+="=================================";
		System.out.println(log);
	}

}
