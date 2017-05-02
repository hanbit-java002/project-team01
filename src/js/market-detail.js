require([
	"common",
], function() {
	var common = require("common");
	var productId = common.getQuerystring("product");


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


	/*-----Like count 불러오기-----*/
	function countLike() {
	}

	/*-----comment Info 불러오기-----*/
	function loadComment() {
	}

	/*-----comment count 불러오기-----*/
	function countComment() {
	}

	/*-----complain Info 불러오기-----*/
	function countComplain() {
	}

	/*-----hits Info 불러오기-----*/
	function countHits() {
	}

	/*-----product img 불러오기-----*/
	function loadProductImg() {
	}

	/*-----판매자 정보 불러오기-----*/
	function loadSellerInfo() {
		$.ajax({
			url: window._ctx.root + "/api/product/seller/" + productId,
			success: function(result) {
				var sellerInfo = result.sellerInfo;
				var countSell = result.countSell;

				console.log(countSell);

				$(".market-detail .seller-info .seller-name").text(sellerInfo.user_name);
				$(".market-detail .seller-info .selling-complete span").text(countSell);
			},
		});
	}

	/*-----product Detail Info 불러오기-----*/
	function loadProductDetail() {
		$.ajax({
			url: window._ctx.root + "/api/product/detail/" + productId,
			success: function(list) {
				var item = list[0];
				var price = common.numberWithCommas(item.price);


				// 사이즈
				if (item.category_name !== undefined && item.category_name.length > 0) {
					var sizeHTML = "<line></line>" + item.size;
					if (item.category_name === "신발") {
						sizeHTML += "<span> mm</span>";
						$(".market-detail .product.size").html(sizeHTML);
					}
					if (item.category_name === "하의") {
						sizeHTML += "<span> inch</span>";
						$(".market-detail .product.size").html(sizeHTML);
					}
					$(".market-detail .product.size").html(sizeHTML);
				}

				// 퀄리티
				if (item.quality !== undefined && item.quality.length > 0) {
					var qulityHTML = "<line></line>";
					if (item.quality === "used") {
						qulityHTML += "중고상품";
						$(".market-detail .product.quality").html(qulityHTML);
					}
					if (item.quality === "new") {
						qulityHTML += "새상품";
						$(".market-detail .product.quality").html(qulityHTML);
					}
				}

				$(".market-detail .product.name").text(item.product_name);
				$(".market-detail .product.price").html("<i class='fa fa-won'></i>" + price);
				$(".market-detail .user-description").html(item.description.replace(/\n/g, "<br>"));
				$(".board-info .reporting-date").html("<span class='fa fa-clock-o'></span>" + item.update_date);
			},
		});
	}
	loadProductImg();
	loadProductDetail();
	loadSellerInfo();
	loadComment();
	countComment();
	countLike();
	countComplain();
	countHits();
});
