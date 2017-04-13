require([
	"common",
], function() {
	function viewMoreProduct() {
		$(".view-more").on("click", function() {
			location.href = window._ctx.root + "/market/market.html";
		});
	}

	viewMoreProduct();
});
