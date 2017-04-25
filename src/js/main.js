require([
	"common",
], function() {
	var common= require("common");


	function viewMoreProduct() {
		$(".view-more").on("click", function() {
			var brandId = $(".menu-category>ul .active").attr("menu-category-detail");
			console.log(brandId);
			var url = window._ctx.root + "/market/market.html";
			url += "?brand=" + brandId;
			location.href = url;
		});
	}

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "all") {
			alert("all"); // 실행 예시
		}
		else if ($(jqElement).attr("menu-category-detail") === "palace") {
			alert("palace");
		}
		else if ($(jqElement).attr("menu-category-detail") === "nike") {
			alert("nike");
		}
		else if ($(jqElement).attr("menu-category-detail") === "supreme") {
			alert("supreme");
		}
	};

	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
	});

	viewMoreProduct();
});
