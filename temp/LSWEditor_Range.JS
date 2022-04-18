function LSWEditorPrototype(id, width, height, divName){
    this.option.id = id;
    this.option.width = width;
    this.option.height = height;
    this.option.divName = divName;

    //this.loadFunc.LoadLSWEditor();
}

LSWEditorPrototype.prototype.option = {
    id : "LSWDEFAULT",
    width : 600,
    height : 300,
    divName : "sample"
}

LSWEditorPrototype.prototype.loadFunc = {
    LoadLSWEditor:function (){// 에디터 생성 함수
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
    
        document.getElementById(divName).appendChild(div1); // 받아온 div아래에 에디터 추가
    
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
            //var strikethrough = CreateButton('S','StrikeThrough',buttonPlace_div1,null);
            //strikethrough.style.textDecoration = 'line-through';
    
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
    
            LSW_editPlace = editPlace;
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
                if(val == 'src'){
                    var tempVal = prompt("URL 혹은 로컬이미지 주소를 입력해주세요.", "test.png");
                    if(tempVal==null || tempVal==''){
    
                    }
                    else{
                        ApplyExCo(buttonValue,false,tempVal);
                    }
                }
        
                else if(IsIE()==false){RangeLikeEXEC(buttonName,null,null);}
                else{ApplyExCo(buttonValue,false,tempVal);}
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
                        var buttonPlace = LSWEditorPrototype.prototype.APIList.getLSWButtonPlaceById(id);
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
                        var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
                        var value = select.options[select.selectedIndex].value
                        if(ifKey=='size'){value = select.options[select.selectedIndex].innerText;}
                        
                        if(IsIE()){
                            if(ifKey=='color'){
                                ApplyExCo("ForeColor",false,select.options[select.selectedIndex].value)// 여기여기
                            }
                            else if(ifKey=='backcolor'){
                                ApplyExCo("BackColor",false,select.options[select.selectedIndex].value)// 여기여기
                            }
                            else if(ifKey=='family'){
                                ApplyExCo("FontName",false,select.options[select.selectedIndex].value)// 여기여기
                            }
                            else if(ifKey=='size'){
                                ApplyExCo("FontSize",false,select.options[select.selectedIndex].value)// 여기여기
                            }
                        }
                        else{RangeLikeEXEC(ifKey,value,null);} // family color backcolor
                        editPlace.contentDocument.body.focus();
                    }
                }
            }
        }
        
        function ApplyExCo(param1, param2, param3){ // execcommand 적용 통합
            var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
            if(IsIE()){
                ForIE(param1, param2, param3);
            }
            else{
                editPlace.contentDocument.execCommand(param1, param2, param3);
            }
        }
        
        function PreViewPop(id, width){ // 미리보기 팝업 함수
            var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
            if(IsIE()){
                window.open("LSWEditor_Preview.html",id,'width='+width+',height='+editPlace.offsetHeight+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes');    
            }
            else{
                window.open("LSWEditor_Preview.html",id,'width='+width*1.1+',height='+editPlace.offsetHeight+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no');
            }
        }
        
        function IsIE() { // 브라우저 IE 체크 함수
            var agent = navigator.userAgent.toLowerCase();
            return (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
        }
        
        function ForIE(param1, param2, param3){ //
            var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
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
                var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
                if(IsIE()==true){ApplyExCo(name,false,e.target.value);}
                else{RangeLikeEXEC(name,e.target.value,null);}
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
            cssLink.href = "LSWEditor_Range.css";  
            cssLink.rel = "stylesheet";  
            cssLink.type = "text/css";  
            where.contentDocument.head.appendChild(cssLink);
        }
        
        function CheckStyle(){ // 현재 적용된 스타일 확인 함수
            var buttonPlace = LSWEditorPrototype.prototype.APIList.getLSWButtonPlaceById(id);
            var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
            var checkList = {'bold':'B','italic':'I','underline':'U'/*,'StrikeThrough':'S',
            'justifyFull':'Full','justifyLeft':'Left','justifyCenter':'Center','justifyRight':'Right'*/}
        
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
            var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
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
        
        function CleanEmptySpan(){
            var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
            var spans = editPlace.contentDocument.getElementsByTagName('span')
            for (var el=0;el<spans.length;el++) {
                if (spans[el].innerHTML == '&nbsp;' || spans[el].innerHTML == '') {
                    spans[el].parentNode.removeChild(spans[el]);
                }
            }
            var ps = editPlace.contentDocument.getElementsByTagName('p')
            for (var el=0;el<ps.length;el++) {
                if (ps[el].innerHTML == '&nbsp;' || ps[el].innerHTML == '') {
                    ps[el].parentNode.removeChild(ps[el]);
                }
            }
        }
        
        function AssembleSpan(node, range){
            
            if(node.childNodes.length <= 1){
                if(node.style != undefined && node.nextElementSibling != null && node.nextElementSibling.style != undefined && node.nextSibling.tagName != undefined){
                    if(node.style.cssText == node.nextElementSibling.style.cssText){
                        var nodeLen = node.innerText.length;
                        node.innerText += node.nextElementSibling.innerText;
                        node.nextElementSibling.replaceWith('');
                        range.setStart(node,0);
                        range.setEnd(node.childNodes[0],nodeLen);
                    }
    
                }
                if(node.style != undefined && node.previousElementSibling != null && node.previousElementSibling.style !=undefined && node.previousSibling.tagName != undefined){
                    if(node.style.cssText == node.previousElementSibling.style.cssText){
                        var nodeLen = node.previousElementSibling.innerText.length;
                        var nodeLen2 = range.endOffset;
                        node.previousElementSibling.innerText += node.innerText;
                        range.setStart(node.previousElementSibling.childNodes[0],nodeLen);
                        range.setEnd(node.previousElementSibling.childNodes[0],nodeLen+nodeLen2);
                        node.replaceWith('');
                    }
                }
            }
        
            else{
                for(var n=0;n<node.childNodes.length;n++){
                    if(node.childNodes[n].style != undefined && node.childNodes[n].nextElementSibling != null){
                        if(node.childNodes[n].style.cssText == node.childNodes[n].nextElementSibling.style.cssText){
                            var nodeLen = node.childNodes[n].innerText.length;
                            node.childNodes[n].innerText += node.childNodes[n].nextElementSibling.innerText;
                            node.removeChild(node.childNodes[n].nextElementSibling);
                        }
                    }
                    if(node.childNodes[n].style != undefined && node.childNodes[n].previousElementSibling != null){
                        if(node.childNodes[n].style.cssText == node.childNodes[n].previousElementSibling.style.cssText){
                            var nodeLen = node.childNodes[n].previousElementSibling.innerText.length;
                            node.childNodes[n].previousElementSibling.innerText += node.childNodes[n].innerText;
                            node.removeChild(node.childNodes[n]);
                        }
                    }
                }
                range.insertNode(node);
            }
            CleanEmptySpan();
        }
        
        function RangeLikeEXEC(key, value, recall, range2){
            var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
    
            if(key=='Left' || key=='Right' || key=='Center'){
                var selection = editPlace.contentDocument.getSelection()
                var range = selection.getRangeAt(0);
                var pn = range.startContainer;
                var en = range.endContainer;
                if(range.startContainer.tagName == undefined||range.startContainer.tagName=='SPAN'){
                    while(pn.tagName != 'P'){
                        pn = pn.parentNode;
                    }
                    while(en.tagName != 'P'){
                        en = en.parentNode;
                    }
                    range.setStart(pn,0);
                    range.setEnd(en,1);
                }
                var node1 = range.extractContents();
                if(range.startContainer != range.endContainer){
                    for(var align = 0;align<node1.childNodes.length;align++){
                        if(node1.childNodes[align].textContent == ''&&pn.tagName=='P'){
                            pn.style.textAlign = key;
                        }
                        else{
                            node1.childNodes[align].style.textAlign = key;  
                        }
                    }
                    //pn.parentNode.removeChild(pn.nextSibling);
                }
                else{
                    if(pn.tagName == 'HTML'){
                        //pn = pn.childNodes[1];
                        for(var align = 0;align<node1.childNodes.length;align++){
                            node1.childNodes[align].style.textAlign = key;
                        }
                    }
                    else{
                        //pn = pn.childNodes[1]; // body
                        for(var align = 0;align<node1.childNodes.length;align++){
                            if(node1.childNodes[align].style == undefined){
                                pn.style.textAlign = key;
                                en.style.textAlign = key;
                            }
                            else{
                                node1.childNodes[align].style.textAlign = key;
                            }
                        }
                        if(node1.childNodes.length == 0){
                            range.startContainer.style.textAlign = key;
                        }
                    }              
                }
                range.insertNode(node1);
                CleanEmptySpan();
                return null;
            }
            if(recall==null||recall.tagName!='P'){
                var selection = editPlace.contentDocument.getSelection();
                var range = selection.getRangeAt(0);
                var pn = range.startContainer.parentNode;
                var node1 = range.extractContents();
            }
            else{
                var range = range2;
                var pn = range.startContainer.parentNode;
                var node1 = recall;
            }
        
            if(pn.nodeName == 'SPAN'&&node1.childNodes.length==1){
                var firstNode = editPlace.contentDocument.createElement('span');
                var tempNode = editPlace.contentDocument.createElement('span');
                var lastNode = editPlace.contentDocument.createElement('span');
        
                lastNode.style.cssText = pn.style.cssText;
                lastNode.innerText = range.startContainer.textContent.slice(range.startOffset);
                pn.after(lastNode);
        
                if(pn.style != undefined){
                    tempNode.style.cssText = pn.style.cssText;
                }
                if(key=='B'){
                    if(pn.style.fontWeight == 'bold'){tempNode.style.fontWeight = 'normal';}
                    else{tempNode.style.fontWeight = 'bold';}
                }
                else if(key=='I'){
                    if(pn.style.fontStyle == 'italic'){tempNode.style.fontStyle = 'normal';}
                    else{tempNode.style.fontStyle = 'italic';}
                }
                else if(key=='U'){
                    if(pn.style.textDecoration == 'underline'){tempNode.style.textDecoration = '';}
                    else{tempNode.style.textDecoration = 'underline';}
                }
                else if(key=='size'&&pn.style.fontSize != value){tempNode.style.fontSize = value;}
                else if(key=='family'&&pn.style.fontFamily != value){tempNode.style.fontFamily = value;}
                else if(key=='forecolor'&&pn.style.color != value){tempNode.style.color = value;}
                else if(key=='backcolor'&&pn.style.backgroundColor != value){tempNode.style.backgroundColor = value;}
                
                if(node1.childNodes.length==0){
                    // 여기가 빈 span태그 추가하는 자리인데...
                }
    
                else{
                    tempNode.innerText = node1.textContent;
                    pn.after(tempNode);
                }
        
                firstNode.style.cssText = pn.style.cssText;
                firstNode.innerText = range.startContainer.textContent.slice(0,range.startOffset);
                pn.after(firstNode);
                
                pn.replaceWith('');
                
                range.setStart(tempNode,0);
                range.setEnd(tempNode,1);
    
                CleanEmptySpan();
                if(recall){
                    if(recall.tagName!='P'){
                        AssembleSpan(tempNode,range);
                    }
                }
            }
        
            else if(node1.childNodes.length==0){ // 여기가 그냥클릭 스판 안에있을때 아닐때 구분해야함...
                if(key=='Left' || key=='Right' || key=='Center'){
                    while(pn.tagName != 'P'){
                        pn = pn.parentNode;
                    }
                    pn.style.textAlign = key;
        
                    return null;
                }
            }
    
            else{ // 'BODY' or 'P'
                var tempNode = editPlace.contentDocument.createElement('span');
                if(node1.childNodes.length==1){
                    if(pn.tagName == 'SPAN'){
                        if(key=='B'){
                            if(pn.style.fontWeight == 'bold'){tempNode.style.fontWeight = 'normal';}
                            else{tempNode.style.fontWeight = 'bold';}
                        }
                        else if(key=='I'){
                            if(pn.style.fontStyle == 'italic'){tempNode.style.fontStyle = 'normal';}
                            else{tempNode.style.fontStyle = 'italic';}
                        }
                        else if(key=='U'){
                            if(pn.style.textDecoration == 'underline'){tempNode.style.textDecoration = '';}
                            else{tempNode.style.textDecoration = 'underline';}
                        }
                        else if(key=='size'&&pn.style.fontSize != value){tempNode.style.fontSize = value;}
                        else if(key=='family'&&pn.style.fontFamily != value){tempNode.style.fontFamily = value;}
                        else if(key=='forecolor'&&pn.style.color != value){tempNode.style.color = value;}
                        else if(key=='backcolor'&&pn.style.backgroundColor != value){tempNode.style.backgroundColor = value;}
        
                    }
                    else{
                        if(node1.childNodes[0].style == undefined){
                            if(range.startContainer.style != undefined){
                                tempNode.style.cssText = range.startContainer.style.cssText;
                            }
                        }
        
                        else{
                            tempNode.style.cssText = node1.childNodes[0].style.cssText;
                        }
                        if(key=='B'&&tempNode.style.fontWeight == 'bold'){tempNode.style.fontWeight = 'normal';}
                        else if(key=='B'&&tempNode.style.fontWeight != 'bold'){tempNode.style.fontWeight = 'bold';}
                        else if(key=='I'&&tempNode.style.fontStyle == 'italic'){tempNode.style.fontStyle = 'normal';}
                        else if(key=='I'&&tempNode.style.fontStyle != 'italic'){tempNode.style.fontStyle = 'italic';}
                        else if(key=='U'&&tempNode.style.textDecoration == 'underline'){tempNode.style.textDecoration = '';}
                        else if(key=='U'&&tempNode.style.textDecoration != 'underline'){tempNode.style.textDecoration = 'underline';}
                        else if(key=='size'&&tempNode.style.fontSize != value){tempNode.style.fontSize = value;}
                        else if(key=='family'&&tempNode.style.fontFamily != value){tempNode.style.fontFamily = value;}
                        else if(key=='forecolor'&&tempNode.style.color != value){tempNode.style.color = value;}
                        else if(key=='backcolor'&&tempNode.style.backgroundColor != value){tempNode.style.backgroundColor = value;}
                    }
                    tempNode.innerText = node1.textContent;
                    if(range.startContainer.tagName == 'SPAN'){ //다시 클릭 했을때 + 두번클릭
                        range.startContainer.before(tempNode);
                        range.setStart(tempNode,0);
                        range.setEnd(tempNode,1);
                    }
                    //else if(range.startContainer.tagName == 'P'){
                    //    range.startContainer.innerHTML = tempNode.outerHTML;
                    //}
                    else{
                        range.insertNode(tempNode);
                    }
                    CleanEmptySpan();
                    if(recall){
                        if(recall.tagName!='P'){
                            AssembleSpan(tempNode,range);
                        }
                    }
                }
        
                else{ // 여기좀보세요
                    var chiNo = node1.childNodes;
                    var flag = 0;
                    if(chiNo[0].tagName == 'P'){
                        //CleanEmptySpan();
                        if(pn.tagName!='P'){
                            pn = pn.parentNode;
                        }
                        for(var l=0;l<chiNo.length;l++){
                            range.setStart(chiNo[l],0);
                            range.setEnd(chiNo[l],1);
                            RangeLikeEXEC(key,value,chiNo[l],range);
                            for(var s=0;s<chiNo[l].childNodes.length;s++){
                                if(chiNo[l].childNodes[s].tagName == undefined){
                                    chiNo[l].removeChild(chiNo[l].childNodes[s]);
                                }
                            }
                        }
                        
                        if(pn.tagName != undefined){
                            pn.replaceWith('');
                        }
                        
                        range = selection.getRangeAt(0); // 포커스 잃음
                        range.insertNode(node1);
    
                        return null;
                    }
    
                    else{
                        for(var sp=0;sp<chiNo.length;sp++){
                            var tempNode = editPlace.contentDocument.createElement('span');
                            if(chiNo[sp].textContent == ''){
                                continue;
                            }
                            if(chiNo[sp].style == undefined){
                                if(key=='B' && range.startContainer.style.fontWeight != 'bold'){
                                    tempNode.style.fontWeight = 'bold';
                                    tempNode.innerText = chiNo[sp].textContent;
                                    node1.replaceChild(tempNode,chiNo[sp]);
                                    flag = 1;
                                }
                                else if(key=='I' && range.startContainer.style.fontStyle != 'italic'){
                                    tempNode.style.fontStyle = 'italic';
                                    tempNode.innerText = chiNo[sp].textContent;
                                    node1.replaceChild(tempNode,chiNo[sp]);
                                    flag = 1;
                                }
                                else if(key=='U' && range.startContainer.style.textDecoration != 'underline'){
                                    tempNode.style.textDecoration = 'underline';
                                    tempNode.innerText = chiNo[sp].textContent;
                                    node1.replaceChild(tempNode,chiNo[sp]);
                                    flag = 1;
                                }
                                else if(key=='size' && range.startContainer.style.fontSize != value){
                                    tempNode.style.fontSize = value;
                                    tempNode.innerText = chiNo[sp].textContent;
                                    node1.replaceChild(tempNode,chiNo[sp]);
                                    flag = 1;
                                }
                                else if(key=='family' && range.startContainer.style.fontFamily != value){
                                    tempNode.style.fontFamily = value;
                                    tempNode.innerText = chiNo[sp].textContent;
                                    node1.replaceChild(tempNode,chiNo[sp]);
                                    flag = 1;
                                }
                                else if(key=='forecolor' && range.startContainer.style.color != value){
                                    tempNode.style.color = value;
                                    tempNode.innerText = chiNo[sp].textContent;
                                    node1.replaceChild(tempNode,chiNo[sp]);
                                    flag = 1;
                                }
                                else if(key=='backcolor' && range.startContainer.style.backgroundColor != value){
                                    tempNode.style.backgroundColor = value;
                                    tempNode.innerText = chiNo[sp].textContent;
                                    node1.replaceChild(tempNode,chiNo[sp]);
                                    flag = 1;
                                }
                            }
                            else if(key=='B' && chiNo[sp].style.fontWeight != 'bold'){chiNo[sp].style.fontWeight = 'bold';flag = 1;}
                            //else if(key=='B' && chiNo[sp].style.fontWeight == 'bold'){chiNo[sp].style.fontWeight = 'normal';}
                            else if(key=='I' && chiNo[sp].style.fontStyle != 'italic'){chiNo[sp].style.fontStyle = 'italic';flag = 1;}
                            //else if(key=='I' && chiNo[sp].style.fontStyle == 'italic'){chiNo[sp].style.fontStyle = 'normal';}
                            else if(key=='U' && chiNo[sp].style.textDecoration != 'underline'){chiNo[sp].style.textDecoration = 'underline';flag = 1;}
                            //else if(key=='U' && chiNo[sp].style.textDecoration == 'underline'){chiNo[sp].style.textDecoration = '';}
                            else if(key=='size' && chiNo[sp].style.fontSize != value){chiNo[sp].style.fontSize = value;flag = 1;}
                            else if(key=='family' && chiNo[sp].style.fontFamily != value){chiNo[sp].style.fontFamily = value;flag = 1;}
                            else if(key=='forecolor'&& chiNo[sp].style.color != value){chiNo[sp].style.color = value;flag = 1;}
                            else if(key=='backcolor'&& chiNo[sp].style.backgroundColor != value){chiNo[sp].style.backgroundColor = value;flag = 1;}
                        }
                        if(flag == 0){
                            for(var sp=0;sp<chiNo.length;sp++){
                                var tempNode = editPlace.contentDocument.createElement('span');
                                if(chiNo[sp].style != undefined){
                                    if(chiNo[sp].textContent == ''){
                                        continue;
                                    }
                                    if(key=='B'){chiNo[sp].style.fontWeight = 'normal';}
                                    else if(key=='I'){chiNo[sp].style.fontStyle = 'normal';}
                                    else if(key=='U'){chiNo[sp].style.textDecoration = '';}
                                    else if(key=='size'){chiNo[sp].style.fontSize = value;}
                                    else if(key=='family'){chiNo[sp].style.fontFamily = value;}
                                    else if(key=='forecolor'){chiNo[sp].style.color = value;}
                                    else if(key=='backcolor'){chiNo[sp].style.backgroundColor = value;}
                                }
                                else{
                                    if(key=='B'){tempNode.style.fontWeight = 'normal';}//
                                    else if(key=='I'){tempNode.style.fontStyle = 'normal';}//
                                    else if(key=='U'){tempNode.style.textDecoration = '';}//
                                    else if(key=='size'){tempNode.style.fontSize = value;}//
                                    else if(key=='family'){tempNode.style.fontFamily = value;}//
                                    else if(key=='forecolor'){chiNo[sp].style.color = value;}
                                    else if(key=='backcolor'){chiNo[sp].style.backgroundColor = value;}
                                    if(chiNo[sp].textContent==''){sp++};
                                    tempNode.innerText = chiNo[sp].textContent;
                                    range.insertNode(tempNode);
                                }
                            }    
                        }
                        if(flag==1){
                            range.insertNode(node1);
                        }
                        CleanEmptySpan();
                        if(recall){
                            if(recall.tagName!='P'){
                                AssembleSpan(tempNode,range);
                            }
                        }
                    }
                }
            }
        }
    }
}

LSWEditorPrototype.prototype.APIList = {
    getLSWEditPlaceById:function (id){
        return document.getElementById('editPlace'+id);
    },
    
    getLSWButtonPlaceById:function (id){
        return document.getElementById('buttonPlace'+id);
    },
    
    getLSWEditPlaceValueById:function (id){
        var editPlace = LSWEditorPrototype.prototype.APIList.getLSWEditPlaceById(id);
        var HTMLValue = editPlace.contentDocument.body.innerHTML;
    
        return HTMLValue;
    }
}