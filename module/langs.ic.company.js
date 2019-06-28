// 页码相关语言包
// 中文0 英文1
var _langType = typeof(globalParame.localeType) != 'undefined' ? globalParame.localeType : '0';

var _zh = {
	companyNameValidator: '公司名称中文或英文至少填写一个！',
	registeredAddressValidator: '注册地址中文或英文至少填写一个！',
	listedCompanyValidator: '上市公司，交易所和股票代码必填！',
	businessTypeValidator: '经营类型选择“主营业务活跃型”，一般经营项目为必填！',
	shareRatioValidator: '股占比总计不能超过100%！',
	shareRatioValidator2: '股占比只允许填写数字！',
	shareNumValidator: '登记股票数只允许填写数字！',
	shareholderTypeValidator: '类型、名称及股占比不能为空！',
	officerTypeValidator: '类型及名称不能为空！',
	businessTimeValidator: '营业期限结束时间必须大于开始时间！',
	formResult: '请正确填写表单内容！',
	sending: '提交中...',
	getting: '获取中...',
	ajaxError: '网络出现错误，请稍后重试！',
	submitBtnTxt: '保存并继续完善信息',
	submitBtnTxt2: '提交',
	saveBtnTxt: '保存',
	confirmBtnTxt: '确定',
	editBtnTxt: '编辑',
	delConfirm: '是否确认删除，删除后将无法恢复！'
};

var _en = {
	companyNameValidator: 'At least one Chinese or English Company name is required.',	
	registeredAddressValidator: 'At least one Chinese or English registered address is required.',
	listedCompanyValidator: 'Listed company, Exchange and Stock code is required.',
	businessTypeValidator: 'Business type is Active, Description of business nature is required.',
	shareRatioValidator: 'Shareholding can not exceed 100% of the total.',
	shareRatioValidator2: 'shareRatio is only allowed to fill in numbers！',
	shareNumValidator: 'shareNum is only allowed to fill in numbers！',
	shareholderTypeValidator: 'Shareholder type,name and ratio is required.',
	officerTypeValidator: 'officerType and name is required.',
	businessTimeValidator: 'The End time of the business period must be greater than the Start time！',
	formResult: 'The form is not filled out.',
	sending: 'Sending...',	
	getting: 'Getting...',
	ajaxError: 'Network Error. Please try again later！',
	submitBtnTxt: 'Submit and Perfect',
	submitBtnTxt2: 'Submit',
	saveBtnTxt: 'Save',
	confirmBtnTxt: 'Confirm',
	editBtnTxt: 'Edit',
	delConfirm: 'Whether confirmation is deleted or deleted will not be resumed！'
};

var _langs = _langType == '0' ? _zh : _en;

module.exports = _langs;