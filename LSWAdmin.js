function login(){
    var id = document.getElementById("admin_id");
    var pw = document.getElementById("admin_pw");
    var	container = document.getElementById("container");
    var	container2 = document.getElementById("container2");
    
    LSW_loginAdmin(id,pw,container,container2);
}

function LSW_loginAdmin(id,pw,container,container2){
    window.onbeforeunload = function(){
        var formData = new FormData();
        formData.append('option','off');
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_LOGIN');
        req.send(formData);
    }
    if(id.value==''||pw.value==''){alert('EMPTY ID || EMPTY PASSWORD');}
    else{
        var formData = new FormData();
        formData.append('id',id.value);
        formData.append('pw',pw.value);
        formData.append('option','admin');
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_LOGIN');
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                if(req.responseText==""){
                    alert("ID || PW is not match");
                }
                else if(req.responseText!=''){
                    container.style.display = 'none';
                    load1(container2);
                }
            }
        }
    }
    function load1(container2){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option',1);
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var raw = req.responseText.split(',');
                var option = raw[0].split('/');
                var path = raw[1];
                var now1 = document.createElement('h1');
                now1.innerText = "현재 적용된 에디터: "+option[0];
                var now2 = document.createElement('h1');
                now2.innerText = "현재 적용된 업로더: "+option[1];
                var now3 = document.createElement('h1');
                now3.innerText = "현재 적용된 업로드 경로: "+path;
                container2.appendChild(now1);
                container2.appendChild(now2);
                container2.appendChild(now3);
                load2(raw[0]);
            }
        }
    }
    
    function load2(option){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option',2);
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var List = {'key':'editor','selected':option};

                var div = document.createElement('div');
                div.className = "selectcontainer";
                document.body.appendChild(div);
                
                var Label = document.createElement('h2');
                Label.innerText = '옵션변경 ';
                
                var optionB = [];
                for(var i=0;i<req.responseText.split(',').length-1;i++){
                    optionB.push(i+":"+req.responseText.split(',')[i]);
                }
                List.name = optionB;
                div.appendChild(Label);
                var select1 = CreateSelect(List,div);

                var apply = document.createElement('button');
                apply.innerText = '적용';
                apply.className = 'apply';
                div.appendChild(apply);
                apply.onclick = function(){
                    ChangeOption(select1);
                }

                load35();
            }
        }
    }

    function load35(){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option','3.5');
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var userList = {'key':'deleteduser','name':req.responseText.split('/')};
                var div = document.createElement('div');
                div.className = "selectcontainer";
                document.body.appendChild(div);
                var userLabel = document.createElement('h2');
                userLabel.innerText = '삭제된 사용자목록 ';
                div.appendChild(userLabel);
                var select = CreateSelect(userList,div);

                var apply = document.createElement('button');
                apply.innerText = '복원';
                apply.className = 'apply';
                apply.onclick = function(){
                    RecoverUser(select);
                }
                div.appendChild(apply);
                
                load3();
            }
        }
    }

    function load3(){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option',3);
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var userList = {'key':'user','name':req.responseText.split('/')};
                var div = document.createElement('div');
                div.className = "selectcontainer";
                document.body.appendChild(div);
                var userLabel = document.createElement('h2');
                userLabel.innerText = '사용자목록 ';
                div.appendChild(userLabel);
                var select = CreateSelect(userList,div);

                var apply = document.createElement('button');
                apply.innerText = '삭제';
                apply.className = 'apply';
                div.appendChild(apply);
                apply.onclick = function(){
                    DelUser(select);
                }
                load4();
            }
        }
    }

    function load4(){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option',4);
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var first = req.responseText.split(',');
                var deletedList = {'key':'deleted'};
                var div = document.createElement('div');
                div.className = "selectcontainer";
                document.body.appendChild(div);
                var userLabel = document.createElement('h2');
                userLabel.innerText = '삭제된 글목록 ';
                div.appendChild(userLabel);

                var deleted = [];
                for(var i=0;i<first.length-1;i++){
                    var temp = first[i].split('/');
                    deleted.push(temp[0]+":"+temp[2]+" - "+temp[1]);
                }

                deletedList.name = deleted;

                var select = CreateSelect(deletedList,div);

                var apply = document.createElement('button');
                apply.innerText = '복원';
                apply.className = 'apply';
                apply.onclick = function(){
                    RecoverPost(select);
                }
                div.appendChild(apply);
                
                load5();
            }
        }
    }

    function load5(){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option',5);
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var first = req.responseText.split(',');
                var postList = {'key':'post'};
                var div = document.createElement('div');
                div.className = "selectcontainer";
                document.body.appendChild(div);
                var userLabel = document.createElement('h2');
                userLabel.innerText = '게시글목록 ';
                div.appendChild(userLabel);

                var post = [];
                for(var i=0;i<first.length-1;i++){
                    var temp = first[i].split('/');
                    post.push(temp[0]+":"+temp[2]+" - "+temp[1]);
                }

                postList.name = post;

                var select = CreateSelect(postList,div);

                var apply = document.createElement('button');
                apply.innerText = '삭제';
                apply.className = 'apply';
                apply.onclick = function(){
                    DelPost(select);
                }
                div.appendChild(apply);
                
                load6();
            }
        }
    }

    function load6(){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option',6);
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                var div = document.createElement('div');
                div.className = "selectcontainer";
                document.body.appendChild(div);
                var userLabel = document.createElement('h2');
                userLabel.innerText = '업로드 경로 ';
                div.appendChild(userLabel);

                var text = document.createElement('input');
                text.type = "text";
                text.id = "path";
                text.className = "path";
                text.value = req.responseText;
                div.appendChild(text);

                var apply = document.createElement('button');
                apply.innerText = '변경';
                apply.className = 'apply';
                apply.onclick = function(){
                    ChangeDir(text.value);
                }
                div.appendChild(apply);
            }
        }
    }

    function CreateSelect(list,div){
        var select = document.createElement('select');
        var key = list.key;
        select.id = 'select '+key;
        div.appendChild(select);
        
        for(var i=0;i<list.name.length;i++){
            if(list.name[i]!=''){
                var temp = document.createElement('option');
                temp.value = i;
                temp.innerText = list.name[i];
                temp.id = key+list[i];
                if(temp.innerText.indexOf(list.selected)!=-1){temp.selected = true;}
                select.appendChild(temp);
            }
        }

        return select;
    }
}

function ChangeOption(select){
    var selected = '';
    for(var i=0;i<select.childNodes.length;i++){
        if(select.childNodes[i].selected){
            selected = select.childNodes[i].innerText.split(':');
            break;
        }
    }
    var formData = new FormData();
    formData.append('option','CO');
    formData.append('selected',selected[0]);
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            alert(req.responseText);
            if(req.responseText=="완료"){
                var temp = document.getElementById('container2');
                temp.childNodes[1].innerText = "현재 적용된 에디터: "+selected[1].split('/')[0];
                temp.childNodes[2].innerText = "현재 적용된 업로더: "+selected[1].split('/')[1];
            }
        }
    }
}

function RecoverUser(select){
    var id = '';
    var rc;
    for(var i=0;i<select.childNodes.length;i++){
        if(select.childNodes[i].selected){
            rc = select.childNodes[i];
            id = select.childNodes[i].innerText;
            break;
        }
    }
    var formData = new FormData();
    formData.append('option','RU');
    formData.append('id',id);
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            alert(req.responseText);
            if(req.responseText=="완료"){
                var temp = document.getElementById('select user');
                select.removeChild(rc);
                temp.appendChild(rc);
            }
        }
    }
}

function DelUser(select){
    var id = '';
    var rc;
    for(var i=0;i<select.childNodes.length;i++){
        if(select.childNodes[i].selected){
            rc = select.childNodes[i];
            id = select.childNodes[i].innerText;
            break;
        }
    }
    var formData = new FormData();
    formData.append('option','DU');
    formData.append('id',id);
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            alert(req.responseText);
            if(req.responseText=="완료"){
                var temp = document.getElementById('select deleteduser');
                select.removeChild(rc);
                temp.appendChild(rc);
            }
        }
    }
}

function RecoverPost(select){
    var postNum = 0;
    var rc;
    for(var i=0;i<select.childNodes.length;i++){
        if(select.childNodes[i].selected){
            rc = select.childNodes[i];
            postNum = select.childNodes[i].innerText.split(':')[0];
            break;
        }
    }
    var formData = new FormData();
    formData.append('option','RP');
    formData.append('postNum',postNum);
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            alert(req.responseText);
            if(req.responseText=="완료"){
                var temp = document.getElementById('select post');
                select.removeChild(rc);
                temp.appendChild(rc);
            }
        }
    }
}

function DelPost(select){
    var postNum = 0;
    var rc;
    for(var i=0;i<select.childNodes.length;i++){
        if(select.childNodes[i].selected){
            rc = select.childNodes[i];
            postNum = select.childNodes[i].innerText.split(':')[0];
            break;
        }
    }
    var formData = new FormData();
    formData.append('option','DP');
    formData.append('postNum',postNum);
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            alert(req.responseText);
            if(req.responseText=="완료"){
                var temp = document.getElementById('select deleted');
                select.removeChild(rc);
                temp.appendChild(rc);
            }
        }
    }
}

function ChangeDir(dir){
    var formData = new FormData();
    formData.append('option','CD');
    formData.append('path',dir);
    var req = new XMLHttpRequest();
    req.open('POST','/LSWBoard/LSW_ADMIN');
    req.send(formData);
    req.onreadystatechange = function () {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            alert(req.responseText);
            document.getElementById('container2').childNodes[3].innerText = '현재 적용된 업로드 경로: '+dir;
        }
    }
}