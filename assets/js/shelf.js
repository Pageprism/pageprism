$(function() {



   $(window).scroll(lazyload);
   lazyload();

   function lazyload(){
	   var wt = $(window).scrollTop();    //* top of the window
	   var wb = wt + $(window).height();  //* bottom of the window

	   $(".single-page").each(function(){
	      var ot = $(this).offset().top;  //* top of object (i.e. advertising div)
	      var ob = ot + $(this).height(); //* bottom of object

	      if(!$(this).attr("loaded") && wt<=ob && wb >= ot){
	         //$(this).html("here goes the iframe definition");
	         $(this).attr("loaded",true);
	      }
	   });
	}
	var href = location.pathname;
//window.alert(href.substr(href.lastIndexOf('/') + 1));

});