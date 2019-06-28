/**
 * @desc 表单校验
 * @author fred
 * @date 2018/9/30
 */

var _lang = require('module/langs.form.validator');

// 预设正则
var regexEnum = {
    //整数
    intege: /^-?[1-9]\d*$/,
    //正整数
    intege1: /^[1-9]\d*$/,
    //负整数
    intege2: /^-[1-9]\d*$/,
    //数字
    num: /^([+-]?)\d*\.?\d+$/,
    //正数（正整数 + 0）
    num1: /^[1-9]\d*|0$/,
    //负数（负整数 + 0）
    num2: /^-[1-9]\d*|0$/,
    //正数（浮点数 + 0）
    num3: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))|0$/,
    // 价格
    price: /^(0|[1-9][0-9]{0,10})(\.[0-9]{1,6})?$/,
     // 价格2位小数
    price1: /^(0|[1-9][0-9]{0,10})(\.[0-9]{1,2})?$/,
    //邮件
    email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    //url
    url: /^(https?|ftp|mms):\/\/([A-z0-9_\-]+\.)*[A-z0-9]+\-?[A-z0-9]+\.[A-z]{2,}(\/.*)*\/?/,
    //仅中文
    chinese: /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/,
    //仅ACSII字符
    ascii: /^[\x00-\xFF]+$/,
    //手机 6-16
    mobile: /^(\+|[0-9]){6,16}$/,
    // 账户 - 手机+邮箱
    account: /(^(\+|[0-9]){6,16}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/,
    // 密码
    passwordLogin: /^[A-Za-z0-9_\-]{6,20}$/,
    password: /^(?=.*?[a-zA-Z])(?=.*?[0-9])[0-9A-Za-z_\-]{8,20}$/,
    //字母
    letter: /^[A-Za-z]+$/,
    //大写字母                  
    letter_u: /^[A-Z]+$/,
    //小写字母                  
    letter_l: /^[a-z]+$/,
    // 一般文本输入
    text: /^[A-Za-z0-9\u4E00-\u9FA5\uF900-\uFA2D]+$/,
    //公司名
    companyname: /^[A-Za-z0-9_()（）\-\u4E00-\u9FA5\uF900-\uFA2D]+$/,
    //公司电话
    companyphone: /^([0-9]{0,50}[()（）\+\-]?)*$/,
    //公司地址
    companyaddr: /^[A-Za-z0-9_()（）\#\-\u4E00-\u9FA5\uF900-\uFA2D]+$/,
    //身份证
    idcard: /^[1-9]([0-9]{14}|[0-9]{17})$/,
    // 电话或者手机
    phone: /^(?:13|15|18|14|17)[0-9]{9}$|^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/,
    //纳税人人识别号
    invoice: /^[0-9][A-Za-z]{16,20}$/
};

// 字段校验默认配置项
var inputDefaults = {
    // 改变值后触发验证
    isChange:true,
    // 失去焦点是否校验
    isBulr: true,
    // 获取校验key的属性
    keyName: 'name',
    // 通过配置传递值进行校验
    val: '',

    // 是否可不填，默认为 false
    isEmpty: false,
    // 为空提示语
    emptyTips: '',

    // 校验类型，可填写已预设类型
    rexType: '',
    // 直接写正则进行校验
    regexp: '',
    // 正则校验提示语
    rexTips: '',

    // 长度限制，分别设置
    minLength: 0,
    maxLength: 200,
    // 长度提示语
    lengthTips: '',

    // 校验回调
    callback: null
};

// 生成提示信息
function renderTips($input, ret) {
    // 判断改对象是否存在
    if (!$input.length) {
        return false;
    }

    var $box = $input.parents('.input-item');
    var $tips = $box.find('.tips');
    var _class = 'tips ok';

    // 是否校验不通过
    if(!ret.isRight){
        _class = 'tips err';
        $box.addClass('error');
    }else{
        $box.removeClass('error');
    }

    // 判断是否已存在
    if (!$tips.length) {
        $input.after('<div class="' + _class + '">' + ret.tips + '</div>');
    } else {
        $tips.attr('class', _class).text(ret.tips)
    }
}

// 字段校验
function inputValidate($input, config) {
    // 返回结果
    var _ret = {
        isRight: true,
        tips: '',
        input:$input
    };

    var _config = $.extend({}, inputDefaults, config);

    // console.log(_config);

    // 值 - 可以通过配置直接传递要校验的值
    var _val = _config.val || $.trim($input.val());

    // console.log(_val + ' 校验结果：' + regexEnum.phone.test(_val));

    /*
    部分配置以input上的自定义属性优先级最高
    */
    _config.isEmpty = $input.attr('data-is-empty') ? true : _config.isEmpty;
    _config.minLength = $input.attr('data-minLength') || _config.minLength;
    _config.maxLength = $input.attr('data-maxLength') || _config.maxLength;

    // 正则
    var _inRex = new RegExp(_config.regexp || regexEnum[_config.rexType]);

    // 是否可为空，有值时才做校验
    if (_config.isEmpty && _val) {
        return _ret;
    }

    // 为空校验
    if (!_val.length) {
        _ret.isRight = false;
        _ret.tips = _config.emptyTips || _lang.inputEmpty;
    }

    // 长度校验
    if (_ret.isRight && (_val.length < _config.minLength || _val.length > _config.maxLength)) {
        _ret.isRight = false;
        _ret.tips = _config.lengthTips || _lang.minMaxLengtht(_config.minLength, _config.maxLength);
    }

    // 正则校验
    if (_ret.isRight && !_inRex.test(_val)) {
        _ret.isRight = false;
        _ret.tips = _config.rexTips || _lang.rexError;
    }

    // console.log(_ret);

    // 返回校验结果
    return _ret;
}

// 单个输入框校验
function oneValidate($input, config) {
    var _vret,
        _config = config || {};

    // 判断改对象是否存在
    if (!$input.length) {
        _vret = {
            isRight: false,
            tips: _lang.inputUndefined
        };
    } else {
        // 进行校验
        _vret = inputValidate($input, _config);
    }

    // console.log(_vret);

    // 判断是否有回调方法
    if (typeof(_config.callback) == 'function') {
        _config.callback($input, _vret);
    } else {
        // 无回调则执行默认的提示信息方法
        renderTips($input, _vret);
    }

    return _vret;
}

// 表单校验
function formValidate($form, config, carr) {
    if (typeof(config) == 'undefined' && !$form.length) {
        console.log(_lang.formUndefined);
        return false;
    }

    var _ret = {
        // 错误统计
        errTotal: 0,
        // 错误对象集合
        errArr: []
    };

    var _$input, _vret;

    var _carr = typeof(carr) != 'undefined' && carr.length ? carr : [];

    $.each(config, function(k, v) {
        // console.log(k, v);
        _$input = $form.find('[name="' + k + '"]');

        // 判断该字段是否不需要校验
        if(_carr.length && $.inArray(k, _carr) < 0){
            return true;
        }

        if (_$input.length) {
            // 进行校验
            _$input.each(function(){
                _vret = inputValidate($(this), v);
                if(!_vret.isRight){
                    return false;
                }
            })

            // 判断是否有回调方法
            if (typeof(v.callback) == 'function') {
                v.callback(_$input, _vret);
            } else {
                // 无回调则执行默认的提示信息方法
                renderTips(_vret.input, _vret);
            }

            // 搜集结果
            if (!_vret.isRight) {
                _ret.errTotal++;

                _vret.name = k;

                _ret.errArr.push(_vret);
            }
        }
    });

    // 返回校验结果
    return _ret;
};

module.exports = {
    // 生成提示信息
    renderTips: renderTips,
    // 整个表单校验 - 表单提交前校验
    formValidate: formValidate,
    // 单个输入框校验
    oneValidate: oneValidate,
    init: function($form, config, defaultConfig) {
        if (typeof(config) == 'undefined' || !$form.length) {
            console.log('undefined form OR config');
            return false;
        }

        if (typeof(defaultConfig) == 'undefined') {
            inputDefaults = $.extend({}, inputDefaults, defaultConfig);
        }

        // 通过配置文件设置校验规则
        $.each(config, function(k, v) {
            var _v = $.extend({}, inputDefaults, v);

            // 失去焦点时校验
            if (_v.isBulr && $form.find('['+ _v.keyName +'="' + k + '"]').length) {
                // console.log(k, _v);

                $form.on('blur', '['+ _v.keyName +'="' + k + '"]', function() {
                    var $this = $(this);
                    var _data = $this.data();

                    _v = $.extend({}, _v, _data);

                    setTimeout(function() {
                        // 进行校验
                        oneValidate($this, _v);
                    }, 200);
                });
            }
            // 改变值后效验
            if (_v.isBulr && $form.find('['+ _v.keyName +'="' + k + '"]').length) {
                // console.log(k, _v);

                $form.on('change', '['+ _v.keyName +'="' + k + '"]', function() {
                    var $this = $(this);
                    var _data = $this.data();

                    _v = $.extend({}, _v, _data);

                    setTimeout(function() {
                        // 进行校验
                        oneValidate($this, _v);
                    }, 200);
                });
            }
            
        });
    }
}