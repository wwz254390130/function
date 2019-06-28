/**
 * @desc 表单模板相关
 * @author fred
 * @date 2018/10/10
 */

function add($box, html, callback, intype){
    var _intype = intype || 'append';

    if(_intype == 'prepend'){
        $box.prepend(html);
    }else if(_intype == 'html'){
        $box.html(html);
    }else{
        $box.append(html);
    }

    typeof(callback) == 'function' && callback($box);
}

function insert($btn, callback, intype) {
    var $tlp = $($btn.attr('data-tpl'));
    var $box = $($btn.attr('data-to'));
    var _init = $btn.attr('data-init');
    var _intype = intype || 'append';

    if(!$btn.length || !$tlp.length || !$box.length){
        console.log('dom对象无法找到：'+ $btn.length + $tlp.length + $box.length);
        return false;
    }

    $btn.on('click', function(){
        add($box, $tlp.html(), callback, _intype);
    });

    // 是否直接初始化
    if(_init){
        add($box, $tlp.html(), callback, _intype);
    }
}

module.exports = {
    add: add,
    insert: insert
};