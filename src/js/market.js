require([
	"common",
], function() {
	var common = require("common");

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
});
