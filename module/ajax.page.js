/**
 * @desc page
 * @author fred
 * @date 2018/10/11
 */
function getPageItem(i, pageNo){
    return '<a href="javascript: void(0);" '+ (i == pageNo ? 'class="active">' : 'data-to="'+ i +'">') + i +'</a>';
}

function init(param){
    var html = '',//分页html
        pageCount,  //单元个数
        pageSize,   //每页单元个数
        pageNo,     //当前页码
        pageNum;    //页面个数,内部计算

    pageSize = param.pageSize ? param.pageSize : 10;

    if(!param.pageCount){console.log('page pageCount can not empty');return;}else{pageCount = parseInt(param.pageCount);}
    if(!param.pageNo){console.log('page pageNo can not empty');return;}else{pageNo = parseInt(param.pageNo);}

    var pageNumReal = pageCount/pageSize;
    pageNum = parseInt(pageNumReal);
    
    if(pageNum < pageNumReal){
        pageNum++;
    }

    /*
    <a href="javascript: void(0);" data-to="1" class="prev">&lt;</a>
    <a href="javascript: void(0);" data-to="1" class="active">1</a>
    <a href="javascript: void(0);" data-to="2">2</a>
    <a href="javascript: void(0);" data-to="3">3</a>
    <span>...</span>
    <a href="javascript: void(0);" data-to="10">10</a>
    <a href="javascript: void(0);" data-to="2" class="next">&gt;</a>
    */

    // 上一页
    html = '<a href="javascript: void(0);" class="prev" '+ (pageNo == 1 ? '' : 'data-to="'+ (pageNo - 1) +'"') +'>&lt;</a>';

    if(pageNum <= 9){
        for(var i = 1;i <= pageNum;i++){
            html += getPageItem(i,pageNo);
        }
    }else {
        //1,2,3,4,5,6,7,……
        if(pageNo <= 5){
            for(var i = 1;i <= 7;i++){
                html += getPageItem(i,pageNo);
            }
            html += '<span>···</span>';
        }
        //1,2,……,95,96,97,98,99,100
        else if(pageNum - pageNo <= 3){
            html += getPageItem(1,pageNo);
            html += getPageItem(2,pageNo);
            html += '<span>···</span>';
            for(var i = pageNum - 5;i <= pageNum;i++){
                html += getPageItem(i,pageNo);
            }
        }
        //1,2,……,4,5,6,7,8……
        else {
            html += getPageItem(1,pageNo);
            html += getPageItem(2,pageNo);
            html += '<span>···</span>';
            for(var i = pageNo - 2;i <= pageNo + 2;i++){
                html += getPageItem(i,pageNo);
            }
            html += '<span>···</span>';
        }
    }

    // 下一页
    html += '<a href="javascript: void(0);" class="next" '+ (pageNo < pageNum ? 'data-to="'+ (pageNo + 1) +'"' : '') +'>&gt;</a>';

    return html;
}
module.exports = {
    init: init
};
