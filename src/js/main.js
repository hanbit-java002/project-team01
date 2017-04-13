require([
	"common",
], function() {
	var common= require("common");
	function viewMoreProduct() {
		$(".view-more").on("click", function() {
			location.href = window._ctx.root + "/market/market.html";
		});
	}

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "brand-all") {
			alert("all"); // 실행 예시
		}
		else if ($(jqElement).attr("menu-category-detail") === "brand-palace") {
			alert("palace");
		}
		else if ($(jqElement).attr("menu-category-detail") === "brand-nike") {
			alert("nike");
		}
		else if ($(jqElement).attr("menu-category-detail") === "brand-supreme") {
			alert("supreme");
		}
	};

	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
	});

	viewMoreProduct();
});
