angular
	.module("buiploy.common")
	.controller("MapController", MapController);

MapController.$inject = ["$scope", "$interval", "BussinessService", "$rootScope"];

function MapController($scope, $interval, BussinessService, $rootScope){
	var map = new BMap.Map("map");          // 创建地图实例  
	var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
	map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别

	map.addControl(new BMap.NavigationControl());    
	map.addControl(new BMap.ScaleControl());    
	map.addControl(new BMap.OverviewMapControl());    
	map.addControl(new BMap.MapTypeControl());
}