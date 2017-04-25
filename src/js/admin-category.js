require([
	"common",
], function() {

	$(".menu-category>ul>li").on("click", function() {
		var menu = $(this).attr("menu-category-detail");
		location.href = window._ctx.root + "/admin/admin-" + menu + ".html";
	});

	$(".resell-btn.add").on("click", function() {
		$(".resell-container>section").css("display", "none");
		$(".resell-container>section.admin-add").css("display", "block");
	});

	$(".admin-list tbody td").on("click", function() {
		$(".resell-container>section").css("display", "none");
		$(".resell-container>section.admin-update").css("display", "block");
	});

	$(".btn-admin-cancel").on("click", function() {
		$(".resell-container>section").css("display", "none");
		$(".resell-container>section.admin-list").css("display", "block");
	});

});
