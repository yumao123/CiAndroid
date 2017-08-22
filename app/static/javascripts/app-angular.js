///<jscompress sourcefile="app-module.js" />
var buiployApp = angular
	.module("buiployApp", [
		"ngRoute",
		"ui.bootstrap",
		"buiploy.system",
		"buiploy.building",
		"buiploy.common",
		]
	)


///<jscompress sourcefile="app-config.js" />
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
///<jscompress sourcefile="common-module.js" />
angular
	.module("buiploy.common", ['ui.bootstrap', 'ng']);
///<jscompress sourcefile="common_controller.js" />
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

///<jscompress sourcefile="bussiness.service.js" />
angular
	.module("buiploy.common")
	.factory('BussinessService', ['$http', '$rootScope', function($http, $rootScope){
		var list = function(postData, postUrl){
			return $http.post(postUrl, postData);
		};

		var get = function(getUrl){
			return $http.get(postData);
		};

		var newMessageRemind = {
			_step: 0,
			_title: document.title,
			_timer: null,
			show: function() {
				var temps = newMessageRemind._title.replace("[			]", "").replace("[New message]", "");
				newMessageRemind._timer = setTimeout(function() {
					newMessageRemind.show();

					newMessageRemind._step++;
					if (newMessageRemind._step == 3) {
						newMessageRemind._step = 1
					};
					if (newMessageRemind._step == 1) {
						document.title = "[			]" + temps
					};
					if (newMessageRemind._step == 2) {
						document.title = "[New message]" + temps
					};
				},
				800);
				return [newMessageRemind._timer, newMessageRemind._title];
			},

			clear: function() {
				clearTimeout(newMessageRemind._timer);
				document.title = newMessageRemind._title;
			}
		};

		var HTMLFormat = (function() {
		    function style_html(html_source, indent_size, indent_character, max_char) {
		        var Parser, multi_parser;
		 
		        function Parser() {
		 
		            this.pos = 0;
		            this.token = '';
		            this.current_mode = 'CONTENT';
		            this.tags = {
		                parent: 'parent1',
		                parentcount: 1,
		                parent1: ''
		            };
		            this.tag_type = '';
		            this.token_text = this.last_token = this.last_text = this.token_type = '';
		 
		 
		            this.Utils = {
		                whitespace: "\n\r\t ".split(''),
		                single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed'.split(','),
		                extra_liners: 'head,body,/html'.split(','),
		                in_array: function(what, arr) {
		                    for (var i = 0; i < arr.length; i++) {
		                        if (what === arr[i]) {
		                            return true;
		                        }
		                    }
		                    return false;
		                }
		            }
		 
		            this.get_content = function() {
		                var char = '';
		                var content = [];
		                var space = false;
		                while (this.input.charAt(this.pos) !== '<') {
		                    if (this.pos >= this.input.length) {
		                        return content.length ? content.join('') : ['', 'TK_EOF'];
		                    }
		 
		                    char = this.input.charAt(this.pos);
		                    this.pos++;
		                    this.line_char_count++;
		 
		 
		                    if (this.Utils.in_array(char, this.Utils.whitespace)) {
		                        if (content.length) {
		                            space = true;
		                        }
		                        this.line_char_count--;
		                        continue;
		                    } else if (space) {
		                        if (this.line_char_count >= this.max_char) {
		                            content.push('\n');
		                            for (var i = 0; i < this.indent_level; i++) {
		                                content.push(this.indent_string);
		                            }
		                            this.line_char_count = 0;
		                        } else {
		                            content.push(' ');
		                            this.line_char_count++;
		                        }
		                        space = false;
		                    }
		                    content.push(char);
		                }
		                return content.length ? content.join('') : '';
		            }
		 
		            this.get_script = function() {
		                var char = '';
		                var content = [];
		                var reg_match = new RegExp('\<\/script' + '\>', 'igm');
		                reg_match.lastIndex = this.pos;
		                var reg_array = reg_match.exec(this.input);
		                var end_script = reg_array ? reg_array.index : this.input.length;
		                while (this.pos < end_script) {
		                    if (this.pos >= this.input.length) {
		                        return content.length ? content.join('') : ['', 'TK_EOF'];
		                    }
		 
		                    char = this.input.charAt(this.pos);
		                    this.pos++;
		 
		 
		                    content.push(char);
		                }
		                return content.length ? content.join('') : '';
		            }
		 
		            this.record_tag = function(tag) {
		                if (this.tags[tag + 'count']) {
		                    this.tags[tag + 'count']++;
		                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
		                } else {
		                    this.tags[tag + 'count'] = 1;
		                    this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
		                }
		                this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent;
		                this.tags.parent = tag + this.tags[tag + 'count'];
		            }
		 
		            this.retrieve_tag = function(tag) {
		                if (this.tags[tag + 'count']) {
		                    var temp_parent = this.tags.parent;
		                    while (temp_parent) {
		                        if (tag + this.tags[tag + 'count'] === temp_parent) {
		                            break;
		                        }
		                        temp_parent = this.tags[temp_parent + 'parent'];
		                    }
		                    if (temp_parent) {
		                        this.indent_level = this.tags[tag + this.tags[tag + 'count']];
		                        this.tags.parent = this.tags[temp_parent + 'parent'];
		                    }
		                    delete this.tags[tag + this.tags[tag + 'count'] + 'parent'];
		                    delete this.tags[tag + this.tags[tag + 'count']];
		                    if (this.tags[tag + 'count'] == 1) {
		                        delete this.tags[tag + 'count'];
		                    } else {
		                        this.tags[tag + 'count']--;
		                    }
		                }
		            }
		 
		            this.get_tag = function() {
		                var char = '';
		                var content = [];
		                var space = false;
		 
		                do {
		                    if (this.pos >= this.input.length) {
		                        return content.length ? content.join('') : ['', 'TK_EOF'];
		                    }
		 
		                    char = this.input.charAt(this.pos);
		                    this.pos++;
		                    this.line_char_count++;
		 
		                    if (this.Utils.in_array(char, this.Utils.whitespace)) {
		                        space = true;
		                        this.line_char_count--;
		                        continue;
		                    }
		 
		                    if (char === "'" || char === '"') {
		                        if (!content[1] || content[1] !== '!') {
		                            char += this.get_unformatted(char);
		                            space = true;
		                        }
		                    }
		 
		                    if (char === '=') {
		                        space = false;
		                    }
		 
		                    if (content.length && content[content.length - 1] !== '=' && char !== '>' && space) {
		                        if (this.line_char_count >= this.max_char) {
		                            this.print_newline(false, content);
		                            this.line_char_count = 0;
		                        } else {
		                            content.push(' ');
		                            this.line_char_count++;
		                        }
		                        space = false;
		                    }
		                    content.push(char);
		                } while (char !== '>');
		 
		                var tag_complete = content.join('');
		                var tag_index;
		                if (tag_complete.indexOf(' ') != -1) {
		                    tag_index = tag_complete.indexOf(' ');
		                } else {
		                    tag_index = tag_complete.indexOf('>');
		                }
		                var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
		                if (tag_complete.charAt(tag_complete.length - 2) === '/' || this.Utils.in_array(tag_check, this.Utils.single_token)) {
		                    this.tag_type = 'SINGLE';
		                } else if (tag_check === 'script') {
		                    this.record_tag(tag_check);
		                    this.tag_type = 'SCRIPT';
		                } else if (tag_check === 'style') {
		                    this.record_tag(tag_check);
		                    this.tag_type = 'STYLE';
		                } else if (tag_check.charAt(0) === '!') {
		                    if (tag_check.indexOf('[if') != -1) {
		                        if (tag_complete.indexOf('!IE') != -1) {
		                            var comment = this.get_unformatted('-->', tag_complete);
		                            content.push(comment);
		                        }
		                        this.tag_type = 'START';
		                    } else if (tag_check.indexOf('[endif') != -1) {
		                        this.tag_type = 'END';
		                        this.unindent();
		                    } else if (tag_check.indexOf('[cdata[') != -1) {
		                        var comment = this.get_unformatted(']]>', tag_complete);
		                        content.push(comment);
		                        this.tag_type = 'SINGLE';
		                    } else {
		                        var comment = this.get_unformatted('-->', tag_complete);
		                        content.push(comment);
		                        this.tag_type = 'SINGLE';
		                    }
		                } else {
		                    if (tag_check.charAt(0) === '/') {
		                        this.retrieve_tag(tag_check.substring(1));
		                        this.tag_type = 'END';
		                    } else {
		                        this.record_tag(tag_check);
		                        this.tag_type = 'START';
		                    }
		                    if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) {
		                        this.print_newline(true, this.output);
		                    }
		                }
		                return content.join('');
		            }
		 
		            this.get_unformatted = function(delimiter, orig_tag) {
		                if (orig_tag && orig_tag.indexOf(delimiter) != -1) {
		                    return '';
		                }
		                var char = '';
		                var content = '';
		                var space = true;
		                do {
		 
		 
		                    char = this.input.charAt(this.pos);
		                    this.pos++
		 
		                    if (this.Utils.in_array(char, this.Utils.whitespace)) {
		                        if (!space) {
		                            this.line_char_count--;
		                            continue;
		                        }
		                        if (char === '\n' || char === '\r') {
		                            content += '\n';
		                            for (var i = 0; i < this.indent_level; i++) {
		                                content += this.indent_string;
		                            }
		                            space = false;
		                            this.line_char_count = 0;
		                            continue;
		                        }
		                    }
		                    content += char;
		                    this.line_char_count++;
		                    space = true;
		 
		 
		                } while (content.indexOf(delimiter) == -1);
		                return content;
		            }
		 
		            this.get_token = function() {
		                var token;
		 
		                if (this.last_token === 'TK_TAG_SCRIPT') {
		                    var temp_token = this.get_script();
		                    if (typeof temp_token !== 'string') {
		                        return temp_token;
		                    }
		                    //token = js_beautify(temp_token, this.indent_size, this.indent_character, this.indent_level);
		                    //return [token, 'TK_CONTENT'];
		                    return [temp_token, 'TK_CONTENT'];
		                }
		                if (this.current_mode === 'CONTENT') {
		                    token = this.get_content();
		                    if (typeof token !== 'string') {
		                        return token;
		                    } else {
		                        return [token, 'TK_CONTENT'];
		                    }
		                }
		 
		                if (this.current_mode === 'TAG') {
		                    token = this.get_tag();
		                    if (typeof token !== 'string') {
		                        return token;
		                    } else {
		                        var tag_name_type = 'TK_TAG_' + this.tag_type;
		                        return [token, tag_name_type];
		                    }
		                }
		            }
		 
		            this.printer = function(js_source, indent_character, indent_size, max_char) {
		                this.input = js_source || '';
		                this.output = [];
		                this.indent_character = indent_character || ' ';
		                this.indent_string = '';
		                this.indent_size = indent_size || 2;
		                this.indent_level = 0;
		                this.max_char = max_char || 70;
		                this.line_char_count = 0;
		                for (var i = 0; i < this.indent_size; i++) {
		                    this.indent_string += this.indent_character;
		                }
		 
		                this.print_newline = function(ignore, arr) {
		                    this.line_char_count = 0;
		                    if (!arr || !arr.length) {
		                        return;
		                    }
		                    if (!ignore) {
		                        while (this.Utils.in_array(arr[arr.length - 1], this.Utils.whitespace)) {
		                            arr.pop();
		                        }
		                    }
		                    arr.push('\n');
		                    for (var i = 0; i < this.indent_level; i++) {
		                        arr.push(this.indent_string);
		                    }
		                }
		 
		 
		                this.print_token = function(text) {
		                    this.output.push(text);
		                }
		 
		                this.indent = function() {
		                    this.indent_level++;
		                }
		 
		                this.unindent = function() {
		                    if (this.indent_level > 0) {
		                        this.indent_level--;
		                    }
		                }
		            }
		            return this;
		        }
		 
		 
		 
		 
		        multi_parser = new Parser();
		        multi_parser.printer(html_source, indent_character, indent_size);
		        while (true) {
		            var t = multi_parser.get_token();
		            multi_parser.token_text = t[0];
		            multi_parser.token_type = t[1];
		 
		            if (multi_parser.token_type === 'TK_EOF') {
		                break;
		            }
		 
		 
		            switch (multi_parser.token_type) {
		            case 'TK_TAG_START':
		            case 'TK_TAG_SCRIPT':
		            case 'TK_TAG_STYLE':
		                multi_parser.print_newline(false, multi_parser.output);
		                multi_parser.print_token(multi_parser.token_text);
		                multi_parser.indent();
		                multi_parser.current_mode = 'CONTENT';
		                break;
		            case 'TK_TAG_END':
		                multi_parser.print_newline(true, multi_parser.output);
		                multi_parser.print_token(multi_parser.token_text);
		                multi_parser.current_mode = 'CONTENT';
		                break;
		            case 'TK_TAG_SINGLE':
		                multi_parser.print_newline(false, multi_parser.output);
		                multi_parser.print_token(multi_parser.token_text);
		                multi_parser.current_mode = 'CONTENT';
		                break;
		            case 'TK_CONTENT':
		                if (multi_parser.token_text !== '') {
		                    multi_parser.print_newline(false, multi_parser.output);
		                    multi_parser.print_token(multi_parser.token_text);
		                }
		                multi_parser.current_mode = 'TAG';
		                break;
		            }
		            multi_parser.last_token = multi_parser.token_type;
		            multi_parser.last_text = multi_parser.token_text;
		        }
		        return multi_parser.output.join('');
		    }
		 
		    return function(data) {
		        var dataHolder = ['__dataHolder_', [Math.random(), Math.random(), Math.random(), Math.random()].join('_').replace(/[^0-9]/g, '_'), '_'].join('_');
		        var dataHolders = {};
		        var index = 0;
		        data = data.replace(/(\")(data:[^\"]*)(\")/g, function($0, $1, $2, $3) {
		            var name = dataHolder + index++;
		            dataHolders[name] = $2;
		            return $1 + name + $3;
		        })
		        data = style_html(data, 1, '\t', 0x10000000);
		        data = data.replace(new RegExp(dataHolder + '[0-9]+', 'g'), function($0) {
		            return dataHolders[$0];
		        });
		 
		        return data;
		    }
		})();


		var sidenav = $(".sidenav");
		var is_open = false;

 		var sideClose = function(){
 			sidenav.stop().animate({width:"0px"},300);
 			$rootScope.navsideOpen = false;
 			is_open = false;
 		}
 		var sideOpen = function(){
 			sidenav.stop().animate({width:"600px"},300);
 			$rootScope.navsideOpen = true;
 			is_open = true;
 		}

		var sideToggle = function(){
			if(sidenav.width != 0){
				sideClose();
			}else{
				sideOpen();
			}
		}

	 	$(document).click(function(e){ 
		        e = window.event || e; // 兼容IE7
		        obj = $(e.srcElement || e.target);
		        if ($(obj).is(".sidenav,span,button,.sidenav *")) { 
					
		        } else {
		        	// 关闭右侧工具栏
		        	if (is_open){
						sideClose();
					}
		        } 
		});

		return {
			list: function(postData, postUrl){
				return list(postData, postUrl);
			},
			get : function(getUrl){
				return get(getUrl);
			},
			showTitle : function(){
				return newMessageRemind.show();
			},
			clearTitle : function(){
				return newMessageRemind.clear();
			},
			HTMLFormat : function(data){
				return HTMLFormat(data);
			},
			sideToggle : function(){
				return sideToggle();
			},
			sideClose : function(){
				return sideClose();
			},
			sideOpen : function(){
				return sideOpen();
			}
		}

	}])
///<jscompress sourcefile="interceptor.service.js" />
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
///<jscompress sourcefile="alter.service.js" />
angular.module('buiploy.common')
.value("alerts",[]) //如果不写这个，那么下面的$rootScope.alerts = []就只能是显示一个了
.factory('commAlertService',['$rootScope','$timeout','alerts',function($rootScope,$timeout,alerts){
  return {
    "alertService":function(){
      var alertJson = {};
      $rootScope.alerts = alerts;
      alertJson.add = function(type,msg,time){
        $rootScope.alerts.push({'type': type, 'msg': msg,'close':function(){
          alertJson.closeAlert(this);
        }});
        //如果设置定time的话就定时消失
        if(time){
          $timeout(function(){
            $rootScope.alerts = [];
          },time);
        }
      };
      alertJson.closeAlert = function(alert){
        $rootScope.alerts.splice($rootScope.alerts.indexOf(alert),1);
      };
      return alertJson;
    }
  }
}])
///<jscompress sourcefile="filter.js" />
angular
	.module('buiploy.common')
	.filter('status_convert', function(){
		/*
			usage: {{stauts | status_convert}}
			过滤器,用于修改状态值的展示
		*/
		var status_convert_func = function(src_status){
			var dest_status = src_status == 1 ? '成功' : (src_status == -1 ? '失败' : (src_status == 0 ? '打包中' : '打包中'))
			return dest_status
		};
		return status_convert_func;
	});
///<jscompress sourcefile="pagination.directive.js" />
angular
	.module('buiploy.common')
	.directive('tmPagination',[function(){
	return {
		restrict: 'EA',
		template: '<div class="page-list">' +
            '<ul class="pagination" ng-show="conf.totalItems > 0">' +
            '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
            '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
            'ng-click="changeCurrentPage(item)">' +
            '<span>{{ item }}</span>' +
            '</li>' +
            '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>&raquo;</span></li>' +
            '</ul>' +
            '<div class="page-total" ng-show="conf.totalItems > 0">' +
            '第<input type="text" ng-model="jumpPageNum"  ng-keyup="jumpToPage($event)"/>页 ' +
            '每页<select ng-model="conf.itemsPerPage" ng-options="option for option in conf.perPageOptions "></select>' +
            '/共<strong>{{ conf.totalItems }}</strong>条' +
            '</div>' +
            '<div class="no-items" ng-show="conf.totalItems <= 0">暂无数据</div>' +
            '</div>',
		replace: true,
		scope: {
			conf: '='
		},
		link: function(scope, element, attrs){

			// 变更当前页
			scope.changeCurrentPage = function(item) {
				if(item == '...'){
					return;
				}else{
					scope.conf.currentPage = item;
				}
			};

			// 定义分页的长度必须为奇数 (default:9)
			scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9 ;
			if(scope.conf.pagesLength % 2 === 0){
				// 如果不是奇数的时候处理一下
				scope.conf.pagesLength = scope.conf.pagesLength -1;
			}

			// conf.erPageOptions
			if(!scope.conf.perPageOptions){
				scope.conf.perPageOptions = [10, 15, 20, 30, 50];
			}

			// pageList数组
			function getPagination(newValue, oldValue) {

				// conf.currentPage
				scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;

				// conf.totalItems
				scope.conf.totalItems = parseInt(scope.conf.totalItems) ? parseInt(scope.conf.totalItems) : 0;

				// conf.itemsPerPage (default:15)
				scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;

				// numberOfPages
				scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems/scope.conf.itemsPerPage);

				// judge currentPage > scope.numberOfPages
				if(scope.conf.currentPage < 1){
					scope.conf.currentPage = 1;
				}

				// 如果分页总数>0，并且当前页大于分页总数
				if(scope.conf.numberOfPages > 0 && scope.conf.currentPage > scope.conf.numberOfPages){
					scope.conf.currentPage = scope.conf.numberOfPages;
				}

				// jumpPageNum
				scope.jumpPageNum = scope.conf.currentPage;

				// 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
				var perPageOptionsLength = scope.conf.perPageOptions.length;
				// 定义状态
				var perPageOptionsStatus;
				for(var i = 0; i < perPageOptionsLength; i++){
					if(scope.conf.perPageOptions[i] == scope.conf.itemsPerPage){
						perPageOptionsStatus = true;
					}
				}
				// 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
				if(!perPageOptionsStatus){
					scope.conf.perPageOptions.push(scope.conf.itemsPerPage);
				}

				// 对选项进行sort
				scope.conf.perPageOptions.sort(function(a, b){return a-b});

				scope.pageList = [];
				if(scope.conf.numberOfPages <= scope.conf.pagesLength){
					// 判断总页数如果小于等于分页的长度，若小于则直接显示
					for(i =1; i <= scope.conf.numberOfPages; i++){
						scope.pageList.push(i);
					}
				}else{
					// 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
					// 计算中心偏移量
					var offset = (scope.conf.pagesLength - 1)/2;
					if(scope.conf.currentPage <= offset){
						// 左边没有...
						for(i =1; i <= offset +1; i++){
							scope.pageList.push(i);
						}
						scope.pageList.push('...');
						scope.pageList.push(scope.conf.numberOfPages);
					}else if(scope.conf.currentPage > scope.conf.numberOfPages - offset){
						scope.pageList.push(1);
						scope.pageList.push('...');
						for(i = offset + 1; i >= 1; i--){
							scope.pageList.push(scope.conf.numberOfPages - i);
						}
						scope.pageList.push(scope.conf.numberOfPages);
					}else{
						// 最后一种情况，两边都有...
						scope.pageList.push(1);
						scope.pageList.push('...');

						for(i = Math.ceil(offset/2) ; i >= 1; i--){
							scope.pageList.push(scope.conf.currentPage - i);
						}
						scope.pageList.push(scope.conf.currentPage);
						for(i = 1; i <= offset/2; i++){
							scope.pageList.push(scope.conf.currentPage + i);
						}

						scope.pageList.push('...');
						scope.pageList.push(scope.conf.numberOfPages);
					}
				}

				if(scope.conf.onChange){
					// 防止初始化两次请求问题
					if(!(oldValue != newValue && oldValue[0] == 0)) {
						scope.conf.onChange();
					}
					
				}
				scope.$parent.conf = scope.conf;
			}

			// prevPage
			scope.prevPage = function(){
				if(scope.conf.currentPage > 1){
					scope.conf.currentPage -= 1;
				}
			};
			// nextPage
			scope.nextPage = function(){
				if(scope.conf.currentPage < scope.conf.numberOfPages){
					scope.conf.currentPage += 1;
				}
			};

			// 跳转页
			scope.jumpToPage = function(){
				scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g,'');
				if(scope.jumpPageNum !== ''){
					scope.conf.currentPage = scope.jumpPageNum;
				}
			};

			scope.$watch(function() {
				
				if(!scope.conf.totalItems) {
					scope.conf.totalItems = 0;
				}

				var newValue = scope.conf.totalItems + ' ' +  scope.conf.currentPage + ' ' + scope.conf.itemsPerPage;
				return newValue;
			}, getPagination);

		}
	};
}])
	.directive('dynamicNameDirective', [function(){
		return {
			restrict: 'A',
			priority: 10000,
			controller: dynamicNameController
		};

	}]);

function dynamicNameController($scope, $element, $attrs, $parse) {
	var name = $parse($attrs.dynamicName)($scope);
	$attrs.$set("name", name);
}
///<jscompress sourcefile="table.directive.js" />
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


///<jscompress sourcefile="table.ext1.directive.js" />
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


///<jscompress sourcefile="map_controller.js" />
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
///<jscompress sourcefile="sidenav_controller.js" />
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
///<jscompress sourcefile="build-module.js" />
angular
	.module("buiploy.building", ['ui.bootstrap', 'buiploy.common']);
///<jscompress sourcefile="build.controller.js" />
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
			pageSize: $scope.paginationConf.itemsPerPage
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

function ModalInstanceCtrl($scope, $modalInstance, BussinessService, modal_info, config_info){
	$scope.modal_info = modal_info
	$scope.config_info = config_info
	$scope.item_list = []
	$scope.extend_item = undefined;
	$scope.formData = {}
	$scope.mode_selection = undefined;

	var current_gateway = undefined;
	var init_item = [];

	$scope.mode_select = function(mode){
		$scope.mode_selection = mode;
		GetEnterpriseInfo();
	};

	/*
		选择网关
		包含：微软云、多租户、旧网关、企业正式/测试网关
	*/
	$scope.ChooseGateway = function(gateway_mode){
		/* 发送数据时带上当前网关 */
		$scope.formData.gateway_mode = gateway_mode
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
		if ($scope.formData.svn_url != null){
			var postData = {
				svn_url: $scope.formData.svn_url
			};

			var postUrl = "/api/get_code_version";
			BussinessService.list(postData, postUrl).success(function (response) {
				$scope.formData.svn_version = response.svn_version;
			});	
		}
	};

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
				根据网关填充企业ip信息
			*/

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
					/* 若不填写任何值,或者主动清空该开关内的值,表示以后都不用该开关 */
					if ($scope.enterpriseForm[formParm].$modelValue){
						if ($scope.enterpriseForm[formParm].$modelValue.length){
							newObj[formParm]= $scope.enterpriseForm[formParm].$modelValue;
							extend_property = _.extend(extend_property, newObj);
							$scope.formData = _.extend($scope.formData, newObj);
						};
					};
				};
			};
		};
		/* 本次打包选择：android/ios */
		$scope.formData.mode_selection = $scope.mode_selection
		/* 去除extend_property属性 */
		var postData = _.omit($scope.formData, "extend_property");
		/* 重组extend_property */
		postData.extend_property = extend_property;
		/* 帶上enterprise_name,用于显示当前任务名称 */
		postData.enterprise_name = $scope.modal_info.enterprise_name

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

}



///<jscompress sourcefile="config.controller.js" />
/*
	打包配置页面控制器
*/
angular
	.module("buiploy.building")
	.controller("BuildConfigController", BuildConfigController);

BuildConfigController.$inject = ["$scope", "$rootScope", "$interval", "BussinessService", "$modal", "$log", ]

function BuildConfigController($scope, $rootScope, $interval, BussinessService, $modal, $log){

	/*
		页码初始化
	*/
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 10,
	};

	/*
		新增开关配置文件
	*/
	$scope.add_file = function(){
		var modalInstance = $modal.open({
			templateUrl : "/api/template/modal_config_add",
			controller: "AddConfigModalInstanceCtrl",
			size: 'lg',
			resolve: {
				modal_info: function(){
					return {
						modal_name: '新增配置文件',
						GetTableRows: GetTableRows,
					};
				},
			},
		})
		modalInstance.result.then(
			function(result){
				GetTableRows();
			},
			function(){
				/*do nothing*/
			}
		);
	};

	/*
		查看配置文件-开关详情
	*/
	var showDetail = function($index){
		var modalInstance = $modal.open({
			templateUrl : "/api/template/modal_config",
			controller: "ConfigModalInstanceCtrl",
			size: 'lg',
			resolve: {
				modal_info: function(){
					return {
						file_nick_name: $scope.config_list[$index].file_nick_name,
						GetTableRows: GetTableRows,
						modal_name: '开关详情设置'
					};
				},
			},
		})
	};

	/*
		初始化表格label
	*/
	var GetTableColumns = function(){
		var postData = {
			item_name : "buildConfigModule"
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
			item_name : "buildConfigModule",
			pageIndex: $scope.paginationConf.currentPage,
			pageSize: $scope.paginationConf.itemsPerPage
		};

		var postUrl = "/api/get_tableInfo";

		BussinessService.list(postData, postUrl).success(function (response) {
			$scope.paginationConf.totalItems = response.count;
			$scope.config_list = response.data_list;

			//package rows -> cells
			$scope.tableConf.rows = []
			for (var i= 0; i < $scope.config_list.length; i++){
				$scope.tableConf.rows.push({cells: []});
				for (var x=0; x < $scope.tableConf.colums.length; x++){
					var key = $scope.tableConf.colums[x].name
					$scope.tableConf.rows[i].cells.push($scope.config_list[i][key])
				}
			}
		});
	}	

	/*
		初始化表格信息
	*/
	$scope.tableConf = {
		id: "android_table",
		checked: false,
		class: "table table-bordered table-hover",
		getColumns: GetTableColumns,
		clickFunc: showDetail,
	}


}


angular
	.module("buiploy.building")
	.controller("ConfigModalInstanceCtrl", ConfigModalInstanceCtrl);

ConfigModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "modal_info", "BussinessService", "$rootScope"]

/*
	新增、设置控件开关静态框
*/
function ConfigModalInstanceCtrl($scope, $modalInstance, modal_info, BussinessService, $rootScope){
	$scope.modal_info = modal_info
	$scope.current_config = {}


	var showDetail = function(){
		var postData = {
			file_nick_name: $scope.modal_info.file_nick_name
		}

		var postUrl = "/api/get_current_switch"

		BussinessService.list(postData, postUrl).success(function(response){
			$scope.current_switch = response.configInfo
		});
	};


	$scope.add_items = function(){
		var items = {
			item_name: '',
			item_type: 'text',
			isshow: 'true',
			description: '',
		};
		$scope.current_switch.file_items.push(items)
	}

	$scope.minus_items = function($index){
		$scope.current_switch.file_items.splice($index, 1)
	};

	$scope.ok = function(){
		//package value
		var ret = {}
		var postData = {
			modify_switch: $scope.current_switch.file_items,
			file_nick_name: $scope.current_switch.file_nick_name,
		}

		var postUrl = "/api/modify_switch"
		BussinessService.list(postData, postUrl)
			.success(function(response){
				swal({
					title: $scope.modal_info.modal_name, text: response.result, type: "success", timer: 1500,
					showConfirmButton: false,
				});
			})
			.error(function(response){
				swal({
					title: $scope.modal_info.modal_name, text: response.result, type: "error", timer: 1500,
					showConfirmButton: false,
				});
			})
		$modalInstance.close();	
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

	$scope.delete = function(){
		var postData = {
			file_nick_name: $scope.current_switch.file_nick_name
		}

		var postUrl = "/api/delete_config_file"
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
	};

	showDetail();

}

angular
	.module("buiploy.building")
	.controller("AddConfigModalInstanceCtrl", AddConfigModalInstanceCtrl);

AddConfigModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "modal_info", "BussinessService"]

/*
	新增配置文件静态框
*/
function AddConfigModalInstanceCtrl($scope, $modalInstance, modal_info, BussinessService){
	$scope.modal_info = modal_info;

	/*
		新增配置文件
	*/
	$scope.ok = function(){
		//package value
		var postData = {
			add_config_file: $scope.formData
		}

		var postUrl = "/api/add_config_file"

		BussinessService.list(postData, postUrl).success(function(response){
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
	};

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}

}

///<jscompress sourcefile="history.controller.js" />
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
		$scope.upload_package = function(package_name, download_url){
			var postData = {
				package_name : package_name,
				download_url : download_url,
			};

			var postUrl = "/api/upload_package";

			BussinessService.list(postData, postUrl).success(function(response){
				$modalInstance.close();
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
///<jscompress sourcefile="repositoryies.controller.js" />
/*
	打包配置页面控制器
*/
angular
	.module("buiploy.building")
	.controller("RepositoryiesController", RepositoryiesController);

RepositoryiesController.$inject = ["$scope", "$rootScope", "$interval", "BussinessService", "$modal", "$log", ]

function RepositoryiesController($scope, $rootScope, $interval, BussinessService, $modal, $log){
	/*
		页码初始化
	*/
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 10,
	};

	/*
		初始化表格label
	*/
	var GetTableColumns = function(){
		var postData = {
			item_name : "repositoryModule"
		};

		var postUrl = "/api/get_tableTitle";

		BussinessService.list(postData, postUrl).success(function(response){
			$scope.tableConf.colums = response.columns

			$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', GetTableRows);
		});
	};

	/*
		获取表格数据
	*/
	var GetTableRows = function(){
		var postData = {
			item_name : "repositoryModule",
			pageIndex: $scope.paginationConf.currentPage,
			pageSize: $scope.paginationConf.itemsPerPage
		};

		var postUrl = "/api/get_tableInfo";

		BussinessService.list(postData, postUrl).success(function (response) {
			$scope.paginationConf.totalItems = response.count;
			$scope.repository_list = response.data_list;

			//package rows -> cells
			$scope.tableConf.rows = []
			for (var i= 0; i < $scope.repository_list.length; i++){
				$scope.tableConf.rows.push({cells: []});
				for (var x=0; x < $scope.tableConf.colums.length; x++){
					var key = $scope.tableConf.colums[x].name
					$scope.tableConf.rows[i].cells.push($scope.repository_list[i][key])
					//判断本行的数据是否成功
					$scope.tableConf.rows[i].issuccess = $scope.repository_list[i]['issuccess']
				}
			}
		});
	}

	$scope.add_repository = function(){
		var modalInstance = $modal.open({
			templateUrl : "/api/template/modal_repository_add",
			controller: "AddRepositoryModalInstanceCtrl",
			size: 'lg',
			resolve: {
				modal_info: function(){
					return {
						modal_name: '缓存代码',
						GetTableRows: GetTableRows,
					};
				},
			},
		});		

	};

	/*
		初始化表格
	*/
	$scope.tableConf = {
		id: "android_table",
		class: "table table-bordered table-hover",
		getColumns: GetTableColumns,
		clickFunc: null,
	}


}


angular
	.module("buiploy.building")
	.controller("AddRepositoryModalInstanceCtrl", AddRepositoryModalInstanceCtrl);

AddRepositoryModalInstanceCtrl.$inject = ["$scope", "$modalInstance", "BussinessService", "modal_info"]
function AddRepositoryModalInstanceCtrl($scope, $modalInstance, BussinessService, modal_info){
	$scope.modal_info = modal_info;

	$scope.ok = function(){
		var postData = {
			repository_info: $scope.formData
		}

		var postUrl = "/api/add_repository"

		BussinessService.list(postData, postUrl).success(function(response){
			swal({
				title: '缓存代码', text: response.result, type: "success", timer: 1500,
				showConfirmButton: false,
			});
			modal_info.GetTableRows();
			$modalInstance.close();
		})
		.error(function(response){
			swal({
				title: '缓存代码', text: response.result, type: "error", timer: 1500,
				showConfirmButton: false,
			});
			$modalInstance.close();
		})

	}

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
}
///<jscompress sourcefile="system-module.js" />
angular
	.module("buiploy.system", []);
///<jscompress sourcefile="directive.js" />
angular
	.module("buiploy.system")
	.directive("tableDirective", tableDirective);

function tableDirective(){
	var directive = {
		restrict : "E",
		template : "<h1>TestTest</h1>"
	}

}
///<jscompress sourcefile="controller.js" />
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
