require([
	"common",
], function() {
	var common= require("common");
	var rowsPerPage = 4;
	var currentPage = 1;

	/*-----split (list로 리턴)-----*/
	function split(x) {
		return x.split("|");
	}

	/*-----list 불러오기-----*/
	function loadList(currentPage) {
		// 브랜드ID 불러오기
		$.ajax({
			url: window._ctx.root + "/api/product/brand",
			success: function (list) {
				for (var i=0; i<list.length; i++) {
					var item = list[i];
					if(item.brand_name === "PALACE") {
						$(".menu-category [menu-category-detail=PALACE]").attr("brand_id", item.brand_id);
					}
					if(item.brand_name === "NIKE") {
						$(".menu-category [menu-category-detail=NIKE]").attr("brand_id", item.brand_id);
					}
					if(item.brand_name === "SUPREME") {
						$(".menu-category [menu-category-detail=SUPREME]").attr("brand_id", item.brand_id);
					}
				}
				$(".menu-category [menu-category-detail=ALL]").attr("brand_id", "ALL");
			},
		});

		var brandName = $(".menu-category>ul>li.active").attr("menu-category-detail");

		// 리스트 불러오기
		$.ajax({
			url: window._ctx.root + "/api/product/list",
			data: {
				currentPage: currentPage,
				rowsPerPage: rowsPerPage,
				brandName: brandName,
			},
			success: function(result) {
				var list = result.list;
				var itemHTML = "";

				for (var i=0; i<list.length; i++) {
					var item = list[i];
					var categoryName = item.category_name;
					var quality = item.quality;
					var dealMeans = split(item.deal_means);
					var price = common.numberWithCommas(item.price);
					var safeDeal = item.safe_deal;

					console.log(safeDeal);

					itemHTML += "<li product-id='" + item.product_id + "'>";
					itemHTML += "<div class='product-info'>";
					itemHTML += "<img class='product-img' src='" + item.img_url + "'>";
					itemHTML += "<div class='detail-info'>";
					itemHTML += "<div class='product name'>";
					itemHTML += item.product_name;
					itemHTML += "</div>";
					itemHTML += "<div class='product price'>";
					itemHTML += "<i class='fa fa-won'></i>";
					itemHTML += price;
					itemHTML += "</div>";
					itemHTML += "<div class='product size'>";
					itemHTML += item.size;
					if (categoryName !== undefined && categoryName.length > 0) {
						if (categoryName === "신발") {
							itemHTML += "<span> mm</span>";
						}
						if (categoryName === "하의") {
							itemHTML += "<span> inch</span>";
						}
					}
					itemHTML += "</div>";
					itemHTML += "<div class='product quality'>";
					if (quality !== undefined && quality.length > 0) {
						if (quality === "used") {
							itemHTML += "중고상품";
						}
						if (quality === "new") {
							itemHTML += "새상품";
						}
					}
					itemHTML += "</div>";
					itemHTML += "<ul class='product dealing-mode'>";
					for (var x=0; x<list.length; x++) {
						var dealType = dealMeans[x];
						console.log(dealMeans);
						if (dealType !== undefined && dealType.length > 0) {
							if (dealType === "direct") {
								itemHTML += "<li class='dealing-mode directly'>";
								itemHTML += "직접거래";
								itemHTML += "</li>";
							}
							if (dealType === "delivery") {
								itemHTML += "<li class='dealing-mode delivery'>";
								itemHTML += "택배거래";
								itemHTML += "</li>";
							}
						}
					}
					if (safeDeal === 1) {
						itemHTML += "<li class='dealing-mode safety'>";
						itemHTML += "안심결제";
						itemHTML += "</li>";
					}
					itemHTML += "</ul>";
					itemHTML += "<div class='view-details'>";
					itemHTML += "<a href='" + window._ctx.root;
					itemHTML += "/market/market-detail.html?product=" + item.product_id + "'>";
					itemHTML += "더보기";
					itemHTML += "<div class='fa fa-angle-double-right'></div>";
					itemHTML += "</a>";
					itemHTML += "</div>";
					itemHTML += "</div>";
					itemHTML += "</div>";
					itemHTML += "</li>";
				}

				$(".main>.product-list").html(itemHTML);

				viewDetails();
				console.log(brandName);
			},
		});
	}

	// "더 많은 상품 보기" -> 마켓 페이지로 이동
	function viewMoreProduct() {
		$(".view-more").on("click", function() {
			var brandId = $(".menu-category>ul .active").attr("brand_id");
			var url = window._ctx.root + "/market/market.html";
			url += "?brandId=" + brandId;
			location.href = url;
		});
	}

	// 상품 상세 정보 페이지로 이동
	function viewDetails() {
		$(".product-list>li").on("click", function() {
			var productId = $(this).attr("product-id");
			console.log(productId);
			var url = window._ctx.root + "/market/market-detail.html";
			url += "?product=" + productId;
			location.href = url;
		});
	}

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "all") {
		}
		else if ($(jqElement).attr("menu-category-detail") === "palace") {
		}
		else if ($(jqElement).attr("menu-category-detail") === "nike") {
		}
		else if ($(jqElement).attr("menu-category-detail") === "supreme") {
		}
	};

	// 브랜드 카테고리 메뉴 클릭시
	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
		loadList(currentPage);
		viewDetails();
	});

	loadList(currentPage);
	viewMoreProduct();
});
