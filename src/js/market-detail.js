require([
	"common",
], function() {

	$(".product-img-layer .carousel").carousel("pause");

	/*---show product-img-layer---*/
	$("#market-detail-img-carousel .product-img").on("click", function() {
		$(".product-img-layer").css("display", "block");
		$("body").css("overflow", "hidden");
	});

	/*---hide product-img-layer---*/
	$(".product-img-layer .close-icon").on("click", function() {
		$(".product-img-layer").css("display", "none");
		$("body").css("overflow", "");
	});
});
