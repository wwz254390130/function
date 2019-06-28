/**
 * @desc 基于表单formhand的表单提交公共代码
 * @author cifer
 * @date 2017/5/5.
 */
var windowalert = require('module/windowalert');
var formhand = require('module/formhand');
//表单提交
function submitForm(obj){
    if(!(obj.$form && obj.$form[0])){
        console.log('formhand common submitForm form not exist');
        return;
    }
    var flag = formhand.validateAll(obj.$form);
    if(!flag){return;}
    var isWait = obj.$form.attr('wait');
    if(isWait){
        console.log('form is waitting');
        return;
    }
    else {
        obj.$form.attr('wait',true);
    }
    $.ajax({
        url : obj.$form.attr('action'),
        type : 'POST',
        data : obj.$form.serialize(),
        dataType : 'json',
        error : function(){
            windowalert.simple({
                content     : '系统繁忙',
                alertWidth  : 400,
                alertHeight : undefined,
                backgroundColor : '#fff',
                color       : '#333',
                buttonEvent : [
                    {
                        value : '确定',
                        backgroundColor: '#03A1E8',
                        callbackEvent : function(){
                            windowalert.hideWindowalert();
                        }
                    }
                ]
            });
            obj.$form.removeAttr('wait');
        },
        success : function(response){
            if(response.type == 'success'){
                if(obj.modalStatus == 'show'){
                    obj.$modal.modal({
                        backdrop : 'static',
                        show : true
                    });
                }
                else {
                    obj.$modal.modal(obj.modalStatus);
                }
                //getDetailHtml(obj.tabIndex);
                windowalert.popup({
                    content     : response.msg,
                    alertWidth  : 400,
                    alertHeight : undefined,
                    backgroundColor : '#444',
                    color       : '#fff',
                    time        : 1000,
                    rate        : 500,
                    callbackEvent : function(){}
                });
                if(obj.callbackEvent){
                    obj.callbackEvent(obj);
                }
            }
            else {
                windowalert.popup({
                    content     : response.msg,
                    alertWidth  : 400,
                    alertHeight : undefined,
                    backgroundColor : '#444',
                    color       : '#fff',
                    time        : 1000,
                    rate        : 500,
                    callbackEvent : function(){}
                });
            }
            obj.$form.removeAttr('wait');
        }
    });
}

module.exports = {
    submitForm : submitForm
};
