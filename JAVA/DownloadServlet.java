package LSWBoard;


import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/DownloadServlet")
@MultipartConfig(fileSizeThreshold = 1024,maxFileSize = -1,maxRequestSize = -1)
public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private static Map<Object, Object> percentIp = new HashMap<>();
       
    public DownloadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
    	response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", "0");
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    String randomnumber = request.getParameter("num");
		//System.out.println(randomnumber);
	    String s = String.valueOf(percentIp.get(ip+","+randomnumber));
	    response.getWriter().write(s);
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		String path = request.getParameter("path")+request.getParameter("folder")+"\\";
		String val = "";
		LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy??? MM??? dd??? HH??? mm??? ss???"));
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    
	    String log = "\n";
			
		Enumeration<?> fileNames = request.getParameterNames();
		
    	File file = null;
    	List<File> files = new ArrayList<>();
    	String randomnumber = request.getParameter("randomNumber");;
		double progressD = 0;
		double whole = 0;
		double percent = 0;
		String postNum = request.getParameter("postNum");
		String fn = "";
		String option = request.getParameter("option").toLowerCase();;

		log+="========="+ip+"=========\n";
    	log+="==="+formdatenow+"==\n";
    	log+="postNum : ["+postNum+"]\n";
    	while(fileNames.hasMoreElements()) {
    		path = request.getParameter("path")+request.getParameter("folder")+"\\";
			val = (String) fileNames.nextElement();
			val = request.getParameter(val);
			if(val.contains(".")) {
				fn=val;
				if(postNum.equals("")) {
					path += val;
				}
				else {
					path += "["+postNum+"] "+val;
				}
				file = new File(path);
				files.add(file);
				if(postNum.equals("")) {
					log+="<????????????> "+val+"\n";
				}
				else {
					log+="<????????????> "+"["+postNum+"] "+val+"\n";
				}
			}
			else {
				percentIp.put(ip+","+randomnumber,0);
			}
		}

		log+="=================================";
		if(files.size()>1) {
			File Folder = new File(request.getParameter("path")+request.getParameter("folder")+"\\LSWDownZip");
			if (!Folder.exists()) {Folder.mkdir();}
			File zip = new File(request.getParameter("path")+request.getParameter("folder")+"\\LSWDownZip\\"+"LSWUp&Down_"+ip+", "+formdatenow+".zip");
			//System.out.println(zip);
			byte[] b =new byte[10000];
			for (File f : files) {whole += f.length();}
			//String s = "";
	        try (ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zip))) {
	            for (File f : files) {
	            	String tag = "["+postNum+"] ";
	            	path = request.getParameter("path")+request.getParameter("folder")+"\\";
	            	if(!option.equals("tag")) {
		            	f.renameTo(new File(path+f.getName().replace(tag, "")));
		            	f = new File(path+f.getName().replace(tag, ""));
	            	}
	                try (FileInputStream in = new FileInputStream(f)) {
	                    ZipEntry ze = new ZipEntry(f.getName());
	                    out.putNextEntry(ze);
	 
	                    int len = 0;
	                    int bytesBuffered = 0;
	                    while ((len = in.read(b)) > 0) {
	                    	progressD += len;
	                        out.write(b, 0, len);
	                        bytesBuffered += len;
	                        percent = Math.round(progressD/whole*10000)/100.00;
	                        percentIp.put(ip+","+randomnumber,percent);
	                        if (bytesBuffered > 1024 * 1024 * 25) {
	                            bytesBuffered = 0;
	                            out.flush();
	                        }
	                    }
	                    b = new byte[10000];
	                    out.closeEntry();
	                }
	            	if(!option.equals("tag")) {
	            		f.renameTo(new File(path+tag+f.getName()));
	            	}
	            }
	            percent = 100.00;
	            percentIp.put(ip+","+randomnumber,percent);
	            //System.out.println(percent);
	        }
			
			FileInputStream in2 = new FileInputStream(zip);
			String mimeType = getServletContext().getMimeType(zip.toString());
			mimeType = "application/octet-stream";
			response.setContentType(mimeType);
	        String sEncoding = new String(zip.getName().getBytes("euc-kr"),"8859_1");
	        String value = "attachment;filename=\""+sEncoding+"\"";
	        response.setHeader("Content-Disposition", value);
	        //response.setContentLengthLong(zip.length());
	        
	        ServletOutputStream out2 = response.getOutputStream();
	        
	        int read;
	        while((read = in2.read(b,0,b.length))!= -1){
	        	out2.write(b,0,read);
	        }
	        in2.close();
	        out2.close();
	        zip.delete();
			//System.out.println(zip);
        }
		
		else {
			whole = file.length();
			byte[] b = new byte[10000];
			FileInputStream in = new FileInputStream(file);
			String mimeType = getServletContext().getMimeType(file.toString());
			mimeType = "application/octet-stream";
			response.setContentType(mimeType);
			String fileName = "";
        	if(!option.equals("tag")) {
        		fileName = fn;
        	}
        	else {
        		fileName = "["+postNum+"] "+fn;
        	}
			String sEncoding = new String(fileName.getBytes("UTF-8"),"8859_1");
		    String value = "attachment;filename=\""+sEncoding+"\"";
		    response.setHeader("Content-Disposition", value);
		    //response.setContentLengthLong(file.length());
		    
		    ServletOutputStream out = response.getOutputStream();
		    
		    int read = 0;
            int bytesBuffered = 0;
		    while((read = in.read(b,0,b.length))!= -1){
		    	progressD += read;
		     	out.write(b,0,read);
                bytesBuffered += read;
                percent = Math.round(progressD/whole*10000)/100.00;
                percentIp.put(ip+","+randomnumber,percent);
                if (bytesBuffered > 1024 * 1024 * 25) {
                    bytesBuffered = 0;
                    out.flush();
                }
		    }
            percent = 100.00;
            percentIp.put(ip+","+randomnumber,percent);
		    in.close();
		    out.close();
		}
		System.out.println(log);
	}
}