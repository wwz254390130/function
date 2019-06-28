/**
 * @desc 部门选择 - 三级联动
 * @author fred
 * @date 2017/10/11 
 */

// 渲染select选项
function renderBuList(opts){
    var _html = '<option value="">请选择</option>';
    var _selected = '';
    var _selectedType = opts.selType || 'code';

    if(opts.data.length){
        for (var i = 0, len = opts.data.length; i < len; i++) {
            _selected = opts.data[i][_selectedType] == opts.val ? 'selected' : '';
            _html += '<option value="'+ opts.data[i].code +'" '+ _selected +'>'+ opts.data[i].name +'</option>'
        }
    }

    return _html;
}

// 部门数据处理
function buDataFormat(opts){
    var _data = [];

    for (var i = 0, len = opts.data.length; i < len; i++) {
        if(opts.type == 'second'){
            // 二级部门数据
            if(opts.val == opts.data[i].code && opts.data[i].depts){
                _data = opts.data[i].depts;
            }
        }else if(opts.type == 'three' && opts.data[i].depts){
            // 三级部门数据
            for (var j = 0, jlen = opts.data[i].depts.length; j < jlen; j++) {
                if(opts.val == opts.data[i].depts[j].code && opts.data[i].depts[j].depts){
                    _data = opts.data[i].depts[j].depts;
                }
            }
        }
    }

    return _data;
}

// 子级列表渲染
function renderChildList(opts, type){
    if(!opts[type] || !opts[type].obj.length){
        return;
    }

    var _fval = type == 'second' ? opts.first.obj.val() : opts.second.obj.val();

    var _sdata = buDataFormat({
        type: type,
        val: _fval,
        data: opts.data
    });

    var _html = renderBuList({
        data: _sdata,
        selType: opts.selType,
        val: opts[type].val
    });

    opts[type].obj.html(_html);

    if(type == 'second' && opts.three){
        renderChildList(opts, 'three');
    }
}

// 部门初始化
function buListInit(opts){
    if(!opts.first.obj.length){
        return;
    }

    // 一级
    opts.first.obj.each(function(){
        var _html = renderBuList({
            val: opts.first.val,
            selType: opts.selType,
            data: opts.data
        });

        $(this).html(_html);
    }).on('change', function(){
        renderChildList(opts, 'second');
    });

    // 二级
    if(opts.second.obj.length){
        renderChildList(opts, 'second');

        if(opts.three.obj.length){
            opts.second.obj.on('change', function(){
                renderChildList(opts, 'three');
            });
        }
    }
}

// 设置选中值
function setSelectValue(arr){
    var _arr = arr.length ? arr : [arr];

    for (var i = _arr.length - 1; i >= 0; i--) {
        renderChildList(arr[i], 'second');
    }
}

// 初始化
function init(opts){
    /*
    @boxId - 容器Id
    @item - 一级部门选项
    @data - 数据
    */ 
    var $box = $('#' + opts.boxId);

    $box.find(opts.item).each(function(){
        var $form = $(this).parents('form');

        // 二级
        var _sName = $(this).attr('data-relation-name');
        var $s = $form.find('select[name="'+ _sName +'"]');
        var _sval = $s.val();

        // 三级
        var _tName = $s.attr('data-relation-name');
        var $t = $form.find('select[name="'+ _tName +'"]');
        var _tval = $t.val();

        buListInit({
            data: opts.data,
            first: {
                obj: $(this),
                val: $(this).val()
            },
            second: {
                obj: $s,
                val: _sval
            },
            three: {
                obj: $t,
                val: _tval
            }
        });
    });
}

module.exports = {
    init: init,
    setSelectValue: setSelectValue
};
