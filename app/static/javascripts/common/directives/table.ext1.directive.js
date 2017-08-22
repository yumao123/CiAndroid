/*
	自带删除功能的...
*/
angular
	.module('buiploy.common')
	.directive('buiployTableExt1',[function(){
		return {
		restrict: 'EA',
		template: 
				'<table id="{{conf.id}}" class="{{conf.class}}">'+
				'<thead>'+
				'<tr>'+
				'<th ng-repeat="colum in conf.colums track by $index">{{colum.label}}</th>'+
				'<th>工具栏</th>'+
				'</tr>'+
				'</thead>'+
				'<tbody>'+
				'<tr ng-repeat="(row_key, row) in conf.rows" ng-class="{success: row.issuccess == 1, danger: row.issuccess == -1}">'+
				'<td ng-repeat="cell in row.cells track by $index"><a href="" ng-show="conf.colums[$index].hasLink" ng-click="conf.clickFunc(row_key)"><b>{{cell}}</b></a><p ng-show="!conf.colums[$index].hasLink">{{cell}}</p></td>'+
				'<td><a href="" ng-click="del($index)" title="删除"><span class="fa fa-minus"></span></a></td>'+
				'</tr>'+
				'</tbody>'+
				'</table>',
		replace: true,
		scope: {
			conf: '='
		},
		link: function(scope, element, attrs){
			// get lable
			scope.conf.getColumns()
		},
	}

	}]);

