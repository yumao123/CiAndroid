angular
	.module("buiployApp")
	.config(config)
	.config(['$httpProvider', function($httpProvider){
		$httpProvider.interceptors.push('httpInterceptor');
	}]);


function config($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/ci/manage'
		})
		.when('/module_setting', {
			templateUrl: '/ci/module_setting'
		})
		.when('/map', {
			templateUrl: '/ci/map'
		})
		.when('/building', {
			templateUrl: '/ci/building'
		})
		.when('/build_config_setting', {
			templateUrl: '/ci/build_config_setting'
		})
		.when('/local_repositories', {
			templateUrl: '/ci/local_repositories'
		})
}

angular
	.module("buiployApp")
	.run(['$rootScope', '$interval', '$location', 'BussinessService', function($rootScope, $interval, $location, BussinessService){
		// cancel the interval
		$rootScope.timer = [];
		$rootScope.sideTemp = null;
		$rootScope.$on('$routeChangeSuccess', function(evt, current, previous){

			/*关闭获取get_progree*/
			for (var i= 0; i< $rootScope.timer.length; i++)
				$interval.cancel($rootScope.timer[i]);

			/*关闭侧边栏*/
			BussinessService.sideClose();
			$rootScope.currentTmp = null;

		});

	}])