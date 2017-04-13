define([
	"bootstrap", "jquery.easing"
], function() {
	function scrollUp() {
		$(document).ready(function() {
			var prePosition = 0;
			$(window).on("scroll", function(event) {
				var initPosition = $(this).scrollTop();
				if(initPosition > prePosition) {
					$("#scroll-up-btn").show();
				}
				else {
					$("#scroll-up-btn").hide();
				}
			});
		});
		$("#scroll-up-btn").click(function() {
			$("html, body").animate({
				scrollTop: 0,
			}, 400);
		});
	}

	function searchAll() {
		$(".search-icon.white").click(function() {
			$(".search-bar").css("display", "block");
			$(".header-menu").css("display", "none");
		});
	}

	function closeSearchBar() {
		$(".search-bar>.close-icon").click(function() {
			$(".search-bar").css("display", "none");
			$(".header-menu").css("display", "block");
			$("#header-search-input").val();
		});
	}

	function writeToSell() {
		$(".write-btn").click(function() {
			location.href = "/selling/selling.html";
		});
	}

	function openMenuLayer() {
		$(".menu-icon.fa-reorder").on("click", function() {
			$(".dark-layer").css("display", "block");
			$(".side-menu-layer").animate({
				right: 0,
			}, 300);
		});
	}

	function closeMenuLayer() {
		$(".side-menu.close-icon, .dark-layer").click(function() {
			var sideMenuLayerWidth = $(".side-menu-layer").width();
			$(".side-menu-layer").animate({
				right: -sideMenuLayerWidth,
			}, 300, function(e) {
				$(".dark-layer").css("display", "none");
				initSubMenu();
				$(this).off(e);
			});
		});
	}

	function showSubMenu() {
		$(".main-menu>li").on("click", function() {
			var selector = $(this).attr("id");
			if (selector === "market" || selector === "my-page") {
				$(".sub-menu." + selector).css("display", "block");
				$(".main-menu").css("position", "absolute");
				$(".main-menu").animate({
					right: "-100%",
				}, 300);
				$(".sub-menu." + selector).animate({
					right: 0,
				}, 300);
			}
			else {
				return;
			}
		});
	}

	function backSubMenu() {
		$(".sub-menu>.sub-title").on("click", function() {
			var selector = $(this).attr("for");

			$(".sub-menu." + selector).animate({
				right: "100%",
			}, 300, function(e) {
				$(".sub-menu." + selector).css("display", "none");
				$(this).off(e);
			});
			$(".main-menu").animate({
				right: "0%",
			}, 300);
		});
	}

	function initSubMenu() {
		$(".sub-menu").css({
			right: "100%",
			display: "none",
		});
		$(".main-menu").css({
			right: "0%",
			position: "relative",
		});
	}
	/* 팝업 공통화
	* 사용방법
	* 1. 팝업을 가져올 큰틀  <div class="popup-something">~~~</div>
	* 클래스 이름은 아무거나 해도됨.
	* 2. 해당 자바스크립트에서
	* var common = require("common");   선언
	* 그리고
	* 	$(".popup-something").on("click", function() {
	 		common.popUp("pop-up-series", "left");
	 	});
	 	이렇게 해주면 팝업 설정 끝.
	 	취소 버튼을 따로 해주고 싶다면 취소 버튼에 클래스를 popup-close로
	 	해주시면 됩니다.
	 	
	*
	* */
	function closePopUp(className, direction) {
		className ="."+className;
		var height=$(className).height();
		var width=$(className).width();

		if (direction === "top") {
			$(className).animate({
				top: "-"+height,
			}, 100);
		}
		else if(direction === "bottom") {
			$(className).animate({
				bottom: "-"+height,
			}, 100);
		}

		else if (direction === "left") {
			$(className).animate({
				left: "-"+width,
			}, 100);
		}
		else if(direction === "right") {
			$(className).animate({
				right: "-"+width,
			}, 100);
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
				}, 300, "easeInOutBack");
			}
			else {
				$("."+className).animate({
					bottom: verticleCenter,
				}, 300, "easeInOutBack");
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
				}, 300, "easeInOutBack");
			}
			else {
				$("."+className).animate({
					right: horizontalCenter,
				}, 300, "easeInOutBack");
			}
		}
		$(".black-layer, .popup-close").on("click", function() {
			closePopUp(className, direction);
		});
	}


	scrollUp();
	writeToSell();
	searchAll();
	closeSearchBar();
	closeMenuLayer();
	openMenuLayer();
	showSubMenu();
	backSubMenu();

	return ({
		popUp: popUp,
	});

});
