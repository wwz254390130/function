Date.prototype.format = function(fmt) { 
	var o = { 
		"m+" : this.getMonth() + 1,                 //月份 
		"d+" : this.getDate(),                    //日 
		"H+" : this.getHours(),                   //小时 
		"M+" : this.getMinutes(),                 //分 
		"S+" : this.getSeconds(),                 //秒 
		"q+" : Math.floor((this.getMonth()+3)/3) //季度
		//"s"  : this.getMilliseconds()             //毫秒
	};

	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	}

    if(/(s+)/.test(fmt)) {
        var mill = this.getMilliseconds();
        if(mill < 10){
            mill = '00' + mill;
        }
        else if(mill < 100){
            mill = '0' + mill;
        }
        fmt = fmt.replace(RegExp.$1, mill.substr(0,RegExp.$1.length));
    }


	for(var k in o) {
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}

	return fmt; 
}