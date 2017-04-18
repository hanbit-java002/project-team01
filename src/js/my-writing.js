require([
	"common",
], function() {
	var common= require("common");

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "bulletins") {
			$(".my-writing>section.comment").css("display", "none");
			$(".my-writing>section.bulletins").css("display", "block");
		}
		else if ($(jqElement).attr("menu-category-detail") === "comment") {
			$(".my-writing>section.bulletins").css("display", "none");
			$(".my-writing>section.comment").css("display", "block");
		}
	};

	$(".menu-category>ul>li").on("click", function() {
		common.navigate(this, naviHandler);
	});

});
