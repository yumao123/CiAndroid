angular
	.module('buiploy.common')
	.filter('status_convert', function(){
		/*
			usage: {{stauts | status_convert}}
			过滤器,用于修改状态值的展示
		*/
		var status_convert_func = function(src_status){
			var dest_status = src_status == 1 ? '成功' : (src_status == -1 ? '失败' : (src_status == 0 ? '打包中' : (src_status == -2 ? '已中断' : '打包中')))
			return dest_status
		};
		return status_convert_func;
	});