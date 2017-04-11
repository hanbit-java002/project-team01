define([
	"bootstrap",
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


	scrollUp();
	writeToSell();
	searchAll();
	closeSearchBar();
	closeMenuLayer();
	openMenuLayer();
	showSubMenu();
	backSubMenu();
});
