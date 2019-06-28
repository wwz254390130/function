/**
 * @desc 表单助手
 * @author cifer
 * @date 2017/4/20.
 */

//清空表单
function clearForm($form, extraArr){
    if($form[0]){
        //做一个表单特殊处理
        $form.find('.form-content').removeClass('form-error');
        var $inputList = $form.find('input');
        var $textareaList = $form.find('textarea');
        var $selectList = $form.find('select');
        for(var i = 0;i < $inputList.length;i++){
            var $inputItem = $inputList.eq(i);
            var nameValue = $inputItem.attr('name');
            if(!extraArr || !inArray(nameValue, extraArr)){
                if($inputItem.attr('type') == 'radio' || $inputItem.attr('type') == 'checkbox'){
                    $inputItem.removeProp('checked');
                }
                else {
                    $inputItem.val('');
                }
            }
        }
        for(var j = 0;j < $textareaList.length;j++){
            var $textareaItem = $textareaList.eq(i);
            var nameValue = $textareaItem.attr('name');
            if(!extraArr || !inArray(nameValue, extraArr)){
                $textareaItem.eq(i).val('');
            }
        }
        for(var k = 0;k < $selectList.length;k++){
            var $selectItem = $selectList.eq(k);
            var nameValue = $selectItem.attr('name');
            if(!extraArr || !inArray(nameValue, extraArr)){
                var $optionList = $selectItem.find('option');
                $optionList.removeProp('selected');
                $optionList.eq(0).prop('selected',true);
            }
        }
    }
}

//填充表单
function fillForm($form, data, ntype){
    if(data && $form[0]){
        var _ntype = ntype || 'name';
        var _name = '';
        var _type = '';
        var _val = '';
        var _checkboxArr = '';

        //input
        $form.find('input,textarea').each(function(i){            
            _name = $(this).attr(_ntype);
            _type = $(this).attr('type');
            _val = $(this).val();
            if(data[_name] || data[_name] === 0 || data[_name] === '0' || data[_name] === false){
                if (_type == 'radio') {
                    $(this).prop('checked', _val == data[_name]);
                }else if(_type == 'checkbox'){
                    if(data[_name] && typeof(data[_name]) == 'string'){
                        _checkboxArr = data[_name].split(',');

                        if(inArray(_val, _checkboxArr)){
                            $(this).prop('checked', true);
                        }
                    }else{
                        $(this).prop('checked', _val == data[_name]);
                    }
                }else{
                    $(this).val(data[_name]);
                }
            }
        });

        //select
        $form.find('select').each(function(i){            
            _name = $(this).attr(_ntype);

            if(_name && data[_name]){
                $(this).find('option').each(function(){
                    if(data[_name] == $(this).attr('value')){
                        $(this).prop('selected',true);
                    }else{
                        $(this).removeAttr('selected');
                    }
                });
            }
        });
    }
    else {
        console.log('data or form no exsit');
    }
}

//判断str在arr里
function inArray(str, arr){
    var flag = false;
    if(arr.length > 0){
        for(var i = 0;i < arr.length;i++){
            if(str == arr[i]){
                flag = true;
                break;
            }
        }
    }
    return flag;
}

var throttleLastTime;
var throttleTimer;
var $item;
function validateInit($form){
    throttleLastTime = new Date().getTime();
    //input
    var $inputList = $form.find('input');
    for(var i = 0;i < $inputList.length;i++){
        $item = $inputList.eq(i);
        var nameValue = $item.attr('name');
        var valiType = $item.attr('vali-type');
        if(($item.attr('type') == 'text') && nameValue && valiType){
            addEvent($item);
        }
    }
    //textarea
    var $textareaList = $form.find('textarea');
    for(var j = 0;j < $textareaList.length;j++){
        $item = $textareaList.eq(j);
        var nameValue = $item.attr('name');
        var valiType = $item.attr('vali-type');
        if(nameValue && valiType){
            addEvent($item);
        }
    }
    //select
    var $selectList = $form.find('select');
    for(var k = 0;k < $selectList.length;k++){
        $item = $selectList.eq(k);
        var nameValue = $item.attr('name');
        var valiType = $item.attr('vali-type');
        if(nameValue && valiType){
            addEvent($item);
        }
    }
}
//绑定事件
function addEvent($item){
    /*var valiEvent = $item.attr('vali-event');
    if(!valiEvent){
        valiEvent = 'keyup';
    }*/
    $item.off('keyup').on('keyup', function(){
        throttle(validateItem, $item, true);
    });
    $item.off('blur').on('blur', function(){
        throttle(validateItem, $item, true);
    });
}
function validateAll($form){
    throttleLastTime = new Date().getTime();
    var flag = true;
    //input
    var $inputList = $form.find('input');
    for(var i = 0;i < $inputList.length;i++){
        $item = $inputList.eq(i);
        if($item.attr('type') == 'text' || $item.attr('type') == 'hidden'){
            var flagTemp = validateItem($item, true);
            if(!flagTemp){
                flag = flagTemp;
            }
        }
    }
    //textarea
    var $textareaList = $form.find('textarea');
    for(var j = 0;j < $textareaList.length;j++){
        $item = $textareaList.eq(j);
        var flagTemp = validateItem($item, true);
        if(!flagTemp){
            flag = flagTemp;
        }
    }
    //select
    var $selectList = $form.find('select');
    for(var k = 0;k < $selectList.length;k++){
        $item = $selectList.eq(k);
        var flagTemp = validateItem($item, true);
        if(!flagTemp){
            flag = flagTemp;
        }
    }
    return flag;
}

/*var regObj = {
    "int": /^\d{1,}$/,
    "number": /^\d{1,}$/,
    "price": /^[1-9]?\d+(\.\d{1,2})?$/,
    "email": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,///^[a-zA-Z0-9]+((\.|-|_|\+)?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9])*(\.[a-zA-Z]+){1,3}$/,
    "cellphone": /^(13|14|15|17|18)[0-9]{9}$/,
    "phone": /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
    "qq": /^[1-9]\d{3,10}$/
};*/

var regObj = {
    "int": {
        reg : /^0$|^[1-9]\d*$/,
        msg : '需输入整数'
    },
    "number": {
        reg : /^-?0(\.\d+)?$|^(-?[1-9])\d*(\.\d+)?$/,
        msg : '需输入数字'
    },
    "positive": {
        reg : /^0(\.\d+)?$|^([1-9])\d*(\.\d+)?$/,
        msg : '需输入正数'
    },
    "price": {
        reg : /^[1-9]?\d+(\.\d{1,2})?$/,
        msg : '价格格式不正确'
    },
    "email": {
        reg : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        msg : '邮箱格式不正确'
    },
    "cellphone": {
        reg : /^(13|14|15|17|18)[0-9]{9}$/,
        msg : '手机格式不正确'
    },
    "phone": {
        reg : /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
        msg : '固定电话格式不正确'
    },
    "qq": {
        reg : /^[1-9]\d{3,10}$/,
        msg : 'QQ格式不正确'
    },
    "url":{
        reg : /a/,
        url : 'url格式不正式'
    }
};
//num是否是整数
function isInt(num){
    return (num && typeof num == 'number' && num && num%1 === 0) === true;
}
function validateItem($item, flag){
    throttleLastTime = new Date().getTime();
    if(!($item && $item[0])){
        console.log('current item undefined');
        return true;
    }
    //没有name属性
    var nameValue = $item.attr('name');
    if(!nameValue){
        console.log(nameValue + ' not exist');
        return true;
    }
    var itemValue = $item.val();
    var name = $item.attr('vali-name');
    var msg = '';
    if(!name)name='该项';
    //限制范围
    var rangeStr = $item.attr('vali-range');
    if(rangeStr){
        var rangeArr = rangeStr.split(',');
        if(rangeArr[0]){
            var min = parseInt(rangeArr[0]);
            if(isInt(min)){
                if(itemValue.length < min){
                    msg = name + '长度不能小于' + min;
                    flag = false;
                    errorResult();
                    return flag;
                }
            }
        }
        if(rangeArr[1]){
            var max = parseInt(rangeArr[1]);
            if(isInt(max)){
                if(itemValue.length > max){
                    msg = name + '长度不能大于' + max;
                    flag = false;
                    errorResult();
                    return flag;
                }
            }
        }
    }
    //限制大小
    var rangeNum = $item.attr('vali-range-num');
    if(rangeNum){
        var rangeArr = rangeNum.split(',');
        itemValue = parseFloat(itemValue);
        if(isNaN(itemValue)){
            console.log(itemValue + 'not a number');
            msg = name + '请输入数字';
            flag = false;
            errorResult();
            return flag;
        }
        if(rangeArr[0]){
            var min = parseInt(rangeArr[0]);
            if(isInt(min)){
                if(itemValue < min){
                    msg = name + '大小不能小于' + min;
                    flag = false;
                    errorResult();
                    return flag;
                }
            }
        }
        if(rangeArr[1]){
            var max = parseInt(rangeArr[1]);
            if(isInt(max)){
                if(itemValue > max){
                    msg = name + '大小不能大于' + max;
                    flag = false;
                    errorResult();
                    return flag;
                }
            }
        }
    }
    //没有type时，不验证
    var valiTypeListStr = $item.attr('vali-type');
    if(!valiTypeListStr){
        return true;
    }
    //非空判断
    if(valiTypeListStr.indexOf('not-null') > -1){
        if(!itemValue){
            msg = name + '不能为空';
            flag = false;
            errorResult();
            return flag;
        }
    }

    var reg = $item.attr('vali-reg');
    //如果有自定义正则表达式
    if(reg){
        flag = testReg(reg, flag);
        errorResult();
        return flag;
    }
    else {
        if(itemValue){
            valiTypeListStr = valiTypeListStr.replace('not-null','');
            var valiTypeList = valiTypeListStr.split(',');
            for(var i = 0;i < valiTypeList.length;i++){
                var valiType = valiTypeList[i];
                if(valiType && regObj[valiType]){
                    if(!regObj[valiType].reg.test(itemValue)){
                        msg = name + regObj[valiType].msg;
                        flag = false;
                    }
                }
            }
        }
        errorResult();
        return flag;
    }
    function testReg(reg,flag){
        var patt = new RegExp(reg);
        if(!patt.test(itemValue)){
            msg = name + '格式不对';
            flag = false;
        }
        return flag;
    }
    //错误处理，有时需提前处理，减少验证
    function errorResult(){
        var $formContent = $item.parents('.form-content');
        if(!($formContent && $formContent[0])){
            console.log(nameValue + ' form-content not exist');
            return true;
        }
        if(flag){
            $formContent.removeClass('form-error');
        }
        else {
            $formContent.addClass('form-error');
            $formContent.find('.msg').html(msg);
        }
    }
    return flag;
}

function throttle2(func, obj){
    var nowTime = new Date().getTime();
    var newInterval = nowTime - throttleLastTime;
    if(newInterval >= 500){
        func(obj);
    }
    else {
        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(function(){
            func(obj);
        },500);
    }
}

/*throttle(a,1,2);
function a(x,y){
    console.log('a work '+ x +' ' + y);
}*/
function throttle(seq){
    var nowTime = new Date().getTime();
    var newInterval = nowTime - throttleLastTime;
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    if(newInterval >= 500){
        seq.apply(null, args);
    }
    else {
        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(function(){
            seq.apply(null, args);
        },500);
    }
}


module.exports = {
    clearForm   : clearForm,
    fillForm    : fillForm,
    validateInit : validateInit,
    validateAll    : validateAll
};
