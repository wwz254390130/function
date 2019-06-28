/**
 * @desc 0.1公共列表
 * @author cifer
 * @date 2017/3/27.
 */
var windowalert = require('module/windowalert');

function init(obj){
    if(!obj){console.log('obj is empty'); return;}
    $('#searchListTable').delegate('.js-btn-item-edit','click',function(){
        var id = $(this).data('id');
        if(!id){
            console.log('id can not empty');
            return;
        }
        showAlert(id,'edit');
    }).delegate('.js-btn-item-detail','click',function(){
        var id = $(this).data('id');
        if(!id){
            console.log('id can not empty');
            return;
        }
        showAlert(id,'detail');
    });

    function showAlert(id, option){
        $.ajax({
            type : 'GET',
            url  : obj.detailUrl,
            data : {
                autoId : id
            },
            dataType : 'json',
            error : function(e){
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
            },
            success : function(response){
                if(response.type == 'success'){
                    var data = response.data;
                    for(var k in data){
                        var key = $('#searchItemForm').find('input[name='+k+']');
                        if(key){
                            key.val(data[k]);
                        }
                    }
                    var $modalFooter = $('#searchItemModal .modal-footer');
                    if(option == 'detail'){
                        $modalFooter.addClass('hide');
                    }
                    else {
                        $modalFooter.removeClass('hide');
                    }
                }
                $('#searchItemModal').modal('show');
            }
        });
    }


    $('#itemSaveBtn').on('click',function(){
        $.ajax({
            type : 'POST',
            url  : obj.saveUrl,
            data : $('#searchItemForm').serialize(),
            dataType : 'json',
            error : function(e){
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
            },
            success : function(response){
                if(response.type == 'success'){
                    windowalert.popup({
                        content     : '保存成功！',
                        alertWidth  : 400,
                        alertHeight : undefined,
                        backgroundColor : '#444',
                        color       : '#fff',
                        time        : 1000,
                        rate        : 500,
                        callbackEvent : function(){
                            location.reload();
                        }
                    });
                }
            }
        });
    });
}


module.exports = {
    init : init
};