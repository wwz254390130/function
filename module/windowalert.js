/**
 * @desc windowalert v1.1 这是一个简单的弹窗组件，用户只需要引入这个js就可以直接使用，无需另外引入css或图片
 * @author cifer
 * @date 2016/12/12
 */
/**
 有回调（需点击按钮，进行操作）：

 如弹出一行文字，一行解决：
 windowalert.simple({content : '弹窗内容'});

 复杂情况，则可以配置以下参数，（注：任何一个参数都可以省略，省略后都会使用默认):：
 windowalert.simple({
        content     : '弹窗内容',     //可以是html块
        alertWidth  : 400,           //宽度px，默认400
        alertHeight : undefined,     //无默认值，默认自适应
        backgroundColor : '#fff',    //背景色，默认#fff
        color       : '#333',        //字体色，默认#333
        buttonEvent : [              //按钮数组，每个按钮的名字以及回调函数，默认有一个确认按钮，回调是关闭弹窗。目前最多只支持两个按钮
            {
                value : '取消',           //按钮文字
                backgroundColor: '#999', //按钮背景色
                callbackEvent : function(){ //该按钮回调函数
                    windowalert.hideWindowalert();
                }
            },
            {
                value : '确定',
                backgroundColor: '#03A1E8',
                callbackEvent : function(){
                    windowalert.hideWindowalert();
                }
            }
        ]
    });
 上述去除注释干净格式
 windowalert.simple({
        content     : '这是一个弹窗内容',
        alertWidth  : 400,
        alertHeight : undefined,
        backgroundColor : '#fff',
        color       : '#333',
        buttonEvent : [
            {
                value : '取消',
                backgroundColor: '#999',
                callbackEvent : function(){
                    windowalert.hideWindowalert();
                }
            },
            {
                value : '确定',
                backgroundColor: '#03A1E8',
                callbackEvent : function(){
                    windowalert.hideWindowalert();
                }
            }
        ]
    });


 无回调，显示后自动消失
 windowalert.popup({
        content     : '这是一个自动会消失的弹窗内容！',     //可以是html块
        alertWidth  : 400,                              //宽度px，默认300
        alertHeight : undefined,                        //无默认值，默认自适应
        backgroundColor : '#444',                       //背景色，默认#444
        color       : '#fff',                           //字体色，默认#fff
        time        : 2000,                             //弹窗显示时间，默认2000毫秒
        rate        : 500                               //渐变显示，过渡时间，默认为undefined，即没有渐变效果
    });
 上述去除注释干净格式
 windowalert.popup({
        content     : '这是一个自动会消失的弹窗内容！',
        alertWidth  : 400,
        alertHeight : undefined,
        backgroundColor : '#444',
        color       : '#fff',
        time        : 2000,
        rate        : 500
    });
 */

// 中文0 英文1
var _langType = typeof(globalParame.localeType) != 'undefined' ? globalParame.localeType : '0';
var bodyDom = document.getElementsByTagName('body')[0];

var windowalert = {
    // 简单对话
    simple: function(obj){
        if(!obj){
            obj = {};
        }
        //初始化
        obj = this._getSimpleInit(obj);
        //处理低浏览器
        if(windowalert._checkLowIe(obj)){
            alert(obj.content);
        }
        else {
            //创建windowalert之前先创建一个蒙层
            var alertCoverDom = document.getElementById('windowAlertCover');
            //如果不是第一次弹窗cover
            if(alertCoverDom){
                this.show(alertCoverDom);
            }
            else {
                this._createAlertCover();
            }
            var windowAlerPromattDom = document.getElementById('windowAlertPromat');
            var windowAlertDom = document.getElementById('windowAlert');
            //如果是第一次弹窗
            if(windowAlertDom || windowAlerPromattDom){
                var _node = windowAlertDom || windowAlerPromattDom;
                //去重
                bodyDom.removeChild(_node);
                obj = this._createWindowAlert(obj);
                this._createSimple(obj);
            }
            else {
                obj = this._createWindowAlert(obj);
                this._createSimple(obj);
            }
        }
    },
    popup : function(obj){
        if(!obj){
            obj = {};
        }
        obj = this._getPopupInit(obj);
        //处理低浏览器
        if(this._checkLowIe()){
            alert(obj.content);
        }
        else {
            var windowAlertDom = document.getElementById('windowAlert');
            if(windowAlertDom){
                bodyDom.removeChild(windowAlertDom);
                obj = this._createWindowAlert(obj);
                this._createPopup(obj);
            }
            else {
                obj = this._createWindowAlert(obj);
                this._createPopup(obj);
            }
        }
    },
    // 初始化simple参数
    _getSimpleInit: function(obj){
        obj.content     = obj.content ? obj.content: _langType == '0' ? '操作成功！' : 'Success!';
        obj.alertWidth  = obj.alertWidth?obj.alertWidth:400;
        obj.alertHeight = obj.alertHeight?obj.alertHeight:undefined;
        obj.backgroundColor = obj.backgroundColor?obj.backgroundColor:'#fff';
        obj.color       = obj.color?obj.color:'#333';
        if(!obj.buttonEvent){
            obj.buttonEvent = [
                {
                    value           : _langType == '0' ? '确定' : 'Confirm',
                    backgroundColor : '#03A1E8',
                    callbackEvent : function(){
                        windowalert.hideWindowalert(obj);
                    }
                }
            ];
        }
        return obj;
    },
    // 初始化pop参数
    _getPopupInit: function(obj){
        var that = this;
        obj.content     = obj.content ? obj.content : _langType == '0' ? '操作成功！' : 'Success!';
        obj.alertWidth  = obj.alertWidth?obj.alertWidth:300;
        obj.alertHeight = obj.alertHeight?obj.alertHeight:undefined;
        obj.backgroundColor = obj.backgroundColor?obj.backgroundColor:'#444';
        obj.color       = obj.color?obj.color:'#fff';
        obj.time        = obj.time?obj.time:2000;
        if(obj.rate){
            if(that.isInt(obj.rate) && that.isInt(parseInt(obj.rate/10))){
                obj.rate = obj.rate/10;
            }
            else {
                obj.rate = 50;
            }
        }
        else{
            obj.rate = false;
        }
        obj.callbackEvent = (typeof obj.callbackEvent == 'function')?obj.callbackEvent:function(){};
        return obj;
    },
    // 需要在弹窗后渲染之后才能补充的内容
    _supplementObj: function(obj){
        if(!obj.alertHeight){
            var height = obj.alertDom.offsetHeight;
            if(height){
                obj.alertDom.style.marginTop = -height/2 + 'px';
            }
        }
    },
    // 创建蒙层
    _createAlertCover: function(){
        var alertCoverDom = document.createElement('div');
        alertCoverDom.setAttribute('id','windowAlertCover');
        alertCoverDom.setAttribute('style','position: fixed;top: 0;left: 0;z-index: 3000;width: 100%;height: 100%;background-color: #3c3c3c;filter: alpha(opacity=40);-moz-opacity:0.40;opacity: 0.40;');
        bodyDom.appendChild(alertCoverDom);
    },
    _createWindowAlert: function(obj){
        //弹窗
        var alertDom = document.createElement('div');
        if(obj.alertType == 'alert'){
            alertDom.setAttribute('id','windowAlertPromat');
        }else{
            alertDom.setAttribute('id','windowAlert');
        }
        //弹窗内容器，方面计算
        var alertInnerDom = document.createElement('div');
        alertInnerDom.setAttribute('style', 'padding: 10px');
        var arrStyle = [];
        arrStyle.push('position: fixed;');
        arrStyle.push('top: 50%;');
        arrStyle.push('left: 50%;');
        arrStyle.push('width: ' + obj.alertWidth + 'px;');
        //默认高
        if(obj.alertHeight){
            arrStyle.push('height: ' + obj.alertHeight + 'px;');
            arrStyle.push('margin-top: -' + obj.alertHeight/2 + 'px;');
        }
        arrStyle.push('max-width: 100%;');
        //arrStyle.push('min-Height: 40px;');
        arrStyle.push('border-radius: 8px;');
        arrStyle.push('margin-left: -' + obj.alertWidth/2 + 'px;');
        arrStyle.push('background-color: ' + obj.backgroundColor + ';');
        arrStyle.push('font-size: 14px;');
        arrStyle.push('color: ' + obj.color + ';');
        arrStyle.push('overflow: hidden;');
        arrStyle.push('z-index: 5000;');
        if(obj.rate){
            arrStyle.push('filter: alpha(opacity=0);opacity: 0;');
        }
        alertDom.setAttribute('style',arrStyle.join(''));
        //关闭按钮
        var alertCloseDom = document.createElement('div');
        alertCloseDom.setAttribute('style','position: absolute;top: 3px;right: 3px;font-size: 20px;color: #555;cursor: pointer;');
        alertCloseDom.setAttribute('id','windowalertClose');
        alertCloseDom.innerHTML = '&times;';
        obj.alertDom = alertDom;
        obj.alertClose = alertCloseDom;
        obj.alertInnerDom = alertInnerDom;

        return obj;
    },
    // 创建简单有回调的弹窗
    _createSimple: function(obj){
        var that = this;
        //弹窗内容容器
        var alertContentDom = document.createElement('div');
        alertContentDom.innerHTML = obj.content;
        alertContentDom.setAttribute('style','padding-bottom: 60px;margin: 10px 10px 0 10px;text-align: center;');

        //弹窗底部容器
        var alertBottomDom = document.createElement('div');
        alertBottomDom.setAttribute('style','position: absolute;bottom: 0;width: ' + (obj.alertWidth - 20) + 'px;height: 50px;border-top:1px solid #ddd;');

        //底部内容器元素，避免使用float: right;
        var alertBottomInnerDom = document.createElement('div');
        alertBottomInnerDom.setAttribute('style', 'float: right;margin-top: 10px;');

        var buttonEventNum = obj.buttonEvent.length;

        var leftButton = document.createElement('a');
        if(!obj.buttonEvent[0].backgroundColor){
            obj.buttonEvent[0].backgroundColor = '#03A1E8';
        }
        var buttonDefaultStyle = 'float: left;display: block;min-width: 90px;height: 30px;padding: 0 10px;border-radius: 4px;margin-left: 20px;line-height: 30px;color: #fff;text-align: center;cursor: pointer;';
        leftButton.setAttribute('style',buttonDefaultStyle + 'background-color: ' + obj.buttonEvent[0].backgroundColor + ';');
        leftButton.setAttribute('id','windowalertLeftButton');
        var leftButtonValue = document.createTextNode(obj.buttonEvent[0].value);
        leftButton.appendChild(leftButtonValue);
        alertBottomInnerDom.appendChild(leftButton);

        //如果有2个按钮，目前最多只支持两个按钮
        if(buttonEventNum == 2){
            var rightButton = document.createElement('a');
            if(!obj.buttonEvent[1].backgroundColor){
                obj.buttonEvent[1].backgroundColor = '#03A1E8';
            }
            rightButton.setAttribute('style',buttonDefaultStyle + 'background-color: ' + obj.buttonEvent[1].backgroundColor + ';');
            rightButton.setAttribute('id','windowalertRightButton');
            var rightButtonValue = document.createTextNode(obj.buttonEvent[1].value);
            rightButton.appendChild(rightButtonValue);
            alertBottomInnerDom.appendChild(rightButton);
        }
        alertBottomDom.appendChild(alertBottomInnerDom);


        obj.alertInnerDom.appendChild(alertContentDom);
        obj.alertInnerDom.appendChild(alertBottomDom);

        obj.alertDom.appendChild(obj.alertInnerDom);
        obj.alertDom.appendChild(obj.alertClose);
        bodyDom.appendChild(obj.alertDom);
        //需要在弹窗后渲染之后才能补充的内容
        windowalert._supplementObj(obj,obj.alertDom);

        //左边按钮
        var windowalertLeftButton = document.getElementById('windowalertLeftButton');
        that.listenEvent(windowalertLeftButton,'click',function(e){
            //阻止<a></a>跳转
            if(window.event){
                window.event.returnValue = false;//如果是IE下执行这个
            }
            else {
                e.preventDefault();
            }
            obj.buttonEvent[0].callbackEvent();
        });
        if(buttonEventNum == 2){
            //右边边按钮
            var windowalertbuttionRight = document.getElementById('windowalertRightButton');
            that.listenEvent(windowalertbuttionRight,'click',function(e){
                if(window.event){
                    window.event.returnValue = false;//如果是IE下执行这个
                }
                else {
                    e.preventDefault();
                }
                obj.buttonEvent[1].callbackEvent(e);
            });
        }

        var alertCloseDom = document.getElementById('windowalertClose');
        this.listenEvent(alertCloseDom,'click',function(e){
            //阻止<a></a>跳转
            if(window.event){
                window.event.returnValue = false;//如果是IE下执行这个
            }
            else {
                e.preventDefault();
            }
            that.hideWindowalert({alertType:''});
        });
    },
    // 创建定时自动消失的弹窗
    _createPopup: function(obj){
        var alertContentDom = document.createElement('div');
        alertContentDom.innerHTML = obj.content;
        alertContentDom.setAttribute('style','text-align: left;overflow: hidden;');
        obj.alertInnerDom.appendChild(alertContentDom);
        obj.alertDom.appendChild(obj.alertInnerDom);
        bodyDom.appendChild(obj.alertDom);
        //需要在弹窗后渲染之后才能补充的内容
        this._supplementObj(obj);
        //有动画渐变
        if(obj.rate){
            this._shadeStart(obj);
        }
        else {
            setTimeout(function(){
                windowalert.hideWindowalert(obj);
                obj.callbackEvent();
            },obj.time);
        }
    },
    // 渐变开始
    _shadeStart: function(obj){
        var shade = setInterval(function(){
            var opacity = parseFloat(obj.alertDom.style.opacity);
            if(opacity < 0.9){
                opacity = opacity + 0.1;
            }
            else {
                opacity = 1;
                clearInterval(shade);
                setTimeout(function(){
                    windowalert._shadeEnd(obj);
                },obj.time);
            }
            obj.alertDom.style.opacity = opacity;
            if(obj.alertDom.style.filter){
                obj.alertDom.style.filter = 'alpha(opacity=' + 100*opacity + ')';
            }
        },obj.rate);
    },
    // 渐变结束
    _shadeEnd: function(obj){
        var shade = setInterval(function(){
            var opacity = parseFloat(obj.alertDom.style.opacity);
            if(opacity > 0.1){
                //在safari下，如果不保留一位小数，会无限减下去
                opacity = (opacity - 0.1).toFixed(1);
            }
            else {
                opacity = 0;
                obj.alertDom.style.opacity = opacity;
                clearInterval(shade);
                windowalert.hideWindowalert(obj);
                obj.callbackEvent();
            }
            obj.alertDom.style.opacity = opacity;
            if(obj.alertDom.style.filter){
                obj.alertDom.style.filter = 'alpha(opacity=' + 100*opacity + ')';
            }
        },obj.rate);
    },
    // 监听事件
    listenEvent: function(target, type, handler) {
        if(target.addEventListener){//w3c
            target.addEventListener(type, handler,false);
        }
        else if(target.attachEvent){//IE6-8
            target.attachEvent("on"+type, function(e){
                return handler.call(target,e);
            });
        }
    },
    // 隐藏元素
    hide: function(dom){
        var style = dom.getAttribute('style');
        //DISPLAY大写为了兼容ie8
        if(style.indexOf('display: none;') == -1 || style.indexOf('DISPLAY: none;') == -1){
            if(style.indexOf('display: block;') > -1 || style.indexOf('DISPLAY: block;') > -1){
                style = style.replace(/display: block;/g,'display: none;');
                style = style.replace(/DISPLAY: block;/g,'display: none;');
            }
            else {
                style = 'display: none;' + style;
            }
            dom.setAttribute('style', style);
        }
    },
    // 显示元素
    show: function(dom){
        var style = dom.getAttribute('style');
        if(style.indexOf('display: block;') == -1 || style.indexOf('DISPLAY: block;') == -1){
            if(style.indexOf('display: none;') > -1 || style.indexOf('DISPLAY: none;') > -1){
                style = style.replace(/display: none;/g,'display: block;');
                style = style.replace(/DISPLAY: none;/g,'display: block;');
            }
            else {
                style = 'display: block;' + style;
            }
            dom.setAttribute('style', style);
        }
    },
    // 隐藏windowalert
    hideWindowalert: function(obj){
        var windowAlertCoverDom = document.getElementById('windowAlertCover');
        if(windowAlertCoverDom){
            this.hide(windowAlertCoverDom);
        }
        var windowAlertDom = document.getElementById('windowAlert');
        var windowAlertPromat = document.getElementById('windowAlertPromat');
        if(windowAlertDom || windowAlertPromat){       
                if(obj && obj.alertType == 'alert'){
                    this.hide(windowAlertPromat);
               
            }else{
                this.hide(windowAlertDom);
            }      
        }
    },
    showWindowalert: function(){
    },
    // num是否是整数
    isInt : function(num){
        return (num && typeof num == 'number' && num%1 === 0) === true;
    },
    // 是否是低浏览器ie6,ie7
    _checkLowIe : function(){
        var isLowIe = false;
        var browser = navigator.appName;
        var b_version = navigator.appVersion;
        var version = b_version.split(";");
        var trim_Version = '';
        if(version && version.length > 1 && version[1]){
            trim_Version = version[1].replace(/[ ]/g,"");
        }
        if(browser =="Microsoft Internet Explorer"){
            if(trim_Version == "MSIE6.0" || trim_Version=="MSIE7.0"){
                isLowIe = true;
            }
        }
        return isLowIe;
    }
};
module.exports = windowalert;

