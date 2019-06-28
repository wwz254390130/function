/**
 * @desc 对autofilter再次封装，去除重复代码
 * @author cifer
 * @date 2017/5/3.
 */
var autofilter = require('module/autofilter');
var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

// 员工数据集合
var employeeData = [];

//无特殊要求的公共邮箱选择配置
function emailConfig($form, inputName, listDomName, position){
    var $input = $form.find('[name="'+inputName+'"]');
    
    //新增部门邮箱选择
    var autofilterObj = autofilter().init({
        inputDom : $input[0],
        listDom : $form.find('[name="'+listDomName+'"]')[0],
        dataType : 'ajax',
        keyParam : 'key',
        url : '/employee/findAjax',
        htmlTemplateId : 'autofilterTemplateEmail',
        responseCode : 'type',
        responseCodeSuccess : 'success',
        responseMsg : 'msg',
        responseData : 'data',
        clearUserInput : true,
        clearUserMatchParam : 'email',
        position: position,
        itemClickCallback : function(e){
            //回调处理
            if(e.target && (e.target.nodeName.toLowerCase() == "li")) {
                var item = e.target;
                var code = item.getAttribute('data-code');
                if(emailReg.test(code)){
                    $input.val(code);
                }
            }
        }
    });


    return autofilterObj;
}

//初始化之前，如果是编辑，则试着渲染之前的数据
function initMultiList($multiEmail, $multiLis){
    var multiEmail = $multiEmail.val();

    var html = '';
    if(multiEmail){
        var multiArr = multiEmail.split(';');
        var newArr = [];
        for(var i = 0;i < multiArr.length;i++){
            // var flag = false;
            // for(var j = 0;j < employeeData.length;j++){
                // if(multiArr[i] && emailReg.test(multiArr[i]) && multiArr[i] == employeeData[j].email){
                    // flag = true;
                    // newArr.push('<li class="multi-item" data-code="' + multiArr[i]+'">'+ employeeData[j].name +multiArr[i]+'<i class="icon-autofilter icon-autofilter-del">&times;</i></li>');
                    // break;
                // }
            // }
            // if(!flag){
                newArr.push('<li class="multi-item" data-code="'+ multiArr[i] +'" data-aduserid="">'+ multiArr[i] +'<i class="icon-autofilter icon-autofilter-del">&times;</i></li>');
            // }
        }
        html = newArr.join('');
    }
    $multiLis.html(html);
}

function initAllMulti($form, arr){
    for(var i = 0;i < arr.length;i++){
        var $multiEmail = $form.find('[name="'+arr[i].multiEmailName+'"]');
        var $multiLis = $form.find('[name="'+arr[i].multiLisName+'"]');
        initMultiList($multiEmail, $multiLis);
    }
}

//无特殊要求的公共邮箱选择配置
function multiEmailConfig($form, inputName, listDomName, multiListDomName, multiEmailName, position, nickName){
    var $input = $form.find('[name="'+inputName+'"]');
    var $multiList = $form.find('[name="'+multiListDomName+'"]');
    var $multiEmail = $form.find('[name="'+multiEmailName+'"]');    
    var $nickName = $form.find('[name="'+nickName+'"]');

    var autofilterObj = autofilter().init({
        inputDom : $input[0],
        listDom : $form.find('[name="'+listDomName+'"]')[0],
        dataType : 'ajax',
        keyParam : 'key',
        url : '/employee/findAjax',
        htmlTemplateId : 'autofilterTemplateEmail',
        responseCode : 'type',
        responseCodeSuccess : 'success',
        responseMsg : 'msg',
        responseData : 'data',
        clearUserInput : true,
        clearUserMatchParam : 'email',
        position: position,
        itemClickCallback : function(e){
            if(e.target && (e.target.nodeName.toLowerCase() == "li")) {
                var item = e.target;
                var _name = item.getAttribute('data-name');
                var _email = item.getAttribute('data-code');
                var _aduserid = item.getAttribute('data-aduserid');
                var _multiEmail = $multiEmail.val();
                var _nickName = $nickName.length ? $nickName.val() : '';
                
                var _multiEmailArr = _multiEmail ? _multiEmail.split(';') : [];
                var _nickNameArr = _nickName ? _nickName.split(';') : [];

                if(_email && $.inArray(_email, _multiEmailArr) < 0){
                    _multiEmailArr.push(_email);

                    if($.inArray(_aduserid, _nickNameArr) < 0){
                        _nickNameArr.push(_aduserid);
                    }

                    $multiEmail.val(_multiEmailArr.join(';'));
                    $nickName.val(_nickNameArr.join(';'));

                    $multiList.append('<li class="multi-item" data-code="'+ _email +'" data-aduserid="'+ _aduserid +'">'+ _name +' '+ _email +'<i class="icon-autofilter icon-autofilter-del">&times;</i></li>');
                }

                var $formContent = $(item).parents('.form-content');

                if($formContent && $formContent[0]){
                    $formContent.removeClass('form-error');
                }
            }
        },
        multiListDom :  $multiList[0],
        itemDeleteCallback : function(e){
            if(e.target && (e.target.nodeName.toLowerCase() == "i")) {
                var item = e.target.parentNode;
                var email = item.getAttribute('data-code');
                var _aduserid = item.getAttribute('data-aduserid');

                var multiEmail = $multiEmail.val();
                var multiArr = multiEmail.split(';');
                var newStr = delArrItem(email, multiArr);
                $multiEmail.val(newStr.join(';'));

                if(_aduserid && $nickName.length){
                    var _nickName = $nickName.val();
                    var _nickNameArr = _nickName ? _nickName.split(';') : [];
                    var _newNickStr = [];
                    
                    for(var i = 0, len = _nickNameArr.length; i < len; i++){
                        if(_nickNameArr[i] != _aduserid){
                            _newNickStr.push(_nickNameArr[i]);
                        }
                    }

                    $nickName.val(_newNickStr.join(';'));
                }

                $(item).remove();
            }
        }
    });

    return autofilterObj;
}

//删除数组中的元素
function delArrItem(item, arr){
    var newArr = [];
    if(arr.length > 0){
        for(var i = 0;i < arr.length;i++){
            if(item !== arr[i] && emailReg.test(arr[i])){
                newArr.push(arr[i]);
            }
        }
    }
    return newArr;
}

// 获取员工数据
// function getEmployeeData(){
//     $.ajax({
//         url: '/employee/findAjax',
//         type: 'POST',
//         dataType: 'JSON',
//         success: function(res){
//             if(res.type == 'success'){
//                 employeeData = res.data;
//             }
//         }
//     });
// }

// getEmployeeData();

module.exports = {
    emailConfig : emailConfig,
    multiEmailConfig : multiEmailConfig,
    initAllMulti : initAllMulti
};