$(document).ready(function(){

	// Within the callback, use .tmpl() to render the data.
	function showData(data){
		var datacona ={};
		for (var i=0; i<data.length;i++){
			datacona = data[i];
		}
		console.log(datacona);
		var template = $('#hbdemo').html();
		var templateScript = Handlebars.compile(template);
		console.log('templating...');
		var html = templateScript(datacona);
	  	$('.tasklist').append(html);
	}

	$.ajax({
	  type:'GET',
	  async: false,
	  dataType: 'json',
	  url: '/api/getData',
	  success: showData,
	});
		

});