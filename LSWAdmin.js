function LSW_loginAdmin(id,pw,container,container2){
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
                var editor = raw[1].split('/');
                var uploader = raw[2].split('/');
                var path = raw[3];
                var now1 = document.createElement('h1');
                now1.innerText = "현재 적용된 에디터: "+editor[1];
                var now2 = document.createElement('h1');
                now2.innerText = "현재 적용된 업로더: "+uploader[1];
                var now3 = document.createElement('h1');
                now3.innerText = "현재 적용된 업로드 경로: "+path;
                container2.appendChild(now1);
                container2.appendChild(now2);
                container2.appendChild(now3);
                load2(editor,uploader);
            }
        }
    }
    
    function load2(editor,uploader){
        var req = new XMLHttpRequest();
        req.open('POST','/LSWBoard/LSW_ADMIN');
        var formData = new FormData();
        formData.append('option',2);
        req.send(formData);
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
                // 여기서 셀렉트박스랑 만들어 줘야함
                //console.log(req.responseText);
                var editorList = {'key':'editor','selected':editor[1]};
                var uploaderList = {'key':'uploader','selected':uploader[1]};
                var first = req.responseText.split('\n');

                var div = document.createElement('div');
                div.className = "selectcontainer";
                document.body.appendChild(div);
                
                var editorLabel = document.createElement('h2');
                editorLabel.innerText = '에디터변경 ';
                var splitE = first[0].split(',');
                var editorB = [];
                for(var i=0;i<splitE.length-1;i++){
                    editorB.push(splitE[i].split('/')[1]);
                }
                editorList.name = editorB;
                div.appendChild(editorLabel);
                CreateSelect(editorList,div);

                var uploaderLabel = document.createElement('h2');
                uploaderLabel.innerText = '업로더변경 ';
                var splitU = first[1].split(',');
                var uploaderB = [];
                for(var i=0;i<splitU.length-1;i++){
                    uploaderB.push(splitU[i].split('/')[1]);
                }
                uploaderList.name = uploaderB;
                div.appendChild(uploaderLabel);
                CreateSelect(uploaderList,div);

                var apply = document.createElement('button');
                apply.innerText = '적용';
                apply.className = 'apply';
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
                CreateSelect(userList,div);

                var apply = document.createElement('button');
                apply.innerText = '삭제';
                apply.className = 'apply';
                div.appendChild(apply);
                
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

                CreateSelect(deletedList,div);

                var apply = document.createElement('button');
                apply.innerText = '복원';
                apply.className = 'apply';
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

                CreateSelect(postList,div);

                var apply = document.createElement('button');
                apply.innerText = '삭제';
                apply.className = 'apply';
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
                text.className = "path";
                text.value = req.responseText;
                div.appendChild(text);

                var apply = document.createElement('button');
                apply.innerText = '변경';
                apply.className = 'apply';
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
                if(temp.innerText==list.selected){temp.selected = true;}
                select.appendChild(temp);
            }
        }
    }
}