/*
	打包页面控制器
*/
angular
	.module("buiploy.building")
	.controller("BuildController", BuildController);

BuildController.$inject = ["$scope", "$rootScope", "$interval", "BussinessService", "$modal"]

function BuildController($scope, $rootScope, $interval, BussinessService, $modal){

	var unfinishedCount = 0;

	$scope.process = {
		task_name: null,
		task_count: 0,
	}

	$scope.formAddInfo = {}

	/*
		页码初始化
	*/
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 10
	};

	$scope.searchData = {
		keyword: "",
	}


	/*
		获取企业详情
		包含：企业基本信息，网关信息，开关信息
		1.提交打包
		2.取消返回列表页面
	*/
	var showDetail = function($index){
		/* 区分ios还是android */
			var modalInstance = $modal.open({
				templateUrl : "/api/template/modal_enterprise",
				controller: "ModalInstanceCtrl",
				size: 'lg',
				backdrop: 'static',
				resolve: {
					modal_info: function(){
						return {
							// is_android: is_android,
							modal_name: '企业设置',
							enterprise_number: $scope.enterprise_list[$index].enterprise_number,
							enterprise_name: $scope.enterprise_list[$index].enterprise_name,
							GetTableRows: GetTableRows,
						};
					},
					config_info: function(){
						return $scope.configInfo
					},
				},
			});
	};

	/*
		获取打包历史
		1.包括下载
		2.查看打包结果
		3.查看打包的控制台输出(实时/历史)
	*/
	$scope.showHistory = function(modal_name, modal_id, params){
		var modalInstance = $modal.open({
			templateUrl : "/api/template/modal_history",
			controller: "HistoryModalInstanceCtrl",
			size: 'lg',
			resolve: {
				modal_info: function(){
					return {
						modal_name: modal_name,
						modal_id: modal_id
					};
				},
			}
		})
	};

	$scope.SearchEnterpise = function(){
		GetTableRows();
	}

	/*
		初始化表格label
	*/
	var GetTableColumns = function(){
		var postData = {
			item_name : "buildAndroidModule"
		};

		var postUrl = "/api/get_tableTitle";

		BussinessService.list(postData, postUrl).success(function(response){
			$scope.tableConf.colums = response.columns

			/*
				监听页码变动，获取表格数据
			*/
			$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetTableRows);
		});
	};

	/*
		获取表格数据
	*/
	var GetTableRows = function(){
		var postData = {
			item_name : "buildAndroidModule",
			pageIndex: $scope.paginationConf.currentPage,
			pageSize: $scope.paginationConf.itemsPerPage,
			keyword: $scope.searchData.keyword,
		};

		var postUrl = "/api/get_tableInfo";

		BussinessService.list(postData, postUrl).success(function (response) {
			$scope.paginationConf.totalItems = response.count;
			$scope.enterprise_list = response.data_list;

			//package rows -> cells
			$scope.tableConf.rows = []
			for (var i= 0; i < $scope.enterprise_list.length; i++){
				$scope.tableConf.rows.push({cells: []});
				for (var x=0; x < $scope.tableConf.colums.length; x++){
					var key = $scope.tableConf.colums[x].name
					$scope.tableConf.rows[i].cells.push($scope.enterprise_list[i][key])
				}
			}
		});
	}

	/*
		轮询获取打包信息
		1.包含当前打包企业以及打包队列
	*/
	var GetProcess = function(){
		var postData = {
		};

		var postUrl = "/api/get_process";
		BussinessService.list(postData, postUrl).success(function (response) {
			$scope.process.task_name = response.task_name;
			$scope.process.task_count = response.task_count;
			$rootScope.progress = response.progress;
			if (unfinishedCount > response.task_count){
				BussinessService.showTitle();
			}
			unfinishedCount = response.task_count;
		});
	};

	/*
		获取配置开关项，用于初始化配置开关
	*/
	var GetConfigInfo = function(){
		var postData = {
			android_or_ios: 'android'
		};

		var postUrl = "/api/get_config_info";
		BussinessService.list(postData, postUrl).success(function (response) {
			$scope.configInfo = response.configInfo;
		});		
	}

	/*
		初始化表格
	*/
	$scope.tableConf = {
		id: "android_table",
		class: "table table-bordered table-hover",
		getColumns: GetTableColumns,
		clickFunc: showDetail,
	}

	GetConfigInfo();

	var timmer = $interval(GetProcess, 1000);
	$rootScope.timer.push(timmer);

	$scope.$on('CiController', function(event, msg) {
		if (msg == 'flash_data'){
			GetTableRows();
		}
	});	

}


/*
	企业详情静态框实例化
*/
angular
	.module("buiploy.building")
	.controller("ModalInstanceCtrl", ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "BussinessService", "modal_info", "config_info"]

/*
	modify:
	2017-05-03:给$scope.formData.build_type设置默认值：release

*/
function ModalInstanceCtrl($scope, $modalInstance, BussinessService, modal_info, config_info){
	$scope.modal_info = modal_info
	$scope.config_info = config_info
	$scope.item_list = []
	$scope.extend_item = undefined;
	$scope.formData = {}
	$scope.os_mode = undefined;
	$scope.code_type = undefined;

	// 默认build_type设置为release
	$scope.formData.build_type = "release";

	var current_gateway = undefined;
	var init_item = [];
	

	$scope.mode_select = function(mode){
		$scope.os_mode = mode;
		GetEnterpriseInfo();
	};

	/*
		识别代码更新地址
	*/
	$scope.check_code_fork = function(){
		var reg = new RegExp(".*git$");
		// 是git
		var result = reg.test($scope.formData.code_url);
		if (result){
			$scope.code_type = "git";
			return 'git';
		}
		// 默认为svn
		else{
			$scope.code_type = "svn";
			return 'svn';
		}
	};

	/*
		选择网关
		包含：微软云、多租户、旧网关、企业正式/测试网关
	*/
	$scope.ChooseGateway = function(gateway_mode){
		/* 发送数据时带上当前网关 */
		$scope.formData.gateway_mode = gateway_mode
		// 先清空数据
		$scope.formData.BESTENTERPRISESERVERS_IP = "";
		$scope.formData.BESTENTERPRISESERVERS_IP_1 = "";
		$scope.formData.SERVER_IP = "";
		$scope.formData.ENTERPRICE_IP = "";
		$scope.formData.SERVER_PORT = "";
		$scope.formData.ENTERPRICE_PORT = "";


		for (var i = 0; i < $scope.ip_info.length ; i++){
			if ($scope.ip_info[i].gateway_mode == gateway_mode){
				//fill data
				for (var gatewayInfo in $scope.ip_info[i].gateway_info){
					$scope.formData[gatewayInfo] = $scope.ip_info[i].gateway_info[gatewayInfo]
				}					
			}
		};
	};

	/*
		获取svn最新版本序列
	*/
	$scope.GetCodeVersion = function(){
		if ($scope.formData.code_url != null){
			var postData = {
				code_url: $scope.formData.code_url
			};

			var postUrl = "/api/get_code_version";
			BussinessService.list(postData, postUrl).success(function (response) {
				$scope.formData.code_version = response.code_version;
			});	
		}
	};

	/*
		删除企业扩展的对应控件
	*/
	$scope.DeleteItem = function(config_index, item_index){
		$scope.item_list[config_index].file_items.splice(item_index,1);
	}

	/*
		获取企业信息
	*/

	var GetEnterpriseInfo = function(){
		var postData = {
			enterprise_number : $scope.modal_info.enterprise_number
		};

		var postUrl = "/api/get_enterprise_info"
		BussinessService.list(postData, postUrl).success(function(response){
			$scope.enterprise_info = response.enterprise_info;
			$scope.ip_info = response.ip_info;

			/*
				填充企业信息
			*/
			for (var enterpriseInfo in $scope.enterprise_info){
				$scope.formData[enterpriseInfo] = $scope.enterprise_info[enterpriseInfo];
			};
			/*
				填充企业IP
			*/
			if ($scope.enterprise_info.hasOwnProperty('gateway_mode')){
				var gateway_mode = $scope.enterprise_info.gateway_mode;
				$scope.ChooseGateway(gateway_mode);
			};
			/*
				根据企业扩展属性初始控件
			*/
			for (var config_index in $scope.config_info){
				var config = {description: $scope.config_info[config_index].description, file_items:[]};
				if ($scope.enterprise_info.extend_property != null){
					for (var item_index in $scope.config_info[config_index].file_items){
						if ($scope.enterprise_info.extend_property.hasOwnProperty($scope.config_info[config_index].file_items[item_index].item_name)){
							config.file_items.push(
								$scope.config_info[config_index].file_items[item_index]
							);
							/* 给file_items中的value赋值 */
							for (index in config.file_items){
								if (config.file_items[index].item_name in $scope.enterprise_info.extend_property){
									/* 将值存在value中 */
									config.file_items[index]['value'] = $scope.enterprise_info.extend_property[config.file_items[index].item_name]
								}
							};

							init_item.push($scope.config_info[config_index].file_items[item_index].item_name)
						}
					}
				};
				$scope.item_list.push(config);
			};
		});
	}

	/*
		新增企业扩展属性
	*/
	$scope.add_items = function($index){
		if ($scope.extend_item == undefined){
			$scope.extend_item = {}
			// $scope.extend_item.file_items = $scope.config_info[$index].file_items;
			$scope.extend_item.file_items = []
			for (var index in $scope.config_info[$index].file_items){
				if ($scope.config_info[$index].file_items[index].isshow == 'true'){
					$scope.extend_item.file_items.push($scope.config_info[$index].file_items[index])
				};
			};
			$scope.extend_item.item_index = $index;
		}
	}

	/*
		确定：新增企业扩展属性
	*/
	$scope.add_extend_item = function(is_add){
		var config_info = $scope.config_info[$scope.extend_item.item_index].file_items
		var item = {}
		if (is_add){
			for (var index in config_info){
				if (config_info[index].item_name == $scope.ext){
					item = config_info[index]
				}
			}
			init_item.push(item.item_name)
			$scope.item_list[$scope.extend_item.item_index].file_items.push(item)
		}
		$scope.extend_item = undefined;
	}

	/*
		提交企业信息->开始打包
	*/
	$scope.ok = function(){
		/* 将开关提交的数据保存到发送队列中 */
		var extend_property = {}
		for (var i = 0;i< init_item.length; i++){
			for (var formParm in $scope.enterpriseForm){
				if (formParm == init_item[i]){
					var newObj = {}
					if ($scope.enterpriseForm[formParm].$modelValue == undefined)
						newObj[formParm]= "";
					else
						newObj[formParm]= $scope.enterpriseForm[formParm].$modelValue;
					extend_property = _.extend(extend_property, newObj);
					$scope.formData = _.extend($scope.formData, newObj);
				};
			};
		};
		/* 本次打包选择：android/ios */
		$scope.formData.os_mode = $scope.os_mode;
		/* 新增打包工具选择git/svn */
		$scope.formData.code_type = $scope.code_type;
		/* 去除extend_property属性 */
		var postData = _.omit($scope.formData, "extend_property");
		/* 重组extend_property */
		postData.extend_property = extend_property;
		/* 帶上enterprise_name,用于显示当前任务名称 */
		postData.enterprise_name = $scope.modal_info.enterprise_name;

		var postUrl = "/api/building";
		BussinessService.list(postData, postUrl).success(function(response){
			$scope.ret = response.ret
		});
		$modalInstance.close();
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

	/*
		删除企业信息
	*/
	$scope.delete = function(){
		/* 确定是否删除 */
		swal({
			title: "删除企业",
			text: "确认是否删除企业?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "删除",
			closeOnConfirm: false }, function(){
				/* 确认删除 */
				var postData = {
					enterprise_number: $scope.modal_info.enterprise_number
				}

				var postUrl = "/api/delete_enterprise"
				BussinessService.list(postData, postUrl)
					.success(function(response){
						swal({
							title: $scope.modal_info.modal_name, text: response.result, type: "success", timer: 1500,
							showConfirmButton: false,
						});
						modal_info.GetTableRows();
					})
					.error(function(response){
						swal({
							title: $scope.modal_info.modal_name, text: response.result, type: "error", timer: 1500,
							showConfirmButton: false,
						});
					})
				$modalInstance.close();	
			});
		
	};

	$scope.mode_select("android");

}


