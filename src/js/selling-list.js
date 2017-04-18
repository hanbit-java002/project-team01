require([
	"common",
], function() {
	var common = require("common");

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

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "purchase-process") {

		}
		else if ($(jqElement).attr("menu-category-detail") === "purchase-complete") {

		}
	};

	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
	});

	$("#all-selected").on("click", function () {
		console.log($("#all-selected").prop("checked"));
	});
});
