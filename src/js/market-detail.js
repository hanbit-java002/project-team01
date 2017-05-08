require([
	"common",
], function() {
	var common = require("common");
	var productId = common.getQuerystring("product");

	/*-----split (list로 리턴)-----*/
	function split(x) {
		return x.split("|");
	}

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
		$.ajax({
			url: window._ctx.root + "/api/product/like/" + productId,
			success: function (result) {
				$(".market-detail .board-info .like").html("<span class='fa fa-heart-o'></span> " + result);
			},
		});
	}

	/*-----comment Info 불러오기-----*/
	function loadComment() {
	}

	/*-----comment count 불러오기-----*/
	function countComment() {
		$.ajax({
			url: window._ctx.root + "/api/product/comment/" + productId,
			success: function (result) {
				$(".market-detail .board-info .comment").html("<span class='fa fa-commenting-o'></span> " + result);
			},
		});
	}

	/*-----complain Info 불러오기-----*/
	function countComplain() {
		$.ajax({
			url: window._ctx.root + "/api/product/complain/" + productId,
			success: function (result) {
				$(".market-detail .board-info .complain").html("<span class='fa fa-thumbs-o-down'></span> " + result);
			},
		});
	}

	/*-----hits Info 불러오기-----*/
	function countHits() {
	}

	/*-----product img 불러오기-----*/
	function loadProductImg() {
		$.ajax({
			url: window._ctx.root + "/api/product/img/" + productId,
			success: function (result) {
				var list = result.list;
				var itemHTML = "";

				for (var i=0; i<list.length; i++) {
					var item = list[i];

					itemHTML += "<div class='item'>";
					itemHTML += "<div class='product-img' style='background-image: ";
					itemHTML += "url('" + item.img_url + "')'></div>";
					itemHTML += "</div>";
				}

				$("#market-detail-img-carousel .carousel-inner").html(itemHTML);
			},
		});
	}

	/*-----판매자 정보 불러오기-----*/
	function loadSellerInfo() {
		$.ajax({
			url: window._ctx.root + "/api/product/seller/" + productId,
			success: function(result) {
				var sellerInfo = result.sellerInfo;
				var countSell = result.countSell;

				$(".market-detail .seller-info .seller-name").text(sellerInfo.user_name);
				$(".market-detail .seller-info .selling-complete span").text(countSell);
				$(".market-detail .seller-info .seller-rank").attr("seller-rank", sellerInfo.user_rank);

				// user rank 에 따른 icon 변경
				if (sellerInfo.user_rank !== undefined && sellerInfo.user_rank.length > 0) {
					var userRank = $(".market-detail .seller-info .seller-rank").attr("seller-rank");

					$(".seller-info .seller-rank").removeClass();
					if(userRank === "member") {
						$(".seller-info>.seller.name [seller-rank=member]").addClass("seller-rank fa fa-star-o");
					}
					if(userRank === "silver") {
						$(".seller-info>.seller.name [seller-rank=silver]").addClass("seller-rank fa fa-star");
					}
					if(userRank === "gold") {
						$(".seller-info>.seller.name [seller-rank=gold]").addClass("seller-rank fa fa-diamond");
					}
					if(userRank === "admin") {
						$(".seller-info>.seller.name [seller-rank=admin]").addClass("seller-rank fa fa-user-circle-o");
					}
					if(userRank=== "blackList") {
						$(".seller-info>.seller.name [seller-rank=blackList]").addClass("seller-rank fa fa-frown-o");
					}
				}
			},
		});
	}

	/*-----product Detail + 거래 Info 불러오기-----*/
	function loadProductDetail() {
		$.ajax({
			url: window._ctx.root + "/api/product/detail/" + productId,
			success: function(list) {
				var item = list[0];
				var price = common.numberWithCommas(item.price);
				var date = common.getFormatDate(item.update_date);
				console.log(list);

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

				// 거래 방식 info
				var dealMeans = split(item.deal_means);
				var deliveryCheck = item.delivery_check;
				var directPlace = item.direct_place;

				var dealHTML = "";
				for (var i=0; i<dealMeans.length; i++) {
					var dealType = dealMeans[i];

					if (dealType === "direct") {
						dealHTML += "<div class='directly'>";
						dealHTML += "<line></line>";
						if (directPlace !== undefined) {
							dealHTML += item.direct_place;
						}
						if (directPlace == "") {
							dealHTML += "가능";
						}
						dealHTML += "</div>";
					}
					if (dealType === "delivery") {
						dealHTML += "<div class='delivery'>";
						dealHTML += "<line></line>";
						if (deliveryCheck === "exclude") {
							dealHTML += "택배비 착불";
						}
						if (deliveryCheck === "include") {
							dealHTML += "무료 배송";
						}
						dealHTML += "</div>";
					}
				}
				dealHTML += "<div class='safety'>";
				dealHTML += "</div>";
				$(".market-detail .dealing-mode").append(dealHTML);

				if (item.safe_deal === 1) {
					$(".market-detail .dealing-mode .safety").html("<line></line>가능");
				}
				if (item.safe_deal === 0) {
					$(".market-detail .dealing-mode .safety").html("<line></line>불가");
				}


				$(".market-detail .product.name").text(item.product_name);
				$(".market-detail .product.price").html("<i class='fa fa-won'></i>" + price);
				$(".market-detail .user-description").html(item.description.replace(/\n/g, "<br>"));
				$(".board-info .reporting-date").html("<span class='fa fa-clock-o'></span> " + date);
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
