require([
	"common",
], function() {
	var common = require("common");

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "purchase-process") {

		}
		else if ($(jqElement).attr("menu-category-detail") === "purchase-complete") {

		}
	};

	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
	});

});
