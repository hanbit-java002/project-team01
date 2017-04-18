require([
	"common",
], function() {
	$(".admin-menu>ul>li").on("click", function() {
		var menu = $(this).attr("menu");

		location.href = "/admin/" + menu + ".html";
	});
});
