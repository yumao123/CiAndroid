angular
	.module("buiploy.system")
	.controller("SystemController", SystemController);

SystemController.$inject = ["$scope", "BusinessService"]

function SystemController($scope, BusinessService){

	var GetTableTitle = function(){
		var postData = {
			tableTitle : "systemModule"
		};

		BusinessService.list(postData).success(function(response){
			$scope.tableInfos = response.items 
		});
	};

	GetTableTitle();

}

angular
	.module("buiploy.system")
	.factory('BusinessService', ['$http', function($http){
		var list = function(postData){
			return $http.post("/api/getSystemTable", postData);
		}

		return {
			list: function(postData){
				return list(postData);
			}
		}

	}])