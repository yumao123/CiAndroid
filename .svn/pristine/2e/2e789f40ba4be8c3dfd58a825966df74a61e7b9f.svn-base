angular
	.module('buiploy.building')
	.controller('HistoryModalInstanceCtrl', function($scope, $modalInstance, modal_info, BussinessService, $rootScope){
		$scope.modal_info = modal_info;
		BussinessService.clearTitle();

		$scope.down_load_apk = function(download_url){
			var postData = {
				download_url : download_url
			};

			var postUrl = "/api/get_file_info";

			BussinessService.list(postData, postUrl).success(function(response){
				down_load(response.download_url)
			});
		}

		$scope.stop_package = function(){
			var postData = {
			};
			var postUrl = "/api/stop_package";
			BussinessService.list(postData, postUrl).success(function(response){

			});
			$modalInstance.close();
		};

		/*
			查看打包日志
		*/
		$scope.show_log = function(enterprise_number, operation_time){
			$rootScope.sideTemp = '/api/template/div_build_log';
			/*清空表单*/
			$rootScope.enterprise_number = enterprise_number;
			$rootScope.operation_time = operation_time;
			/*向上级通告,打开了sidenav*/
			$scope.$emit('Sidenav', 'nav_open');
			BussinessService.sideOpen();		
		}

		/*
			上传安装包
		*/
		$scope.upload_package = function(package_name, download_url, enterprise_number){
			var postData = {
				package_name : package_name,
				download_url : download_url,
				enterprise_number: enterprise_number,
			};

			var postUrl = "/api/upload_package";

			BussinessService.list(postData, postUrl).success(function(response){

			});			
		}

		/*
			下载apk
		*/
		var down_load = function(dest_url){
			var downloadEle = $("<a id='_download'></a>");
			$("body").append(downloadEle);
			downloadEle.attr('href', dest_url);
			document.getElementById("_download").click();
			$("#_download").remove();
		};

		var GetTableColumns = function(){
			var postData = {
				item_name : "buildHistoryModule"
			};

			var postUrl = "/api/get_tableTitle";

			BussinessService.list(postData, postUrl).success(function(response){
				$scope.tableInfos = response.columns

				$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetTableRows);
			});
		};

		var GetTableRows = function(){
			var postData = {
				item_name : "buildHistoryModule",
				pageIndex: $scope.paginationConf.currentPage,
				pageSize: $scope.paginationConf.itemsPerPage
			};

			var postUrl = "/api/get_history_tableInfo";

			BussinessService.list(postData, postUrl).success(function (response) {
				$scope.paginationConf.totalItems = response.count;
				$scope.history_list = response.history_list;
			});
		}

		$scope.ok = function(){
			$modalInstance.close();
		};
		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		};

		$scope.paginationConf = {
			currentPage: 1,
			itemsPerPage: 10
		};


		GetTableColumns();
	})