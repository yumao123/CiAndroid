angular
	.module("buiploy.common")
	.controller("SidenavController", SidenavController);

SidenavController.$inject = ["$scope", "$interval", "BussinessService", "$rootScope"];

function SidenavController($scope, $interval, BussinessService, $rootScope){
	
	/*
		新增企业
	*/
	$scope.add_ent = function(){
		var postData = {
			enterprise_number: $scope.sideData.enterprise_number,
			enterprise_name: $scope.sideData.enterprise_name,
			manager: $scope.sideData.manager, 
		}

		var postUrl = "/api/add_enterprise";

		BussinessService.list(postData, postUrl).success(function(response){
			swal({
				title: '新增企业', text: response.result, type: "success", timer: 1500,
				showConfirmButton: false,
			});
			BussinessService.sideToggle();
			$scope.$emit('Sidenav', 'flash_data');
		})
		.error(function(response){
			swal({
				title: '新增企业', text: response.result, type: "error", timer: 1500,
				showConfirmButton: false,
			});
			$modalInstance.close();
		})

	};

	/*
		获取HTML
	*/
	$scope.GetHtml = function(){
		var postData = {
			updateUrl: $scope.sideData.updateUrl
		};

		var postUrl = "/api/get_html";
		BussinessService.list(postData, postUrl).success(function (response) {
			$scope.sideData.htmlInfo = BussinessService.HTMLFormat(response.html);
		});			
	};

	/*
		修改html
	*/
	$scope.modify = function(){
		var postData = {
			htmlInfo: $scope.sideData.htmlInfo,
			updateUrl: $scope.sideData.updateUrl,
		};

		var postUrl = "/api/modify_html";
		BussinessService.list(postData, postUrl).success(function(response){
			swal({
				title: '修改上传信息', text: response.result, type: "success", timer: 1500,
				showConfirmButton: false,
			});
			//关闭侧边栏
			BussinessService.sideToggle();
		})
		.error(function(response){
			swal({
				title: '修改上传信息', text: response.result, type: "error", timer: 1500,
				showConfirmButton: false,
			});
		})
	};

	$scope.$on('CiController', function(event, msg){
		if (msg == 'side_data_clear'){
			$scope.sideData = {};
		}
	})

}


angular
	.module("buiploy.common")
	.controller("ShowLogController", ShowLogController);

ShowLogController.$inject = ["$scope", "$interval", "BussinessService", "$rootScope"];

function ShowLogController($scope, $interval, BussinessService, $rootScope){

	$scope.sideData = {};
	var getLogTimer = undefined;

	var GetLog = function(){
		var postData = {
			enterprise_number: $rootScope.enterprise_number,
			operation_time: $rootScope.operation_time,
		};

		var postUrl = "/api/get_log";
		BussinessService.list(postData, postUrl).success(function(response){
			$scope.sideData.log_info = response.log_info
		})
	};

	$scope.$watch(function() {
		return $rootScope.navsideOpen;
	}, function() {
		if ($rootScope.navsideOpen){
			$scope.sideData = {};
			getLogTimer = $interval(GetLog, 1000);
		}else{
			$interval.cancel(getLogTimer);
		}
	}, true);

}