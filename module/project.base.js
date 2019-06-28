var Autocompleter = require('module/md.jq.autocomplete');
var windowAlert = require('module/windowalert');
var page = require('module/page');

var startOrEndTime ={},memberArr =[],notifyArr =[];
        // 分页初始化
        page.init({
          container: $('.js-pages-list'),
          pageCount: pageParam.pageCount,
          pageSize: pageParam.pageSize,
          pageNo: pageParam.pageNo
      });
  Autocompleter.init($);
    function AutoCompleteChange(url, $input,width,num) {
      if ($input.hasClass('ac_input')) {
        return false;
    }
    var _theadHtml = "";
    _theadHtml += "<div class='col-thead'>";
        if(num){
          _theadHtml += "<span class='col-5' style='width: 100%;text-align:center;'>名称</span>";
        }else{
          _theadHtml += "<span class='col-5' style='width: 25%;text-align:center;'>姓名</span>";
          _theadHtml += "<span class='col-5' style='width: 25%;text-align:center;'>英文名</span>";
          _theadHtml += "<span class='col-5' style='width: 50%;text-align:center;'>邮箱</span>";
        }
    _theadHtml += "</div>";
    $input.autocomplete(url, {
        // $input.autocomplete(_demoData, {
        /**加自定义表头**/
        tableHead: _theadHtml,
        minChars: 0,
        width: width,
        multiple: false,
        mustMatch: false,
        matchContains: false,
        matchSubset: false,
        autoFill: false,
        // 缓存长度
        cacheLength: 0,
        dataType: 'json',
        parse: function(ret) {
        
          var rows = [];
          if(ret.data.page){
            ret.data =ret.data.page
          }
           if (typeof(ret.data) == 'string') {
              ret.data = JSON.parse(ret.data);
          }         
            for (var i = 0; i < ret.data.length; i++) {
                rows[i] = {
                    data: ret.data[i], //下拉框显示数据格式   
                    value: ret.data[i].name, //选定后实际数据格式  
                    result: ret.data[i].name + '', //选定后输入框显示数据格式 
                    another: ret.data[i].name
                };
            }
            return rows;
        },
        formatItem: function(row, i, max) {
            var _trHtml = "";
            if(num){
              _trHtml += "<span class='col-5' style='width: 100%;text-align:center;'>" + (row.name || '') + "</span>";
            }else{
              _trHtml += "<span class='col-5' style='width: 25%;text-align:center;'>" + (row.name || '') + "</span>";
              _trHtml += "<span class='col-5' style='width: 25%;text-align:center;'>" + (row.enName || '') + "</span>";
              _trHtml += "<span class='col-5' style='width: 50%;text-align:center;'>" + (row.email || '') + "</span>";
            }
            return _trHtml;
        },
        formatMatch: function(row, i, max) {
            return row.name;
        },
        formatResult: function(row) {
            return row.name;
        }
    }).result(function(e, data, value, sec) {
        /** 加选中后的回调函数 **/
        if(num){
          $(this).siblings('.employeeNo').val(data.id);
        
        }else{
          $(this).siblings('.employeeNo').val(data.employeeNo);
          var change = $(this).siblings('.employeeNo').attr('data-change')
          if(change){
           inputPropertychange()
          }
        }
        $(this).val(data.name);//projectName
    }).bind("unmatch", function() {
      $(this).siblings('.employeeNo').val('');
        $(this).val('');
    });
    
  }
  //开始和结束时间
  startOrEndTime =function(startDate,endDate){//传一个id

    startDate.datetimepicker({
      minView: 2,
      format: 'yyyy-mm-dd',
      autoclose: true
  }).on('changeDate', function () {
      var starTime = startDate.val();
      var endTime = endDate.val();
      if (starTime && endTime) {
        if (Date.parse(starTime) > Date.parse(endTime)) {
          startDate.val('');    
            alertView('结束时间不早于开始时间', '#f2dede', '#a94442');
            return false;
        }
    }
    endDate.datetimepicker('setStartDate', starTime);
    startDate.datetimepicker('hide');
  });
  endDate.datetimepicker({
    minView: 2,
    format: 'yyyy-mm-dd',
    autoclose: true
  }).on('changeDate', function () {
    var starTime = startDate.val();
    var endTime = endDate.val();
    if (starTime && endTime) {
        if (Date.parse(starTime) > Date.parse(endTime)) {
          endDate.val('');
           alertView('结束时间不早于开始时间', '#f2dede', '#a94442');
            return false;
        }
    }
    startDate.datetimepicker('setEndDate', endTime);
    endDate.datetimepicker('hide');
  });

  }
  function inputPropertychange (){
  var $length =$('#projectAdd .form-add-check').children().length;
  var leaderName= $('#leaderName').val()
  var leaderEmployeeNo= $('#leaderEmployeeNo').val()
  var list =  $('#NotifyPeopleAdd').children();
  if(leaderEmployeeNo==globalParame._userNo) return false;
  if(notifyArr.indexOf(leaderEmployeeNo) !='-1'){
    return false;
  }
  notifyArr.push(leaderEmployeeNo)
  $('#projectAdd #NotifyPeopleAdd').append('<label><input style="vertical-align:sub;" class="js-inof" checked type="checkbox" name="notifyList['+$length+'].employeeNo" value="'+leaderEmployeeNo+'" />'+leaderName+'</label>')
}

     //获取当前时间或时间转换
     function getTime(data,YTD) {//传YTD 格式为年月日 不传为年月日时分秒
      if (data) {
          var t = new Date(data)
      } else {
          var t = new Date()
      }
      var y = t.getFullYear();
      var m = t.getMonth() + 1;
      var d = t.getDate();
      var h = t.getHours();
      var mi = t.getMinutes();
      var s = t.getSeconds();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : h;
      mi = mi < 10 ? "0" + mi : mi;
      s = s < 10 ? "0" + s : s;
      if(YTD){
        return y + "-" + m + "-" + d ;
      }else{
        return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
      }
      
  }

  function Popout(){
  // 切换显示隐藏
  $("#Overview").on('click','.js-btn-toggle',function(){
    $(".filtrate").toggle();
    $(".filtrate-none").toggle();
    
  });
   
     // 取消隐藏
     $('.project-form').on('click','.btn-close',function(){
       var _form = $(this).parents('.project-form')
       _form.hide()
       $('.popout').hide()
       if(!_form.attr('tag')){
        _form[0].reset();
       }  
      _form.find('.form-add-check').html('')
      memberArr =[]
      notifyArr =[]
   })
  

  }

  function alertView(msg, bcolor, fcolor) {
    windowAlert.popup({
        content: msg,
        alertWidth: 400,
        alertHeight: undefined,
        backgroundColor: bcolor,
        color: fcolor,
        time: 1000,
        rate: 500
    });
}


 function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return decodeURI(r[2]); 
    return null; 
}   
function GetUrlData() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
  var str = url.substr(1);
  var strs = str.split("&");
  for(var i = 0; i < strs.length; i ++) {
  theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
  }
  }
  return theRequest;
  }

module.exports = {
  AutoCompleteChange: AutoCompleteChange,
  getTime:getTime,
  startOrEndTime:startOrEndTime,
  Popout:Popout,
  getQueryString:getQueryString,
  alertView:alertView,
  GetUrlData:GetUrlData
  // pages:pages
};