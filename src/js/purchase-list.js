require([
	"common",
], function() {
	var common = require("common");

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "purchase-processing") {
			$(".purchase-list>section.purchase-complete").css("display", "none");
			$(".purchase-list>section.purchase-processing").css("display", "block");
		}
		else if ($(jqElement).attr("menu-category-detail") === "purchase-complete") {
			$(".purchase-list>section.purchase-processing").css("display", "none");
			$(".purchase-list>section.purchase-complete").css("display", "block");
		}
	};

	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
	});

});
