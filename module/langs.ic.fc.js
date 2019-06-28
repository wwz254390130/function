// 页码相关语言包
// 中文0 英文1
var _langType = typeof(globalParame.localeType) != 'undefined' ? globalParame.localeType : '0';

var _zh = {
	formResult: '请正确填写表单内容！',
	sending: '提交中...',
	deling: '删除中...',
	loading: '加载中...',
	ajaxError: '网络出现错误，请稍后重试！',
	submitBtnTxt: '保存并继续完善信息',
	submitBtnTxt2: '提交',
	saveBtnTxt: '保存',
	confirmBtnTxt: '确定',
	delBtnTxt: '删除',
	delConfirm: '是否确认删除，删除后将无法恢复！',
	remarkValidator: '备注不能为空',
	fileValidator: '请选择需要上传的文件！',
	documentNameValidator: '请选择文件名称或手动输入！',
	needRemindValidator: '请填写提醒时间及提醒邮箱！',
	reminderEmailValidator: '请填写正确的邮箱地址！',
	fileSelectBtnTxt: '+ 选择文件',
	fileTypeValidator: '只允许上传PDF或图片格式的文件！',
	subsidiaryValidator: '数据为空！',
	validityTermValidator: '文件有效期限结束时间必须大于开始时间！',
	logsTimeValidator: '变更历史结束时间必须大于开始时间！',
	saveAsImage: '保存为图片'
};

var _en = {
	formResult: 'The form is not filled out.',
	sending: 'Sending...',	
	deling: 'deling...',
	loading: 'loading...',
	ajaxError: 'Network Error. Please try again later！',
	submitBtnTxt: 'Submit and Perfect',
	submitBtnTxt2: 'Submit',
	saveBtnTxt: 'Save',
	confirmBtnTxt: 'Confirm',
	delBtnTxt: 'Del',
	delConfirm: 'Whether confirmation is deleted or deleted will not be resumed！',
	remarkValidator: 'remark is required.',
	fileValidator: 'file is required,Please Select.',
	documentNameValidator: 'documentName is required.',
	needRemindValidator: 'reminderTime and reminderEmail is required.',
	reminderEmailValidator: 'reminderEmail format Error.',
	fileSelectBtnTxt: 'Select File',
	fileTypeValidator: 'Only uploading PDF and pictures is allowed.',
	subsidiaryValidator: 'Data is Null.',
	validityTermValidator: 'The expiration date of the document must be greater than the start time.',
	logsTimeValidator: 'The end of change history must be longer than the start time!',
	saveAsImage: 'saveAsImage'
};

var _langs = _langType == '0' ? _zh : _en;

module.exports = _langs;