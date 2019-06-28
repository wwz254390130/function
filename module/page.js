/**
 * @desc page
 * @author cifer
 * @date 2017/3/10.
 */

var _lang = require('module/langs.pages');

// 生成分页统计部分
function jumpWrapHtml(pageCount, pageNum, pageNo){
    var _html = '';
    _html += '<div class="page-item page-jump-wrap">';
    _html += '<span class="page-word">'+ _lang.total(pageCount, pageNum) +'</span>';
    _html += '<input type="number" class="page-jump js-page-jump" value="' + pageNo + '"><span id="pageWord" class="page-word">'+ _lang.page +'</span>';
    _html += '<button type="button" class="page-jump-btn js-page-jump-btn">'+ _lang.jump +'</button>';
    _html += '</div>';

    return _html;
}

function init(param) {
    var html = '', //分页html
        type,
        $container, //容器
        pageCount, //单元个数
        pageSize, //每页单元个数
        pageNo, //当前页码
        pageNum; //页面个数,内部计算
    pageSize = param.pageSize ? param.pageSize : 10;
    // console.log(pageSize)
    
    if (!param.type) { param.type = 'refresh'; } //还有就是ajax
    if (!param.container) { console.log('page container can not empty'); return; } else { $container = param.container; }
    if (!param.pageCount) { console.log('page pageCount can not empty'); return; } else { pageCount = parseInt(param.pageCount); }
    if (!param.pageNo) { console.log('page pageNo can not empty'); return; } else { pageNo = parseInt(param.pageNo); }
    if (!param.callbackEvent) { param.callbackEvent = function() {} }
    var pageNumReal = pageCount / pageSize;
    pageNum = parseInt(pageNumReal);
    if (pageNum < pageNumReal) {
        pageNum++;
    }
    //第一页
    if (pageNo == 1) {
        html = '<span class="page-item page-prev page-disabled">&lt;</span>';
    } else {
        html = '<a class="page-item page-prev" data-page-no="' + (pageNo - 1) + '">&lt;</a>';
    }
    if (pageNum <= 9) {
        for (var i = 1; i <= pageNum; i++) {
            html = html + getPageItem(i, pageNo);
        }
    } else {
        //1,2,3,4,5,6,7,……
        if (pageNo <= 5) {
            for (var i = 1; i <= 7; i++) {
                html = html + getPageItem(i, pageNo);
            }
            html = html + '<span class="page-item page-item-omit">···</span>';
        }
        //1,2,……,95,96,97,98,99,100
        else if (pageNum - pageNo <= 3) {
            html = html + getPageItem(1, pageNo);
            html = html + getPageItem(2, pageNo);
            html = html + '<span class="page-item page-item-omit">···</span>';
            for (var i = pageNum - 5; i <= pageNum; i++) {
                html = html + getPageItem(i, pageNo);
            }
        }
        //1,2,……,4,5,6,7,8……
        else {
            html = html + getPageItem(1, pageNo);
            html = html + getPageItem(2, pageNo);
            html = html + '<span class="page-item page-item-omit">···</span>';
            for (var i = pageNo - 2; i <= pageNo + 2; i++) {
                html = html + getPageItem(i, pageNo);
            }
            html = html + '<span class="page-item page-item-omit">···</span>';
        }
    }

    function getPageItem(i, pageNo) {
        var strHtml = '';
        if (i == pageNo) {
            strHtml = '<span class="page-item page-item-active">' + i + '</span>';
        } else {
            strHtml = '<a class="page-item" href="javascript:void(0)" data-page-no="' + i + '">' + i + '</a>';
        }
        return strHtml;
    }

    // 最后一页
    if (pageNo == pageNum) {
        html = html + '<span class="page-item page-next page-disabled">&gt;</span>';
    } else {
        html = html + '<a class="page-item page-next" data-page-no="' + (pageNo + 1) + '">&gt;</a>';
    }
    //增加页面跳转
    // var jumpWrap = '<div class="page-item page-jump-wrap">' +
    //     '<span class="page-word">共' + pageCount + '条，' + pageNum + '页，到第</span><input type="number" class="page-jump js-page-jump" value="' + pageNo + '"><span id="pageWord" class="page-word">页</span>' +
    //     '<button type="button" class="page-jump-btn js-page-jump-btn">确定</button>' +
    //     '</div>';
    html += jumpWrapHtml(pageCount, pageNum, pageNo);

    $container.html(html);
    $container.undelegate().delegate('.page-item', 'click', function() {
        var jumpNo = $(this).data('page-no');
        if (jumpNo) {
            if (param.type == 'refresh') {
                //跳到新页面
                turnToNewPage(jumpNo);
            } else if (param.type == 'ajax') {
                ajaxData(jumpNo);
            }
        }
    }).delegate('.js-page-jump-btn', 'click', function() {
        var jumpNo = parseInt($(this).siblings('.js-page-jump').val());
        if (!isNaN(jumpNo)) {
            if (jumpNo >= 1 && jumpNo <= pageNum) {
                if (param.type == 'refresh') {
                    //跳到新页面
                    turnToNewPage(jumpNo);
                } else if (param.type == 'ajax') {
                    ajaxData(jumpNo);
                }
            } else {
                console.log('beyond the limit');
            }
        } else {
            console.log('pageNo no a number');
        }
    });
    $('.js-page-jump').off('keypress').on('keypress', function() {
        var keyCode = event.keyCode;
        var flag = false;
        if (keyCode >= 48 && keyCode <= 57) {
            flag = true;
        }
        return flag;
    });

    function ajaxData(jumpNo) {
        var t = new Date().getTime();
        var formData = {
            pageSize: param.pageSize,
            pageNo: jumpNo,
            t: t
        };
        if (param.formData) {
            for (var k in param.formData) {
                formData[k] = param.formData[k];
            }
        }
        $.ajax({
            url: param.url,
            type: 'POST',
            data: formData,
            dataType: 'html',
            error: function() {
                console.log(param.url + ' error');
            },
            success: function(response) {
                param.callbackEvent(response);
                var newParam = {
                    container: param.container,
                    pageCount: param.pageCount,
                    pageSize: param.pageSize,
                    pageNo: jumpNo,
                    type: param.type,
                    url: param.url,
                    formData: param.formData,
                    callbackEvent: param.callbackEvent
                };
                //列表分页
                init(newParam);
            }
        });
    }

    function turnToNewPage(jumpNo) {
        var $desc = $('#desc').val();
        var $orderBy = $('#orderBy').val();
        if ($desc && $orderBy) {
            var _url = changeURLArg(location.href, 'pageNo', jumpNo),
                _url1 = changeURLArg(_url, 'desc', $desc);
            location.href = changeURLArg(_url1, 'orderBy', $orderBy);
        } else {
            location.href = changeURLArg(location.href, 'pageNo', jumpNo);
        }

    }
    //分页url处理
    function changeURLArg(url, arg, arg_val) {
        var pattern = arg + '=([^&]*)';
        var replaceText = arg + '=' + arg_val;
        if (url.match(pattern)) {
            var tmp = '/(' + arg + '=)([^&]*)/gi';
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match('[\?]')) {
                return url + '&' + replaceText;
            } else {
                return url + '?' + replaceText;
            }
        }
        return url + '\n' + arg + '\n' + arg_val;
    };
}

module.exports = {
    init: init
};