function LSWEditorPrototype(obj){ // 프로토타입 객체
    this.option.id = obj.id;
    this.option.width = obj.width;
    this.option.height = obj.height;
    this.option.divName = obj.divName;

    //this.loadFunc.LoadLSWEditor();
}

LSWEditorPrototype.prototype.option = { // 객체의 옵션(정보) (유저가 설정 or 기본값)
    id : "LSWDEFAULT",
    width : 600,
    height : 300,
    divName : "sample"
}

LSWEditorPrototype.prototype.loadFunc = {
    LoadLSWEditor:function(){ // 에디터 생성 함수
        var id = LSWEditorPrototype.prototype.option.id;
        var width = LSWEditorPrototype.prototype.option.width;
        var height = LSWEditorPrototype.prototype.option.height;
        var divName = LSWEditorPrototype.prototype.option.divName;

        if(width < 500){width = 500;}
        if(height < 400 && IsIE()){height = 400;}
        else if(height < 100){height = 100;}
        
        // 전체영역 div
        var div1 = document.createElement('div');
        div1.id = id;
        div1.style.width = width+'px';
        div1.style.height = height+'px';
        div1.style.border = '2px solid gray';
        div1.style.overflow = 'hidden';

        var clientDiv = document.getElementById(divName);
        if(clientDiv == null){
            console.log("LSWEditor\n※div를 찾을수 없습니다.※\n입력하신 divId = "+divName+"\n※Error: divId="+divName+"가 존재하지않아 Id="+id+" 생성 오류※");
            return 0;
        }
        clientDiv.appendChild(div1); // 받아온 div아래에 에디터 추가

        // 버튼영역
        var buttonPlace = document.createElement('iframe');
        buttonPlace.id = 'buttonPlace'+id;
        buttonPlace.frameBorder = 0;
        buttonPlace.style.height = '60px';
        buttonPlace.style.width = width+'px';
        buttonPlace.style.background = '#31648c';
        buttonPlace.addEventListener('load',function(){ // 버튼영역의 iframe이 로드 되면 실행 (오류방지)
            var buttonPlace_div1 = document.createElement('div'); // 버튼영역 1번째 줄
            buttonPlace_div1.id = 'buttonPlace_div1'
            buttonPlace.contentDocument.body.appendChild(buttonPlace_div1);
            var buttonPlace_div2 = document.createElement('div'); // 버튼영역 2번째 줄
            buttonPlace_div2.id = 'buttonPlace_div2'
            buttonPlace.contentDocument.body.appendChild(buttonPlace_div2);

            buttonPlace.contentDocument.body.style.overflow = 'hidden'; // 버튼영역 늘어남 방지

            // 1번째 줄 버튼 추가
            var bold = CreateButton('B','Bold',buttonPlace_div1,null);
            bold.style.fontWeight = 'bold';
            var italic = CreateButton('I','Italic',buttonPlace_div1,null);
            italic.style.fontStyle = 'italic';
            var underline = CreateButton('U','Underline',buttonPlace_div1,null);
            underline.style.textDecoration = 'underline';
            var strikethrough = CreateButton('S','StrikeThrough',buttonPlace_div1,null);
            strikethrough.style.textDecoration = 'line-through';

            // 1번째 줄 셀렉트박스 추가
            var defaultFont = window.getComputedStyle(document.body,null).getPropertyValue("font-family");
            var fontSizeList = {'key':'size','10px':1, '13px':2, '16px':3, '18px':4, '24px':5, '32px':6, '48px':7};
            if(IsIE()){
                var fontExcept1 = '맑은 고딕'
                var fontExcept2 = '문체부 훈민정음체'
            }
            else{
                var fontExcept1 = '"맑은 고딕"'
                var fontExcept2 = '"문체부 훈민정음체"'
            }
            var fontFamList = {'key':'family','기본글꼴':defaultFont,'맑은 고딕':fontExcept1,'굴림':'굴림','궁서':'궁서','휴먼엑스포':'휴먼엑스포','HY엽서L':'HYPost','휴먼매직체':'휴먼매직체','훈민정음체':fontExcept2};
            CreateSelect(fontSizeList,buttonPlace_div1);
            CreateSelect(fontFamList,buttonPlace_div1);

            if(IsIE()){LoadCSS(buttonPlace);
                var fontColList = {'key':'color','검정':'#000000','빨강':'#FF0000','파랑':'#0000FF','초록':'#008000','노랑':'#FFFF00','주황':'#FFA500','회색':'#808080','흰색':'#FFFFFF'};
                var backColList = {'key':'backcolor','검정':'#000000','빨강':'#FF0000','파랑':'#0000FF','초록':'#008000','노랑':'#FFFF00','주황':'#FFA500','회색':'#808080','흰색':'#FFFFFF'};
                CreateSelect(fontColList,buttonPlace_div1);
                CreateSelect(backColList,buttonPlace_div1);

                buttonPlace.contentDocument.body.onmousedown = function(e){
                    CheckStyle();
                } 
            }
            else{        
                // 컬러픽커 추가 (OnlyChrome)
                MakeColorPicker('forecolor',buttonPlace_div1);
                MakeColorPicker('backcolor',buttonPlace_div1);
            }

            // 2번째줄 버튼 추가
            //CreateButton('Full','justifyFull',buttonPlace_div2);
            CreateButton('Left','justifyleft',buttonPlace_div2,null);
            CreateButton('Center','justifycenter',buttonPlace_div2,null);
            CreateButton('Right','justifyright',buttonPlace_div2,null);
            CreateButton('Image','insertImage',buttonPlace_div2,'src');

            // 미리보기 버튼 추가
            var prevBut = document.createElement('button');
            prevBut.id = 'prevBut';
            prevBut.innerText = 'Preview';
            prevBut.onclick = function(){PreViewPop(id,width)};
            prevBut.style.float = 'right';
            buttonPlace_div1.appendChild(prevBut);

            LSW_buttonPlace = buttonPlace;
        })

        div1.appendChild(buttonPlace); // 전체영역에 버튼영역 추가

        // 에디터영역
        var editPlace = document.createElement('iframe');
        editPlace.id = 'editPlace'+id;
        editPlace.src = 'about:blank';
        editPlace.className = 'editPlace'
        editPlace.frameBorder = 0;
        editPlace.style.width = width+'px';
        editPlace.style.height = height-60+'px';
        editPlace.addEventListener('load',function(){ // 에디터영역의 iframe이 로드 되면 실행 (오류방지)
            editPlace.contentDocument.body.contentEditable = 'true'; // 수정가능한 iframe으로 생성
            editPlace.contentDocument.body.style.wordBreak = 'break-all'; // 줄바꾸기 설정

            if(IsIE()){// IE용 사이즈 조절
            buttonPlace.style.height = height*0.14+'px';
            editPlace.style.height = height*0.86+'px';
            editPlace.contentDocument.body.style.marginRight = '0px';
            }
            else{
                LoadCSS(editPlace);
                LoadCSS(buttonPlace);
            }
            editPlace.contentDocument.body.onmouseup = function(e){ // 체크 하는 방법 이걸로 해야함
                CheckStyle();
                if(editPlace.contentDocument.body.firstChild == null){
                    AddP(editPlace);
                }
            }
            editPlace.contentDocument.body.onkeydown = function(e){
                CheckStyle();
                if(editPlace.contentDocument.body.firstChild == null){
                    AddP(editPlace);
                }
            }
            editPlace.contentDocument.body.onkeyup = function(e){
                if(editPlace.contentDocument.body.firstChild == null){
                    AddP(editPlace);
                }
            }

            LSWEditorPrototype.prototype.eventList.OnEditorLoaded_LSW(id,editPlace);
        })

        div1.appendChild(editPlace); // 전체영역에 에디터영역 추가

        function CreateButton(buttonName, buttonValue, div, val){ // 버튼 생성 함수
            var but1 = document.createElement('button');
            but1.id = buttonName;
            but1.value = buttonValue;
            but1.innerText = buttonName;
            but1.onmousedown = function(e){
                if(e.target.id=="editPlace"){
            
                }
                else{
                e.preventDefault();
                }
                if(val == 'src'){var tempVal = prompt("URL 혹은 로컬이미지 주소를 입력해주세요.", "");}
                ApplyExCo(buttonValue,false,tempVal);
                CheckStyle();
            }
            div.appendChild(but1);
        
            return but1;
        }
        
        function CreateSelect(list,div){ // 셀렉트박스 생성 함수
            var select = document.createElement('select');
            var ifKey = list['key'];
            select.id = 'select '+ifKey;
            div.appendChild(select);
        
            for(var i in list){
                var temp = document.createElement('option');
                if(i == 'key'){
                    if(ifKey=='size'){
                        temp.innerText = '글자크기';
                        temp.id = '글자크기';
                    }
                    else if(ifKey=='family'){
                        temp.innerText = '글꼴';
                        temp.id = '글꼴';
                    }
                    else if(ifKey=='color'){
                        temp.innerText = '글자색';
                        temp.id = 'color';
                        temp.selected = true;
                    }
                    else if(ifKey=='backcolor'){
                        temp.innerText = '글배경색';
                        temp.id = 'backcolor#FFFFFF';
                        temp.selected = true;
                    }
                    select.appendChild(temp);
                }
                else{
                    temp.setAttribute('value', list[i])
                    temp.innerText = i;
                    temp.id = list['key']+list[i];
                    
                    if(i=='16px'){
                        temp.selected = true;
                    }
                    if(i=='기본글꼴'){
                        temp.selected = true;
                    }
                    if(i=='글자색'){
                        temp.selected = true;
                    }
                    
                    if(ifKey=='family'){
                        temp.style.fontFamily = list[i];
                    }
                    else if(ifKey=='color'){
                        temp.style.backgroundColor = 'rgb(207, 207, 207)'
                        temp.style.color = list[i];
                    }
                    else if(ifKey=='backcolor'){
                        temp.style.backgroundColor = list[i];
                        temp.style.color = 'rgb(207, 207, 207)';
                    }
        
                    select.appendChild(temp);
        
                    select.onmousedown = function(){
                        var buttonPlace = document.getElementById('buttonPlace'+id);
                        if(this.id=='select size'){
                            buttonPlace.contentDocument.getElementById('글자크기').selected = true;
                        }
                        else if(this.id=='select family'){
                            buttonPlace.contentDocument.getElementById('글꼴').selected = true;
                        }
                        if(IsIE()){    
                            if(this.id=='select color'){
                                buttonPlace.contentDocument.getElementById('color#000000').selected = true;
                            }
                            else if(this.id=='select backcolor'){
                                buttonPlace.contentDocument.getElementById('backcolor#FFFFFF').selected = true;
                            }
                        }
                    }
        
                    select.onchange = function(m) {
                        var editPlace = document.getElementById('editPlace'+id);
                        if(ifKey=='size'){
                            ApplyExCo("FontSize",false,select.options[select.selectedIndex].value)
                        }
                        else if(ifKey=='family'){
                            ApplyExCo("FontName",false,select.options[select.selectedIndex].value)
                        }
                        else if(ifKey=='color'){
                            ApplyExCo("ForeColor",false,select.options[select.selectedIndex].value)
                        }
                        else if(ifKey=='backcolor'){
                            ApplyExCo("BackColor",false,select.options[select.selectedIndex].value)
                        }
                        editPlace.contentDocument.body.focus();
                    }
                }
            }
        }
        
        function ApplyExCo(param1, param2, param3){ // execcommand 적용 통합
            var editPlace = document.getElementById('editPlace'+id);
            if(IsIE()){
                ForIE(param1, param2, param3);
            }
            else{
                if(param1=="insertImage"){
                    var img = new Image();
                    img.src = param3;
                    img.onload = function(){
                        editPlace.contentDocument.execCommand(param1, param2, param3);
                    }
                    img.onerror = function(){
                        alert("잘못된 경로의 이미지 입니다.");
                    }
                }
                else{editPlace.contentDocument.execCommand(param1, param2, param3);}
            }
        }
        
        function PreViewPop(content, width){ // 미리보기 팝업 함수
            var editPlace = document.getElementById('editPlace'+id);
            if(IsIE()){
                window.open("LSWEditor_Preview.html",content,'width='+width+',height='+editPlace.offsetHeight+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes');    
            }
            else{
                window.open("LSWEditor_Preview.html",content,'width='+width*0.9+',height='+height*0.9+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no');
            }
        }
        
        function IsIE() { // 브라우저 IE 체크 함수
            var agent = navigator.userAgent.toLowerCase();
            return (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
        }
        
        function ForIE(param1, param2, param3){ // 브라우저 IE 면 selection, range도 적용
            var editPlace = document.getElementById('editPlace'+id);
            var s = editPlace.contentDocument.getSelection();
            var selRange = s.getRangeAt(0);
        
            var newNode = editPlace.contentDocument.createTextNode('.');
            selRange.insertNode(newNode);
            s.removeAllRanges();
            s.addRange(selRange);
        
            editPlace.contentDocument.execCommand(param1,param2,param3);
        
            selRange.setStart(newNode, 0);
            selRange.setEnd(newNode, 1);
            selRange.deleteContents();
            
            s.removeAllRanges();
            s.addRange(selRange);
        }
        
        function MakeColorPicker(name, div){ // 컬러픽커 생성 함수
            var colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.id = name;
            colorPicker.name = name;
            colorPicker.value = '#000000';
            colorPicker.style.height = '20px';
            colorPicker.style.padding = '0px';
            colorPicker.style.border = 'none';
            //colorPicker.style.backgroundColor = 'transparent';
        
            var cLabel = document.createElement('label');
            var labelT = '';
            if(name == 'forecolor'){labelT = '  글자색'}
            else{labelT = '  형광펜';colorPicker.value = '#FFFFFF';}
            cLabel.textContent = labelT + '☞' 
            cLabel.style.fontSize = '13px'
            cLabel.style.color = '#FFFFFF'
            colorPicker.appendChild(cLabel);
            
            colorPicker.onchange = function(e){
                var editPlace = document.getElementById('editPlace'+id);
                ApplyExCo(name,false,e.target.value);
                editPlace.contentDocument.body.focus();
            }
            
            div.appendChild(cLabel);
            div.appendChild(colorPicker);
        }
        
        function ColorName(rgb) { // 색상 hex값으로 반환함수
            if(IsIE()){
                var r = Math.floor(rgb / ( 256 * 256 ));
                var g = Math.floor(rgb / 256 ) % 256;
                var b = rgb % 256;
                var tempName =  "#" +
                ("0" + parseInt(b,10).toString(16)).slice(-2) +
                ("0" + parseInt(g,10).toString(16)).slice(-2) +
                ("0" + parseInt(r,10).toString(16)).slice(-2);
            }
        
            else{
                if(rgb == 'rgba(0, 0, 0, 0)'){rgb = 'rgb(255, 255, 255)';}
                
                rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                var tempName =  "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
            }
        
            return tempName.toUpperCase();
        }
        
        function LoadCSS(where){ // 해당영역의 iframe에 CSS 로드함수
            var cssLink = document.createElement("link");
            cssLink.href = "LSWEditor_ExecCommand.css";  
            cssLink.rel = "stylesheet";  
            cssLink.type = "text/css";  
            where.contentDocument.head.appendChild(cssLink);
        }
        
        function CheckStyle(){ // 현재 적용된 스타일 확인 함수
            var buttonPlace = document.getElementById('buttonPlace'+id);
            var editPlace = document.getElementById('editPlace'+id);
            var checkList = {'bold':'B','italic':'I','underline':'U','StrikeThrough':'S',
            /*'justifyFull':'Full','justifyLeft':'Left','justifyCenter':'Center','justifyRight':'Right'*/}
        
            for(var b in checkList){
                var tempB = buttonPlace.contentDocument.getElementById(checkList[b]);
                if(String(editPlace.contentDocument.queryCommandValue(b))=='true'){tempB.style.borderStyle = "inset";}
                else{if(IsIE()==false){tempB.style.borderStyle = "outset";}else{tempB.style.borderStyle = "";}}
            }
        
            var tempF = buttonPlace.contentDocument.getElementById('family'+editPlace.contentDocument.queryCommandValue('fontname'));
            if(tempF!=null){
                tempF.selected = true;
            }
            
            var tempS = buttonPlace.contentDocument.getElementById('size'+editPlace.contentDocument.queryCommandValue('fontsize'));
            if(tempS!=null){
                tempS.selected = true;
            }
            
            if(IsIE()){
                var tempFC = buttonPlace.contentDocument.getElementById('color'+ColorName(editPlace.contentDocument.queryCommandValue('forecolor')));
                if(tempFC!=null){
                    tempFC.selected = true;
                }
                var tempBC = buttonPlace.contentDocument.getElementById('backcolor'+ColorName(editPlace.contentDocument.queryCommandValue('backcolor')));
                if(tempBC!=null){
                    tempBC.selected = true;
                }
            }
            else{
                var colorPickerFC = buttonPlace.contentDocument.getElementById('forecolor');
                colorPickerFC.value = ColorName(editPlace.contentDocument.queryCommandValue('forecolor'));
                var colorPickerFC = buttonPlace.contentDocument.getElementById('backcolor');
                colorPickerFC.value = ColorName(editPlace.contentDocument.queryCommandValue('backcolor'));
            }
        }
        
        function AddP(editPlace){ // 에디터영역 맨 처음부분에 P태그 없을시 추가해주는 함수
            var editPlace = document.getElementById('editPlace'+id);
            // p 태그 추가 후 포커스 조절
            var s = editPlace.contentDocument.getSelection();
            var selRange = s.getRangeAt(0);
        
            var newNode = editPlace.contentDocument.createElement('p');
            if(IsIE()==false){
                newNode.innerHTML = '<br>';
            }
            else{
                newNode.innerHTML = '';
            }
            selRange.insertNode(newNode);
        
            selRange.setStart(newNode, 0);
            selRange.setEnd(newNode, 0);
        
            s.removeAllRanges();
            s.addRange(selRange);
        }
    }
}

LSWEditorPrototype.prototype.APIList = {
    getLSWEditPlaceById:function (id){ // 에디터영역 Iframe 반환
        return document.getElementById('editPlace'+id);
    },
    
    getLSWButtonPlaceById:function (id){ // 버튼영역 Iframe 반환
        return document.getElementById('buttonPlace'+id);
    },
    
    getLSWEditPlaceValueById:function (id){ // 작성한 내용(Content) 반환
        var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
        var HTMLValue = editPlace.contentDocument.body.innerHTML;
    
        return HTMLValue;
    },

    setContentOnEditor:function (id, htmlValue){ // 전달받은 내용(Content) 에디터에 삽입
        var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
        editPlace.contentDocument.body.innerHTML = htmlValue;
    },

    getIsIE:function (){ // IE 인지 bool 리턴
        return (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
    },
}

LSWEditorPrototype.prototype.eventList = {
    OnEditorLoaded_LSW : function (id, Iframe) { // 온로드 완료시
        console.log("Default onload Message id="+id);
        console.log(Iframe);
    },
}