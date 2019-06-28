// 页码相关语言包
// 中文0 英文1
var _langType = typeof(globalParame.localeType) != 'undefined' ? globalParame.localeType : '0';

var _zh = {
	inputEmpty: '字段不能为空',
	minMaxLengtht: function(min, max){
		return '字段长度为'+ min + '到' + max + '个字符';
	},
	rexError: '字段格式错误',
	inputUndefined: '输入框对象找不到',
	formUndefined: '校验配置或表单对象找不到'
};

var _en = {
	inputEmpty: 'Fields can not be empty',
	minMaxLengtht: function(min, max){
		return 'The length is '+ min + ' to ' + max + ' characters.';
	},
	rexError: 'Field format error',
	inputUndefined: 'input undefined',
	formUndefined: 'form or config undefined'
};

var _langs = _langType == '0' ? _zh : _en;

module.exports = _langs;