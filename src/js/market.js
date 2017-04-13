require([
	"common",
], function() {
	$(".brand>ul>li").on("click", function () {
		$(".brand>ul>li").removeClass("active");
		$(this).addClass("active");

		/* 버튼을 눌렀을때 실행될 상황*/
		console.log($(this).attr("brand-name"));
	});

	function closePopUp(className, direction) {
		className ="."+className;
		var height=$(className).height();
		var width=$(className).width();

		if (direction === "top") {
			$(className).animate({
				top: "-"+height,
			}, 200);
		}
		else if(direction === "bottom") {
			$(className).animate({
				bottom: "-"+height,
			}, 200);
		}

		else if (direction === "left") {
			$(className).animate({
				left: "-"+width,
			}, 200);
		}
		else if(direction === "right") {
				$(className).animate({
					right: "-"+width,
				}, 200);
			}
		}
		$(".black-layer").remove();
	}

	function popUp(className, direction) {
		var blackLayer= "<div class='black-layer'></div>";
		$("body").prepend(blackLayer);
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
		var verticleCenter=(windowHeight/2)-(height/2)+"px";
		var horizontalCenter=(windowWidth/2)-(width/2)+"px";

		if (direction === "top" || direction === "bottom") {
			$("."+className).css({
				"display": "block",
				"position": "absolute",
				"left": "50%",
				"transform": "translateX(-50%)",
				"z-index": "100",
			});

			$("."+className).css(direction, "-"+height+"px");
			if (direction === "top") {
				$("."+className).animate({
					top: verticleCenter,
				}, 200);
			}
			else {
				$("."+className).animate({
					bottom: verticleCenter,
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
			if (direction === "left") {
				$("."+className).animate({
					left: horizontalCenter,
				}, 200);
			}
			else {
				$("."+className).animate({
					right: horizontalCenter,
				}, 200);
			}
		}
		$(".black-layer").on("click", function() {
			closePopUp(className, direction);
		});
	}
	$(".filter-series").on("click", function() {
		popUp("pop-up-series", "left");
	});
});
