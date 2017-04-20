define([
	"bootstrap", "jquery.easing"
], function() {
	function scrollUp() {
		$(document).ready(function() {
			var initPosition = 0;
			$(window).on("scroll", function(event) {
				var currentPosition = $(this).scrollTop();
				if(currentPosition > initPosition) {
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

	function fixHeader() {
		if (window._ctx.pageId === "main") {
			if ($(window).scrollTop() > 0) {
				$("header").removeClass("header-transparent");
			}
			$(window).on("scroll", function(event) {
				var currentPosition = $(this).scrollTop();
				if (currentPosition > 0) {
					$("header").removeClass("header-transparent");
				}
				else {
					$("header").addClass("header-transparent");
				}
			});
		}
		else {
			$("header").removeClass("header-transparent");
		}
	}


	function searchAll() {
		$(".search-icon.white").click(function() {
			$(".all-search-bar").css("display", "block");
			$(".header-menu").css("display", "none");
		});
	}

	function closeSearchBar() {
		$(".all-search-bar>.close-icon").click(function() {
			$(".all-search-bar").css("display", "none");
			$(".header-menu").css("display", "block");
			$("#header-search-input").val();
		});
	}

	function locationWriteToSell() {
		$(".write-btn").click(function() {
			location.href = window._ctx.root + "/selling/selling.html";
		});
	}

	function openMenuLayer() {
		$(".menu-icon.fa-reorder").on("click", function() {
			$(".dark-layer").css("display", "block");
			$("body").css("overflow", "hidden");
			$(".side-menu-layer").animate({
				right: 0,
			}, 300, "easeInOutQuint");
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
			$("body").css("overflow", "");
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

	function locationSubMenu() {
		$(".sub-menu.market>li").on("click", function() {
			var brandId = $(this).attr("brand");
			var url = window._ctx.root + "/market/market.html";
			url += "?brand=" + brandId;
			location.href = url;
		});
	}

	/* 팝업 공통화
	 * 사용방법
	 * 1. 팝업을 가져올 큰틀  <div class="popup-something">~~~</div>
	 * 클래스 이름은 아무거나 해도됨.
	 *
	 * 2. 해당 자바스크립트에서
	 * var common = require("common");   선언
	 * 그리고
	 * 	$(".popup-something").on("click", function() {
	 common.popUp("pop-up-series", "left");
	 });
	 left,right,bottom,top 네 가지가 있습니다.
	 이렇게 해주면 팝업 설정 끝.
	 취소 버튼을 따로 해주고 싶다면 취소 버튼에 클래스를 popup-close로
	 해주시면 됩니다.
	 *
	 * */
	function closePopUp(className, direction) {
		className ="."+className;
		var height=$(className).outerHeight();
		var width=$(className).outerWidth();

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
		$(".dark-layer").css("display", "none");
	}

	function popUp(className, direction) {
		$(".dark-layer").css("display", "block");
		$("body").css("overflow", "hidden");
		var height=$("."+className).outerHeight();
		var width=$("."+className).outerWidth();
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
				}, 300, "easeInOutQuint");
			}
			else {
				$("."+className).animate({
					bottom: verticleCenter,
				}, 300, "easeInOutQuint");
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
				}, 300, "easeInOutQuint");
			}
			else {
				$("."+className).animate({
					right: horizontalCenter,
				}, 300, "easeInOutQuint");
			}
		}
		$(".dark-layer, .popup-close").on("click", function() {
			closePopUp(className, direction);
		});
	}

	/* 네비게이션 갯수에 따른 세팅*/
	function initNavi() {
		if ($(".menu-category").length>0) {
			var naviCount = $(".menu-category>ul>li").length;
			$(".menu-category>ul>li").css({
				width: "calc(100%/"+naviCount+")",
				opacity: 1,
			});
		}
	}

	/*
	 * 메뉴 네이비게션바 사용법
	 * 1. test.Html
	 *
	 <section class="menu-category">
		 <ul>
			 <li menu-category-detail="somthing1">
			 somthing1
			 </li>
			 <li menu-category-detail="somthing2">
			 somthing2
			 </li>
			 <li menu-category-detail="nike" class="somthing3">
			 somthing3
			 </li>
			 <li menu-category-detail="somthing4">
			 somthing4
			 </li>
		 </ul>
	 </section>
	 등등 가짓수는 많아질수 있음.

	 2.test.js
	 //커먼을 가져옴
	 var common = require("common");

	// 핸들러로 이용해 메뉴 카테고리 디테일에
	 설 정해둔 것이 실행 될 때를 만들어줌

	 var naviHandler = function (jqElement) {
	 if ($(jqElement).attr("menu-category-detail") === "somthing1") {
	 	alert("all"); // 실행 예시
	 }
	 else if ($(jqElement).attr("menu-category-detail") === "somthing2") {
	 alert("nike");
	 }
	 else if ($(jqElement).attr("menu-category-detail") === "somthing3") {
	 alert("palace");
	 }
	 else if ($(jqElement).attr("menu-category-detail") === "somthing4") {
	 alert("supreme");
	 }
	 };

	메뉴 카테고리를 클릭했을 때 일어나는 이벤트
	 common.navigate(this, naviHandler)로 지금 현재 클릭 한 this와
	 naviHandler의 클로져 함수에 일어날 이벤트를 만들어주면 됨.
	 $(".menu-category>ul>li").on("click", function () {
	 	common.navigate(this, naviHandler);
	 });
	 *
	 *
	 *
	 * */

	/*선택한 menu-category에 active class 추가*/
	function navigate(jqElement, naviHandler) {
		$(".menu-category>ul>li").removeClass("active");
		$(jqElement).addClass("active");
		naviHandler(jqElement);
		console.log(jqElement);
	}

	/* url 주소 넘겨서 받기 논 ajax*/
	function getQuerystring(paraName) {
		var tempURL = location.search.substring(1);
		var tempUnitURL=tempURL.split("&");
		for (var count=0; count<tempUnitURL.length; count++) {
			var tempValueURL=tempUnitURL[count].split("=");
			if (tempValueURL[0] === paraName) {
				return tempValueURL[1];
			}
		}
	}

	/* list selector */
	function listSelector() {
		$("[check-box]").on("click", function () {
			if ($(this).attr("get-checked") == "true") {
				$(this).attr("get-checked", "false");
			}
			else if ($(this).attr("get-checked") == "false") {
				$(this).attr("get-checked", "true");
			}
		});

		$("#all-selected").on("click", function () {
			if ($(this).attr("get-checked") == "true") {
				$("[name='chk']").attr("get-checked", "true");
			}
			else if ($(this).attr("get-checked") == "false") {
				$("[name='chk']").attr("get-checked", "false");
			}

		});
	}


	initNavi();
	scrollUp();
	fixHeader();
	locationWriteToSell();
	searchAll();
	closeSearchBar();
	closeMenuLayer();
	openMenuLayer();
	showSubMenu();
	backSubMenu();
	locationSubMenu();

	/*외부에서 해당 함수 사용 가능*/
	return ({
		popUp: popUp,
		navigate: navigate,
		getQuerystring: getQuerystring,
		listSelector: listSelector,
	});

});
