package LSWBoard;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet("/UploadServlet")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class UploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    public UploadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException{
		// TODO Auto-generated method stub
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    
	    LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		
		if(request.getParameter("path")==null) {return;}
		
		File folder = new File(request.getParameter("path"));
		if (!folder.exists()) {folder.mkdir();}
		String path = request.getParameter("path")+ip;
		folder = new File(path);
		String log = "\n";
		
		if (!folder.exists()) {folder.mkdir();}
		
		// 이어올리기는 전에 체크 해야된다.
	    try {			    
	    	String yn = request.getParameter("yesno");
	    	String postNum = request.getParameter("postNum");
		    
		    //System.out.println(postNum);
	
			//////////////////////// Part&Write ////////////////////////
			log+="========="+ip+"=========\n";
			log+="==="+formdatenow+"==\n";
			log+="postNum : ["+postNum+"]\n";
			Collection<Part> parts = request.getParts();
			for (Part part : parts) {
				if(part.getContentType()!=null) {
					String fileName = part.getName();
					log+="<업로드> "+fileName+"\n";
					File checkFile = new File(path+"\\["+postNum+"] "+fileName);
				    if(yn.equals("NO")&&checkFile.exists()) {
				    	checkFile.delete();
				    }
	
					if(checkFile.exists()) {
						FileOutputStream stream = new FileOutputStream(path+"\\["+postNum+"] "+fileName, true);
						InputStream is = part.getInputStream();
				        int read;
				        byte[] b =new byte[10000];
				        int bytesBuffered = 0;
				        while((read = is.read(b,0,b.length))!= -1){
				        	stream.write(b,0,read);
				            bytesBuffered += read;
				            if (bytesBuffered > 1024 * 1024 * 25) {
				                bytesBuffered = 0;
				                stream.flush();
				            }
				        }
					    is.close();
					    stream.close();
					}
					else { // notExist
						if(part.getSize()!=0) {
							part.write(path+"\\["+postNum+"] "+fileName);
						}
					}
				}
			}
			log+="=================================";
			//System.out.println(log);
			////////////////////////////////////////////////////////////
			
			/*
			//////////////////////////// COS ///////////////////////////
			int size = (1024 * 1024 * 2048)-1;
			MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8");
			Enumeration fileNames = multi.getFileNames();
			log+="========="+ip+"=========\n";
			log+="==="+formdatenow+"==\n";
			String val = "";
			String fileSize = "";
			while(fileNames.hasMoreElements()) {
				val = (String) fileNames.nextElement();
				log+="<업로드> "+val+"\n";
				fileSize = multi.getParameter(val+" size");
				Long longSize = Long.parseLong(fileSize);
				File checkFile = new File(path+"\\"+val);
				
				if(checkFile.exists()) {
					if(checkFile.length() == longSize) {
						Path oldfile = Paths.get(path+"\\"+val);
						Path newfile = Paths.get(realPath+"\\"+val);
						File nf = new File(realPath+"\\"+val);
						int i = 1;
						String newName = "";
						while(nf.exists()) {
							int li = val.lastIndexOf(".");
							newName = val.substring(0, li)+"("+i+")"+val.substring(li, val.length());
							newfile = Paths.get(realPath+"\\"+newName);
							nf = new File(realPath+"\\"+newName);
							i++;
						}
						if(newName!="") {log+="└><중복된 파일명 변경> "+newName+"\n";}
						Files.move(oldfile, newfile, StandardCopyOption.ATOMIC_MOVE);
						checkFile.delete();
					}
				}
				else { // notExist
					log+="fileNotFound\n";
				}
			}
			log+="=================================";
			System.out.println(log);
			////////////////////////////////////////////////////////////
			*/
	    }catch(Exception e) {
			log+="========="+ip+"=========\n";
			log+="==="+formdatenow+"==\n";
	    	log+="============<업로드 중단>===========\n";
	    	log+="=================================";
			System.out.println(log);
	    }
	}

}
