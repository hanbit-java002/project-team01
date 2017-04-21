require([
	"common",
], function() {
	var common = require("common");

	function initBrand() {
		var brand=common.getQuerystring("brand");

		$(".menu-category>ul>li").removeClass("active");
		if (brand=== "all") {
			$("[menu-category-detail='all']").addClass("active");
		}
		else if (brand=== "nike") {
			$("[menu-category-detail='nike']").addClass("active");
		}
		else if (brand=== "palace") {
			$("[menu-category-detail='palace']").addClass("active");
		}
		else if (brand=== "supreme") {
			$("[menu-category-detail='supreme']").addClass("active");
		}
	}

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "all") {
			alert("all");
		}
		else if ($(jqElement).attr("menu-category-detail") === "nike") {
			alert("nike");
		}
		else if ($(jqElement).attr("menu-category-detail") === "palace") {
			alert("palace");
		}
		else if ($(jqElement).attr("menu-category-detail") === "supreme") {
			alert("supreme");
		}
	};

	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
	});

	$(".filter-series").on("click", function() {
		common.popUp("pop-up-series", "top");
	});

	$(".product-inquire").on("click", function () {
		location.href = window._ctx.root + "/mypage/purchase-inqure-view.html";
	});

	initBrand();
});
