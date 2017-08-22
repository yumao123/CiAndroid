angular
	.module("buiploy.common")
	.controller("CiController", CiController);

CiController.$inject = ["$scope", "$interval", "BussinessService", "$rootScope"];

function CiController($scope, $interval, BussinessService, $rootScope){
	$scope.progress = {percent: 0};

	/*
		打开侧边修改html模块
	*/
	$scope.modify_html = function(){
		$rootScope.sideTemp = '/api/template/div_modify_html'
		/*清空表单*/
		$scope.sideData = {};
		BussinessService.sideOpen();
	}

	/*
		新增企业
		1.新增成功后刷新页面
		2.新增失败弹框提示错误信息
	*/
	$scope.add_enterprise = function(){
		$rootScope.sideTemp = '/api/template/div_add_ent'
		/*清空表单*/
		$scope.$broadcast('CiController', 'side_data_clear');
		BussinessService.sideOpen();
	}

	$scope.close_sidenav = function(){
		BussinessService.sideClose();
	};


	/*绑定sidenav的刷新请求*/
	$scope.$on('Sidenav', function(event, msg){
		if (msg == 'flash_data'){
			/* 刷新数据 */
			$scope.$broadcast('CiController', msg);
		}else if (msg == 'nav_open'){
			/* 通知下级nav已经展开 */
			$scope.$broadcast('CiController', msg);
		}
	})

	$scope.$watch(function() {
		return $rootScope.progress;
	}, function() {
		$scope.progress.percent = $rootScope.progress;
		if ($scope.progress.percent == 100){
			//进度条消失
			$('#taskProgress').fadeOut(1000);
		}else if ($scope.progress.percent == 0){
			$('#taskProgress').fadeOut();
		}else{
			$('#taskProgress').fadeIn(1000);
		}
	}, true);

}
