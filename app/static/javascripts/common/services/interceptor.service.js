angular.module('buiploy.common')
	.factory('httpInterceptor', ['$log',"$q", function($log, $q){
		$log.debug('[CiLog]httpInterceptor is ready!');

		return {
			request: function(config){
				/* 请求时加入loading样式 */
				return config || $q.when(config)
			},

			response: function(response){
				/* 返回后隐藏loading样式 */
				return response || $q.when(reponse);
			},

			

		}

	}]);