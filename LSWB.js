function getOption(){
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    var formData = new FormData();
    formData.append('option',7);
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            ongetoptiondone(req.responseText);
        }
    }
}

function ongetoptiondone(response){}

function getPath(){
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    var formData = new FormData();
    formData.append('option',6);
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            ongetpathdone(req.responseText);
        }
    }
}

function ongetpathdone(path){}

function viewjsp(number, content, userid, filelist){
    var IFR = document.getElementById('ifr');
    var agent = navigator.userAgent.toLowerCase();
    if((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)){
        IFR.onload = function(){IFR.contentDocument.body.outerHTML = content;}
    }
    else{IFR.contentDocument.body.outerHTML = content;}

    var del = document.getElementById('del');
    if(del!=null)del.onclick = function(){
        var yn = confirm("게시글을 삭제하시겠습니까?");
        if(yn){
            var postNum = window.location.search.split("num=")[1];
            var formData = new FormData();
            var req = new XMLHttpRequest();
            req.open("POST", '/LSWBoard/LSW_DELETE');
            formData.append('postNum',postNum);
            formData.append('id',userid)
            req.send(formData);
            req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                    location.href="http://112.136.138.139:6522/LSWBoard/LSWB_main.jsp";
                }
            }
        }
    }

    var submit = document.getElementById('modify');
    if(submit!=null)submit.onclick = function (){
        var sub = document.createElement('form');
        sub.action="./LSWB_modify.jsp";
        sub.method = 'post';
        var postNum = document.createElement('input');
        postNum.type = 'hidden';
        postNum.name = 'postNum';
        postNum.value = number;
        sub.appendChild(postNum);
        document.body.appendChild(sub);
        sub.submit();
    }

    ongetoptiondone = function(response){
        //////////////////////////// LSW 이면 ////////////////////////////
        if(response == 0){
            var obj = {'divId':'sample','id':'LSWdown','width':1000,'height':300,'option':'Download','bp':1};
            var LSWdown = new LSWUpDownPrototype(obj);
            LSWdown.eventList.OnDownIframeLoaded_LSW = function(){
                filelist = filelist.split('/');
                filelist.pop();
                for(var i=0;i<filelist.length;i++){
                    filelist[i] = filelist[i].split(',');
                    LSWdown.APIList.LswListItemAPI('LSWdown',filelist[i][0],filelist[i][1]);
                }
            }
            LSWdown.loadFunc.LoadLSWUpDown();
            

            
            var dnButton = document.getElementById('dnld');
            LSWdown.eventList.OnRefreshDone_LSW = function(){
                if(LSWdown.APIList.LswIsDownThereAPI('LSWdown')==0){dnButton.style.display='none';}
            }
            
            if(dnButton!=null)dnButton.onclick = function(){
                ongetpathdone = function(path){
                    LSWdown.APIList.LswFileDownAPI('LSWdown',path,'Uploaded',number);
                    LSWdown.eventList.OnStartDownload_LSW = function(){
                        dnButton.disabled = true;
                    }
                    LSWdown.eventList.OnDownLoadDone_LSW = function(){
                        dnButton.disabled = false;
                    }
                }
                getPath();
            }
        }
        //////////////////////////// 다른 업로더, 에디터 추가 ////////////////////////////
        else if(response == 1){ // 임시 테스트용 업로더,에디터
            var temp1 = document.createElement('h1');
            temp1.innerText = '관리자 페이지 코드 랩핑 테스트';
            var temp2 = document.createElement('h1');
            temp2.innerText = '관리자 페이지에서 다른 에디터 / 업로더 옵션 적용시 보여집니다';
            var sample = document.getElementById('sample');
            sample.appendChild(temp1);
            sample.appendChild(temp2);
        }
        else if(response == 2){
            var download1 = new LseDownload({
                id: 'sample',
                width: '100%',
                height: '125px',
                /* buttonOption: '0' */
                onLoadEvent: function(){}
              });
        }
    }
    getOption();
    
}

function postjsp(session){
    var back = document.getElementById('back');
    if(back!=null)back.onclick = function (){
        window.location = document.referrer;
    }

    ongetoptiondone = function(response){
        //////////////////////////// LSW 이면 ////////////////////////////
        if(response == 0){
            var obj = {'divId':'sample','id':'LSWup','width':1000,'height':300,'option':'Upload','bp':0};
            var LSWup = new LSWUpDownPrototype(obj);
            LSWup.loadFunc.LoadLSWUpDown();
            var obj = {'id':'lsw1', 'width':1000, 'height':400, 'divName':'sample'};
            var LSWEditor = new LSWEditorPrototype(obj);
            LSWEditor.loadFunc.LoadLSWEditor();

            var sb = document.getElementById('send');
            if(sb!=null)sb.onclick = function send(){
                var button = document.getElementById('send');
                var title = document.getElementById('title');
                var content = LSWEditor.APIList.getLSWEditPlaceValueById('lsw1');
                var userid = session;
                if(title.value==''){
                    alert('제목을 입력해주세요.');	
                }
                else{
                    ongetpathdone = function(path){
                        if(LSWup.APIList.LswIsFileThereAPI('LSWup')!=0){
                            LSWup.eventList.OnUpLoadDone_LSW = function(randNum,result){
                                var formData = new FormData();
                                var req = new XMLHttpRequest();
                                req.open("POST", '/LSWBoard/LSW_SEND');
                                formData.append('title',title.value);
                                formData.append('content',content);
                                formData.append('userid',userid);
                                formData.append('option','post');
                                req.send(formData);
                                req.onreadystatechange = function () {
                                    if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                                        LSWup.eventList.OnMoveFileDone_LSW = function (result, folder){
                                            insert(result,req.responseText,path+folder);
                                        }
                                        LSWup.APIList.LswMoveFileAPI(path,'Uploaded',randNum,req.responseText,result);
                                    }
                                }                    
                            }
                            LSWup.APIList.LswFileUpAPI('LSWup',path);
                        }
                        else{
                            LSWup.eventList.OnMoveFileDone_LSW = function (){
                                var formData = new FormData();
                                var req = new XMLHttpRequest();
                                req.open("POST", '/LSWBoard/LSW_SEND');
                                formData.append('title',title.value);
                                formData.append('content',content);
                                formData.append('userid',userid);
                                formData.append('option',"post");
                                req.send(formData);
                                req.onreadystatechange = function () {
                                    if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                                        location.href="http://112.136.138.139:6522/LSWBoard/LSWB_view.jsp?num="+req.responseText;
                                    }
                                }
                            }
                            LSWup.APIList.LswMoveFileAPI(path,'Uploaded');
                        }
                    }
                    getPath();
                    
                    LSWup.eventList.OnStartUpload_LSW = function(){
                        button.style.pointerEvents = 'none';
                        title.style.pointerEvents = 'none';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'none';
                        LSWEditor.APIList.getLSWButtonPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'none';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.contentEditable = false;
                    }
                    
                    LSWup.eventList.OnStopUpload_LSW = function(){
                        button.style.pointerEvents = 'auto';
                        title.style.pointerEvents = 'auto';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'auto';
                        LSWEditor.APIList.getLSWButtonPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'auto';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.contentEditable = true;
                    }
                }
            }
        }
        //////////////////////////// 다른 업로더, 에디터 추가 ////////////////////////////
        else if(response == 1){ // 임시 테스트용 업로더,에디터
            var temp1 = document.createElement('h1');
            temp1.innerText = '관리자 페이지 코드 랩핑 테스트';
            var temp2 = document.createElement('h1');
            temp2.innerText = '관리자 페이지에서 다른 에디터 / 업로더 옵션 적용시 보여집니다';
            var sample = document.getElementById('sample');
            sample.appendChild(temp1);
            sample.appendChild(temp2);
        }
        else if(response == 2){
            var upload1 = new LseUpload({
                id: 'sample',
                width: '100%',
                height: '125px',
                /* buttonOption: '0' */
                onLoadEvent: function(){},
                onUploadEvent: function(){},
                onEndUploadEvent: function(){}
            });
            
            var editor1 = new LseEditor({
                id: 'sample',
                width: '100%',
                height: '250px'
            });
        }
    }
    getOption();
}

function modifyjsp(postNum, content, session, filelist){
    var back = document.getElementById('back');
    if(back!=null)back.onclick = function (){
        window.location = document.referrer;
    }
    
    ongetoptiondone = function(response){
        //////////////////////////// LSW 이면 ////////////////////////////
        if(response == 0){
            var obj = {'divId':'sample','id':'LSWdown','width':1000,'height':300,'option':'Download','bp':1};
            var LSWdown = new LSWUpDownPrototype(obj);
            LSWdown.eventList.OnDownIframeLoaded_LSW = function(iFrame){
                filelist = filelist.split('/');
                filelist.pop();
                for(var i=0;i<filelist.length;i++){
                    filelist[i] = filelist[i].split(',');
                    LSWdown.APIList.LswListItemAPI('LSWdown',filelist[i][0],filelist[i][1]);
                }
            }
            
            LSWdown.eventList.OnDeleted_LSW = function(result){
                for(var i=0;i<result.length;i++){
                    var req = new XMLHttpRequest();
                    req.open("POST", '/LSWBoard/LSW_SEND');
                    var formData = new FormData();
                    formData.append('postNum',postNum);
                    formData.append('filename',result[i]);
                    formData.append('option',"delete");
                    req.send(formData);
                }
            }
            LSWdown.loadFunc.LoadLSWUpDown();
            var obj = {'divId':'sample','id':'LSWup','width':1000,'height':300,'option':'Upload','bp':0};
            var LSWup = new LSWUpDownPrototype(obj);
            LSWup.loadFunc.LoadLSWUpDown();
            var obj = {'id':'lsw1', 'width':1000, 'height':400, 'divName':'sample'};
            var LSWEditor = new LSWEditorPrototype(obj);
            LSWEditor.eventList.OnEditorLoaded_LSW = function(id, iFrame){
                LSWEditor.APIList.setContentOnEditor(id,content);
            }
            LSWEditor.loadFunc.LoadLSWEditor();

            var del = document.getElementById('del');
            if(del!=null)del.onclick = function (){
                ongetpathdone = function(path){
                LSWdown.APIList.LswFileDeleteAPI('LSWdown',path,'Uploaded',postNum);
                }
                getPath();
            }
            
            var send = document.getElementById('send');
            if(send!=null)send.onclick = function (){
                var button = document.getElementById('send');
                var del = document.getElementById('del');
                var title = document.getElementById('title');
                var content = LSWEditor.APIList.getLSWEditPlaceValueById('lsw1');
                var userid = session;
                if(title.value==''){
                    alert('제목을 입력해주세요.');	
                }
                else{
                    ongetpathdone = function(path){
                        if(LSWup.APIList.LswIsFileThereAPI('LSWup')!=0){
                            LSWup.eventList.OnUpLoadDone_LSW = function(randNum,result){
                                var formData = new FormData();
                                var req = new XMLHttpRequest();
                                req.open("POST", '/LSWBoard/LSW_SEND');
                                formData.append('title',title.value);
                                formData.append('content',content);
                                formData.append('userid',userid);
                                formData.append('postNum',postNum);
                                formData.append('option',"modify");
                                req.send(formData);
                                req.onreadystatechange = function () {
                                    if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                                        LSWup.eventList.OnMoveFileDone_LSW = function (result, folder){
                                            insert(result,postNum,path+folder);
                                        }
                                        LSWup.APIList.LswMoveFileAPI(path,'Uploaded',randNum,postNum,result);
                                    }  
                                }
                            }
                            LSWup.APIList.LswFileUpAPI('LSWup',path);
                        }
                        
                        else{
                            LSWup.eventList.OnMoveFileDone_LSW = function (){
                                var formData = new FormData();
                                var req = new XMLHttpRequest();
                                req.open("POST", '/LSWBoard/LSW_SEND');
                                formData.append('title',title.value);
                                formData.append('content',content);
                                formData.append('userid',userid);
                                formData.append('postNum',postNum);
                                formData.append('option',"modify");
                                req.send(formData);
                                req.onreadystatechange = function () {
                                    if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                                    }location.href="http://112.136.138.139:6522/LSWBoard/LSWB_view.jsp?num="+postNum;
                                }
                            }
                            LSWup.APIList.LswMoveFileAPI(path,'Uploaded');
                        }
                    }
                    getPath();

                    LSWup.eventList.OnStartUpload_LSW = function(){
                        button.style.pointerEvents = 'none';
                        title.style.pointerEvents = 'none';
                        del.style.pointerEvents = 'none';
                        //LSWdown.APIList.LswGetDownButtonPlaceAPI('LSWdown').contentDocument.body.style.pointerEvents = 'none';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'none';
                        LSWEditor.APIList.getLSWButtonPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'none';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.contentEditable = false;
                    }
                    
                    LSWup.eventList.OnStopUpload_LSW = function(){
                        button.style.pointerEvents = 'auto';
                        title.style.pointerEvents = 'auto';
                        del.style.pointerEvents = 'auto';
                        //LSWdown.APIList.LswGetDownButtonPlaceAPI('LSWdown').contentDocument.body.style.pointerEvents = 'auto';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'auto';
                        LSWEditor.APIList.getLSWButtonPlaceById('lsw1').contentDocument.body.style.pointerEvents = 'auto';
                        LSWEditor.APIList.getLSWEditPlaceById('lsw1').contentDocument.body.contentEditable = true;
                    }
                }
            }
        }
        //////////////////////////// 다른 업로더, 에디터 추가 ////////////////////////////
        else if(response == 1){ // 임시 테스트용 업로더,에디터
            var temp1 = document.createElement('h1');
            temp1.innerText = '관리자 페이지 코드 랩핑 테스트';
            var temp2 = document.createElement('h1');
            temp2.innerText = '관리자 페이지에서 다른 에디터 / 업로더 옵션 적용시 보여집니다';
            var sample = document.getElementById('sample');
            sample.appendChild(temp1);
            sample.appendChild(temp2);
        }
        else if(response == 2){
            var download1 = new LseDownload({
                id: 'sample',
                width: '100%',
                height: '125px',
                /* buttonOption: '0' */
                onLoadEvent: function(){}
            });

            var upload1 = new LseUpload({
                id: 'sample',
                width: '100%',
                height: '125px',
                /* buttonOption: '0' */
                onLoadEvent: function(){},
                onUploadEvent: function(){},
                onEndUploadEvent: function(){}
            });
            
            var editor1 = new LseEditor({
                id: 'sample',
                width: '100%',
                height: '250px'
            });
        }
    }
    getOption();
}

function loginjsp(tf){
    if(!tf){location.href="http://112.136.138.139:6522/LSWBoard/LSWB_main.jsp";}
	
    var acb = document.getElementById('acb');var egg = 0;
    if(acb!=null)acb.onclick = function (){
		document.getElementById("account").style.display="block";egg++;if(egg==6){window.open('calc/Main_LSW.html')}
    }

    var acsubmit = document.getElementById('acsubmit');
    if(acsubmit!=null)acsubmit.onclick = function (){
		var id = document.getElementById("ac_login").value;
		var pw = document.getElementById("ac_pw").value;
		if(id==''||pw==''){
			alert('ID나 PASSWORD를 잘못 입력하셨습니다.');
		}
		else{
			var formData = new FormData();
			formData.append('id',id);
			formData.append('pw',pw);
			var req = new XMLHttpRequest();
			req.open('POST','/LSWBoard/LSW_ACCOUNT');
            req.send(formData);
			
			req.onreadystatechange = function () {
                if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                    if(req.responseText.length>10){
						alert('이미 존재하는 ID 입니다.');
					}
					else{
						login(id,pw);
					}
                }
            }
		}
	}
    
    var loginb = document.getElementById('loginb');
    if(loginb!=null)loginb.onclick = function(){
        login();
    }

	function login(id,pw){
		if(id==undefined){
			var id = document.getElementById("lpb_login").value;
		}
		if(pw==undefined){
			var pw = document.getElementById("lpb_pw").value;
		}
		
		if(id==''||pw==''){
			alert('ID나 PASSWORD를 잘못 입력하셨습니다.');
		}
		else{
			var formData = new FormData();
			formData.append('id',id);
			formData.append('pw',pw);
			formData.append('option','login');
			var req = new XMLHttpRequest();
			req.open('POST','/LSWBoard/LSW_LOGIN');
	        req.send(formData);
	        req.onreadystatechange = function () {
	            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
					if(req.responseText.length>10){
						alert("로그인에 실패하였습니다.");
					}
					else{
						window.location = document.referrer;
					}
	            }
	        }
		}
	}
}

function logout(){
    var formData = new FormData();
    formData.append('option','logout');
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_LOGIN');
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            location.reload();
        }
    }
}

function insert(result,postNum,path){
    for(var i=0;i<result.length;i++){
        var formData = new FormData();
        var req = new XMLHttpRequest();
        req.open("POST", '/LSWBoard/LSW_SEND');
        formData.append('postNum',postNum);
        formData.append('filename',result[i].name);
        formData.append('filesize',result[i].sizeN);
        formData.append('path',path);
        formData.append('option','insert');
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                setTimeout(function (){location.href="http://112.136.138.139:6522/LSWBoard/LSWB_view.jsp?num="+postNum;}, 800);
            }
        }
    }
}