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
		$(".menu.close-icon").click(function() {
			var sideMenuLayerWidth = $(".side-menu-layer").width();
			$(".side-menu-layer").animate({
				right: -sideMenuLayerWidth,
			}, 300, function(e) {
				$(".dark-layer").css("display", "none");
				$(this).off(e);
			});
		});
	}

	$(".menu>.market").on("click", function() {
		$(".menu").css("display", "none");
		$(".sub.menu.market").animate({
			right: 0,
		}, 300);
	});

	scrollUp();
	writeToSell();
	searchAll();
	closeSearchBar();
	closeMenuLayer();
	openMenuLayer();
});
