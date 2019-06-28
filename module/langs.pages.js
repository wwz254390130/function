// 页码相关语言包
// 中文0 英文1
var _langType = typeof(globalParame.localeType) != 'undefined' ? globalParame.localeType : '0';

var _zh = {
	page: '页',
	jump: '确定',
	total: function(count, num){
		return '共'+ count +'条，'+ num +'页，到第';
	}
};

var _en = {
	page: 'page',
	jump: 'Jump',
	total: function(count, num){
		return 'Total '+ count +' Records，'+ num +' Page, To';
	}
};

var _langs = _langType == '0' ? _zh : _en;

module.exports = _langs;