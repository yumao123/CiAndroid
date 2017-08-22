angular
	.module('buiploy.common')
	.directive('buiployTable',[function(){
		return {
		restrict: 'EA',
		template: 
				'<table id="{{conf.id}}" class="{{conf.class}}">'+
				'<thead>'+
				'<tr>'+
				// '<th ng-show="conf.checked"></th>'+
				'<th ng-repeat="colum in conf.colums track by $index">{{colum.label}}</th>'+
				'</tr>'+
				'</thead>'+
				'<tbody>'+
				'<tr ng-repeat="(row_key, row) in conf.rows">'+
				// '<td type="checkbox" ng-class="{active:conf.checked}"><input type="checkbox"/></td>'+
				'<td ng-repeat="cell in row.cells track by $index"><a href="" ng-show="conf.colums[$index].hasLink" ng-click="conf.clickFunc(row_key)"><b>{{cell}}</b></a><p ng-show="!conf.colums[$index].hasLink">{{cell}}</p></td>'+
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

