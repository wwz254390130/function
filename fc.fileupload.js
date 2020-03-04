/*
{

}
*/
function fileUpload(opts){
	var _round = Math.ceil(Math.random()*10000);

	var _opts = $.extend({}, {
		iframeName: 'fileFormIframe' + _round,
		formName: 'fileFormForm' + _round,
		formUrl: '/file/upload',
		formInput: ['parent', 'parentId'],
		isRenderList: true,
		renderInputName: 'filesId[]',
		filesList: null,
		btnText: '上传文件'
	}, opts);

	var $body = $('body'),
		$iframe,
		$form;

	if(!_opts.obj.val()){
		return false;
	}

	_opts.btn.text('上传中...');

	$iframe = $('<iframe style="display:none; width: 0; height: 0;" id="'+ _opts.iframeName +'" name="'+ _opts.iframeName +'" />');
	$body.append($iframe);

	$form = $('<form style="display:none; width: 0; height: 0;" name="'+ _opts.formName +'"></form>');

	if(_opts.fileName){
		_opts.obj.attr('name', _opts.fileName);		
	}

	$form.append(_opts.obj);

	if(_opts.data){
		$.each(_opts.formInput, function(i){
			$form.append('<input type="hidden" name="'+ _opts.formInput[i] +'" value="'+ _opts.data[_opts.formInput[i]] +'">');
		});
	}

	$form.attr('action', _opts.formUrl);
	$form.attr('method', 'POST');
	$form.attr('target', _opts.iframeName);
	$form.attr('enctype', 'multipart/form-data');

	$body.append($form);


	$form.submit();


	$iframe.load(function(){
		var _res = $(this).contents().find('body pre').html();
	    var _ret = _res ? JSON.parse(_res) : { type : 'error', msg: '上传失败'};

	    if(_ret.type == 'success'){
	    	_opts.obj.val('');
	    }
		
		_opts.btn.text(_opts.btnText);
		_opts.btn.after(_opts.obj);
        
        if(!_opts.idName){
        	_opts.idName = 'id';
        }
        
	    if(_opts.isRenderList && _opts.filesList && _ret.type == 'success'){
	    	var _list = '<li><a href="'+ _ret.data.fileUrl +'" target="_blank">'+ _ret.data.fileName +'</a>（'+ _ret.data.createUserName +' 上传于 '+ _ret.data.createTime +'）&nbsp;&nbsp;&nbsp;<a href="javascript:void(0);" class="js_deleteFile">删除</a><input type="hidden" name="'+ _opts.renderInputName +'" value="'+ _ret.data[_opts.idName] +'"></li>';

	    	if(_opts.btn.attr('multiple')){
	    		// 多文件
	    		_opts.filesList.append(_list);
	    	}else{
	    		// 单文件
	    		_opts.filesList.html(_list);
	    	}
	    }

	    typeof(_opts.callback) == 'function' && _opts.callback(_ret, _opts);

	    $iframe.remove();
	});
};

// 初始化
function init($box){
	var _box = $box || $('body');

	_box.on('click', '.js_deleteFile', function(){
        var constatus = confirm('是否确认删除该文件？')
		if(constatus==true){
			$(this).parents('li').remove();
		}else{
            return false;
        }
	});
}


module.exports = {
	init: init,
	// 上传文件
	fileUpload: fileUpload
}