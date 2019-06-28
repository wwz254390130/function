/**
 * @desc
 * @author cifer
 * @date 2017/4/28.
 */
function autofilter() {
    var that = this;
    //初始化数据
    function initData(param) {
        that.paramRight = true;
        if (!that.lastTime) {
            that.lastTime = new Date().getTime();
        }
        if (!param.inputDom) {
            console.log('inputDom can not empty');
            that.paramRight = false;
        } else {
            that.inputDom = param.inputDom;
        }
        if (!param.listDom) {
            console.log('listDom can not empty');
            that.paramRight = false;
        } else {
            that.listDom = param.listDom;
            that.coverDom = that.listDom.parentNode;
            if (!that.coverDom) {
                console.log('coverDom can not empty');
                that.paramRight = false;
            }
        }
        if (param.multiListDom) { that.multiListDom = param.multiListDom; }
        that.dataType = param.dataType;
        if (!that.dataType || !inArray(that.dataType, ['local', 'ajax'])) {
            console.log('dataType is wrong');
            that.paramRight = false;
        }
        //每次搜索，间隔时间
        if (!isInt(param.interval)) { that.interval = 500; }
        // ajax before
        if (param.ajaxBefore) { that.ajaxBefore = param.ajaxBefore }
        //回调
        if (param.itemClickCallback) { that.itemClickCallback = param.itemClickCallback }
        //删除回调
        if (param.itemDeleteCallback) { that.itemDeleteCallback = param.itemDeleteCallback }
        //数据模板
        if (!document.getElementById(param.htmlTemplateId)) {
            console.log('htmlTemplateId is empty');
            that.paramRight = false;
        } else { that.htmlTemplateId = param.htmlTemplateId; }
        if (that.dataType == 'local') {
            //dataType为local时，搜索所有的key
            if (!param.searchKeyArr) { that.searchKeyArr = ['name']; }
            if (!isArray(param.data) || param.data.length === 0) {
                console.log('data not a array or data is empty arry');
                that.paramRight = false;
            } else { that.data = param.data; }
        } else if (that.dataType == 'ajax') {
            //搜索key
            if (!param.url) {
                console.log('url can not empty');
                that.paramRight = false;
            } else { that.url = param.url }
            //搜索key
            if (!param.keyParam) {
                console.log('keyParam can not empty');
                that.paramRight = false;
            } else { that.keyParam = param.keyParam }
            //额外参数
            if (param.ajaxExistParam) { that.ajaxExistParam = param.ajaxExistParam }
            //返回code
            if (!param.responseCode) {
                console.log('responseCode can not empty');
                that.paramRight = false;
            } else { that.responseCode = param.responseCode }
            //返回成功
            if (!param.responseCodeSuccess) {
                console.log('responseCodeSuccess can not empty');
                that.paramRight = false;
            } else { that.responseCodeSuccess = param.responseCodeSuccess }
            //返回信息
            if (!param.responseMsg) {
                console.log('responseMsg can not empty');
                that.paramRight = false;
            } else { that.responseMsg = param.responseMsg }
            //返回数据的形式
            if (!param.responseData) {
                console.log('responseData can not empty');
                that.paramRight = false;
            } else { that.responseData = param.responseData }
        }
        //最终数据
        that.backList = [];
        //是否清除用户自主输入的结果
        if (!param.clearUserInput) {
            that.clearUserInput = false;
        } else {
            that.clearUserInput = param.clearUserInput;
            if (!param.clearUserMatchParam) {
                console.log('clearUserMatchParam can not empty');
                that.paramRight = false;
            } else {
                that.clearUserMatchParam = param.clearUserMatchParam;
            }
        }
        //筛选方向，默认是在input下方bottom
        that.position = param.position;
        // 渲染前的回调
        that.renderTplBefore = param.renderTplBefore;
        return that;
    }

    //ajax开始搜索
    function ajaxSearch() {
        that.lastTime = new Date().getTime();
        var keyValue = that.inputDom.value;
        var requestParam = 't=' + new Date().getTime();

        if (keyValue) {
            requestParam = requestParam + '&' + that.keyParam + '=' + keyValue.replace(/\+/g, "%2B");
        }

        if (that.ajaxExistParam) {
            var _tmpAjaxObj = {};

            if (typeof(that.ajaxExistParam) == 'function') {
                _tmpAjaxObj = that.ajaxExistParam();
            } else if (typeof(that.ajaxExistParam) == 'object') {
                _tmpAjaxObj = that.ajaxExistParam;
            }

            for (var existPar in _tmpAjaxObj) {
                requestParam = requestParam + '&' + existPar + '=' + _tmpAjaxObj[existPar];
            }
        }

        var _doParam = {
            url: that.url,
            data: requestParam
        }

        if (that.ajaxBefore && typeof(that.ajaxBefore) == 'function') {
            _doParam = that.ajaxBefore(that.url, requestParam);
        }

        if (!_doParam) {
            return false;
        }

        doPost(_doParam.url, _doParam.data);
    }
    //匹配内容
    function matchAttribute(reg, item, searchKeyArr) {
        var flag = false;
        for (var i = 0; i < searchKeyArr.length; i++) {
            if (searchKeyArr[i]) {
                if (reg.test(item[searchKeyArr[i]])) {
                    flag = true;
                }
            }
        }
        return flag;
    }

    function doPost(url, request) {
        var xmlHttp;
        if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        xmlHttp.open("POST", url);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.send(request);
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    if (xmlHttp.responseText) {
                        showData(JSON.parse(xmlHttp.responseText));
                    }
                } else {
                    console.log(xmlHttp);
                }
            }
        };
    }
    //得到处理数据，并展示
    function showData(response) {
        var htmlContent = '';
        //最终数据
        var backList;
        if (response && response[that.responseCode] == that.responseCodeSuccess) {
            //responseData参数是否正确
            var responseDataFlag = true;
            //如果参数有.则说明是多层的
            if (/\./.test(that.responseData)) {
                backList = response;
                var responseDataArr = that.responseData.split('.');
                for (var i = 0; i < responseDataArr.length; i++) {
                    if (backList) {
                        backList = backList[responseDataArr[i]];
                    } else {
                        responseDataFlag = false;
                        console.log('responseData is wrong');
                        break;
                    }
                }
            } else {
                backList = response[that.responseData];
            }
            that.backList = backList;
            /*if(that.backList.length == 0){
                that.backList = backList;
            }
            else {
                that.backList = that.backList.concat(backList);
            }*/
            if (responseDataFlag && that.backList && that.backList.length > 0) {
                htmlContent = formatJson(that.htmlTemplateId, { data: that.backList });
            } else {
                console.log('responseData is wrong or data is null');
            }
        } else {
            console.log(response[that.responseMsg]);
        }
        showCover(htmlContent);
    }
    //展示cover
    function showCover(htmlContent) {
        if (that.position && that.position == 'top') {
            var inputHeight;
            if (that.multiListDom) {
                inputHeight = that.inputDom.parentNode.offsetHeight;
            } else {
                inputHeight = that.inputDom.offsetHeight;
            }
            that.coverDom.setAttribute('style', 'bottom: ' + (inputHeight - 1) + 'px;border-top: 1px solid #ccc;');
        }
        if (htmlContent) {
            that.listDom.innerHTML = htmlContent;
        } else {
            console.log('data not array');
            that.listDom.innerHTML = '没有搜索结果';
        }
        addClass(that.coverDom, 'show');
    }
    //隐藏cover
    function hideCover() {
        removeClass(that.coverDom, 'show');
    }
    //模板替换
    function formatJson(str, data) {
        /* 模板替换,str:模板id或者内容，data:数据内容
         \W：匹配任何非单词字符。等价于 '[^A-Za-z0-9_]'。
         如果是id,并且cache中有值，直接返回，否则获取innerHTML，再次解析；
         如果不是id，解析并存入cache
         */
        var _formatJson_cache = {};
        var fn = !/\W/.test(str) ?
            formatJson(document.getElementById(str).innerHTML) :
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" + str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") + "');}return p.join('');");
        return data ? fn(data) : fn;
    }
    //监听事件
    function listenEvent(target, type, handler) {
        if (target.addEventListener) { //w3c
            target.addEventListener(type, handler, false);
        } else if (target.attachEvent) { //IE6-8
            target.attachEvent("on" + type, function(e) {
                return handler.call(target, e);
            });
        }
    }
    //取消监听事件
    function removeListenEvent(target, type, handler) {
        if (target.removeEventListener) { // 标准浏览器
            target.removeEventListener(type, handler, false);
        } else if (target.detachEvent) { // IE浏览器
            target.detachEvent("on" + type, function(e) {
                return handler.call(target, e);
            });
        }
    }
    //对外增加class
    function addClass(element, className) {
        if (className) {
            if (element && element.length) {
                for (var m = 0; m < element.length; m++) {
                    elementAddClass(element[m], className);
                }
            } else if (element) {
                elementAddClass(element, className);
            }
        }
    }
    //对外移除class
    function removeClass(element, className) {
        if (className) {
            if (element && element.length) {
                for (var m = 0; m < element.length; m++) {
                    elementRemoveClass(element[m], className);
                }
            } else if (element) {
                elementRemoveClass(element, className);
            }
        }
    }
    //增加class真实方法
    function elementAddClass(element, className) {
        var strInitClassName = element.className;
        if (strInitClassName) {
            var arrClassName = strInitClassName.replace("  ", " ").split(" ");
            if (arrClassName.indexOf(className) == -1) {
                arrClassName.push(className);
                var strClassName = arrClassName.join(" ");
                element.className = strClassName;
            }
        } else {
            element.className = className;
        }
    }
    //删除class真实方法
    function elementRemoveClass(element, className) {
        var strInitClassName = element.className;
        if (strInitClassName) {
            var arrClassName = strInitClassName.replace("  ", " ").split(" ");
            var arrNewClasName = new Array();
            if (arrClassName && arrClassName.length > 0) {
                for (var i = 0; i < arrClassName.length; i++) {
                    if (arrClassName[i] != className) {
                        arrNewClasName.push(arrClassName[i]);
                    }
                }
            }
            if (arrNewClasName && arrNewClasName.length > 0) {
                var strNewClasName = arrNewClasName.join(" ");
                element.className = strNewClasName;
            } else {
                element.className = "";
            }
        }
    }
    //节流
    function throttle(seq) {
        var nowTime = new Date().getTime();
        var newInterval = nowTime - that.lastTime;
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        if (newInterval >= that.interval) {
            seq.apply(null, args);
        } else {
            clearTimeout(that.throttleTimer);
            that.throttleTimer = setTimeout(function() {
                seq.apply(null, args);
            }, that.interval);
        }
    }
    //str是否在arr里
    function inArray(str, arr) {
        var flag = false;
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (str == arr[i]) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }
    //num是否是整数
    function isInt(num) {
        return (num && typeof num == 'number' && num % 1 === 0) === true;
    }
    //是否是一个数组
    function isArray(o) {
        //可能得值Number,String,Null,Undefined,Object
        return Object.prototype.toString.call(o) === '[object Array]';
    }
    return {
        init: function(param) {
            //初始化
            that = initData(param);
            if (!that.paramRight) {
                return;
            }
            var htmlContent = '没有匹配的结果';
            if (that.dataType == 'local' && that.data) {
                htmlContent = formatJson(that.htmlTemplateId, { data: that.data });
            }
            that.listDom.innerHTML = htmlContent;
            //获取焦点，弹出筛选框
            listenEvent(that.inputDom, 'focus', function(e) {
                if (that.dataType == 'local') {
                    // console.log('静态数据' + that.renderTplBefore);
                    htmlContent = that.renderTplBefore ? that.renderTplBefore(htmlContent, that) : htmlContent;
                    showCover(htmlContent);
                } else if (that.dataType == 'ajax') {
                    ajaxSearch();
                }
            });
            //本地数据
            if (that.dataType == 'local') {
                //输入后进行筛选
                listenEvent(that.inputDom, 'keyup', function(e) {
                    if (that.clearUserInput) {
                        that.isKeyup = true;
                    }
                    var key = that.inputDom.value;
                    //var htmlContent = '没有匹配的结果';
                    var reg = new RegExp(key, "i");
                    var matchData = [];
                    for (var i = 0; i < that.data.length; i++) {
                        if (matchAttribute(reg, that.data[i], param.searchKeyArr)) {
                            matchData.push(that.data[i]);
                        }
                    }
                    if (matchData.length >= 1) {
                        htmlContent = formatJson(that.htmlTemplateId, { data: matchData });
                    } else {
                        htmlContent = '没有匹配的结果';
                    }
                    that.listDom.innerHTML = htmlContent;
                });
            } else if (that.dataType == 'ajax') {
                //输入后进行筛选
                listenEvent(that.inputDom, 'keyup', function(e) {
                    if (that.clearUserInput) {
                        that.isKeyup = true;
                    }
                    throttle(ajaxSearch);
                });
            }

            listenEvent(that.inputDom, 'keydown', function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    return false;
                }
            });

            //失去焦点，如果当前值不是返回值，则清空
            listenEvent(that.inputDom, 'blur', function() {
                var key = that.inputDom.value;
                var matchFlag = false;
                if (key && that.backList && that.backList.length > 0) {
                    for (var i = 0; i < that.backList.length; i++) {
                        if (key == that.backList[i][that.clearUserMatchParam]) {
                            matchFlag = true;
                            break;
                        }
                    }
                }
                if (!matchFlag && that.clearUserInput && that.isKeyup) {
                    that.inputDom.value = '';
                }
                that.isKeyup = false;
                setTimeout(function() {
                    hideCover();
                }, 400);
            });
            //选择元素，回调
            listenEvent(that.listDom, 'click', function(e) {
                that.itemClickCallback(e);
                hideCover();
                if (that.multiListDom) {
                    that.inputDom.value = '';
                }
            });
            if (that.multiListDom) {
                listenEvent(that.multiListDom, 'click', function(e) {
                    if (that.itemDeleteCallback) {
                        that.itemDeleteCallback(e);
                    }
                });
            }
            return that;
        },
        resetParam: function(param) {
                if (param.data) {
                    that.data = param.data;
                }
                if (param.ajaxExistParam) {
                    that.ajaxExistParam = param.ajaxExistParam;
                }
            }
            /*//销毁
            destroy : function(){
                //获取焦点，弹出筛选框
                removeListenEvent(that.inputDom,'focus',function(e){});
                removeListenEvent(that.inputDom,'keyup',function(e){});
                removeListenEvent(that.inputDom,'keydown',function(e){});

                //失去焦点，如果当前值不是返回值，则清空
                removeListenEvent(that.inputDom,'blur',function(){});
                //选择元素，回调
                listenEvent(that.listDom,'click',function(e){
                    that.itemClickCallback(e);
                    hideCover();
                    if(that.multiListDom){
                        that.inputDom.value = '';
                    }
                });
                if(that.multiListDom){
                    listenEvent(that.multiListDom, 'click',function(e){
                        if(that.itemDeleteCallback){
                            that.itemDeleteCallback(e);
                        }
                    });
                }
            }*/
    }
}
//各次实例化一个新对象返回
module.exports = function() {
    return new autofilter();
};