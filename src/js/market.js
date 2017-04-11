require([
	"common",
], function() {
	$(".brand>ul>li").on("click", function () {
		$(".brand>ul>li").removeClass("active");
		$(this).addClass("active");

		/* 버튼을 눌렀을때 실행될 상황*/
		console.log($(this).attr("brand-name"));
	});

	function popUp(className, direction) {

		var balckLayer= "<div class='black-layer'></div>";
		$("body").prepend(balckLayer);
		$(".black-layer").css({
			"position": "fixed",
			"width": "100%",
			"height": "100%",
			"z-index": "10",
			"background-color": "rgba(0,0,0,0.7)",
		});
		var height=$("."+className).height();
		var width=$("."+className).width();
		var windowHeight= $(window).height();
		var windowWidth= $(window).width();
		console.log(windowWidth);

		if (direction === "top" || direction === "bottom") {
			$("."+className).css({
				"display": "block",
				"position": "absolute",
				"left": "50%",
				"transform": "translateX(-50%)",
				"z-index": "100",
			});

			var here=(windowHeight/2)-(height/2)+"px";
			console.log(here);
			$("."+className).css(direction, "-"+height+"px");
			if (direction === "top") {
				$("."+className).animate({
					top: here,
				}, 200);
			}
			else {
				$("."+className).animate({
					bottom: here,
				}, 200);
			}

		}
		else if (direction === "left" || direction === "right") {
			$("."+className).css({
				"display": "block",
				"position": "absolute",
				"top": "50%",
				"transform": "translateY(-50%)",
				"z-index": "100",
			});
			$("."+className).css(direction, "-"+width+"px");
		}
	}

	$(".filter-series").on("click", function () {
		popUp("pop-up-series", "top");
	});
});
