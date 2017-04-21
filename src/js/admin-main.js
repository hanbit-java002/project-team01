require([
	"common",
], function() {
	$(".admin-menu>ul>li").on("click", function() {
		var menu = $(this).attr("menu");

		location.href = window._ctx.root + "/admin/" + menu + ".html";
	});
});
