// 页码相关语言包
// 中文0 英文1
var _langType = typeof(globalParame.localeType) != 'undefined' ? globalParame.localeType : '0';

var _zh = {
	nameValidator: '姓名中文或英文至少填写一个！',
	formResult: '请正确填写表单内容！',
	sending: '提交中...',
	ajaxError: '网络出现错误，请稍后重试！',
	submitBtnTxt: '提交'
};

var _en = {
	nameValidator: 'At least one Chinese or English UserName is required.',
	formResult: 'The form is not filled out.',
	sending: 'Sending...',
	ajaxError: 'Network Error. Please try again later！',
	submitBtnTxt: 'Submit'
};

var _langs = _langType == '0' ? _zh : _en;

module.exports = _langs;