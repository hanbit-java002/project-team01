require([
	"common",
], function() {

	var naviHandler=function () {


	};

	function naviGate(className, naviHandler) {
		className= "."+className;
		$(className+">ul>li").on("click", function () {
			$(className+">ul>li").removeClass("active");
			$(this).addClass("active");

			/* 버튼을 눌렀을때 실행될 상황*/
			console.log($(this).attr(className));
		});
	}



	naviGate("purchase-progress", naviHandler);

});
