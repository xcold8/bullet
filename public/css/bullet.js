$(document).ready(function(){

	// Within the callback, use .tmpl() to render the data.
	function showData(data){
		var template = $('#hbdemo').html();
		var templateScript = Handlebars.compile(template);
		console.log('templating...');
		var html = templateScript(data);
	  	$('.tasklist').append(html);
}


	/*$.ajax({
	  type:'GET',
	  async: false,
	  dataType: 'json',
	  url: '/api/getData',
	  success: showData,
	});*/
		

});