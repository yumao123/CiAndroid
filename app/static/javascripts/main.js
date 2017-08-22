require.config({
	baseUrl: 'url_for("static")',
	paths : {
		"jquery": ["http://cdn.bootcss.com/jquery/3.1.1/jquery", "js/jquery"],
		"bootstrap": ["http://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min"],
	},
	shim: {
		"bootstrap": ['jquery'],
		"qrcode" : ['jquery'],
	}
})


require(["jquery", "bootstrap"],function(jquery, bootstrap){

	jquery(document).ready(function(){
		var loadingPath = jquery('#rqSrc').attr('src');

		get_qg = function(){
			console.log("get qg...");

			var phone = jquery('#phone').val();
			/*变相暴露手机号.interesting*/
			if(phone == "")phone = "13450414629";

			jquery('#rqSrc').attr('src', loadingPath);
			var timestamps = Date.parse(new Date()).toString();
			timestamps = timestamps.substring(0, timestamps.length-3) + '000'
			/*规则：8002|手机号|时间戳(后三位为000)|400106B008*/
			var qrData = "8002|" + phone + "|" + timestamps + "|" + "440106B008";

			jquery.ajax({ 
				async:false, 
				url:'http://api.wwei.cn/wwei.html?',
				type: "GET", 
				data: {
					data: qrData,
					apikey: "20170224211040"
				},
				crossDomain: true,
				dataType: 'jsonp',
				timeout: 5000, 
				success: function (json) { 
					 var rqSrc = json.data.qr_filepath;
					 jquery('#rqSrc').attr('src', rqSrc);
				}
			});
		}

		get_qg();
		setInterval("get_qg()", 1000*15);

		jquery("#getQr").click(function(){
			get_qg();

		});
	});



});
