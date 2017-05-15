require([
	"common",
], function() {
	var common = require("common");
	var rowsPerPage = 4;
	var page = 0;

	/*-----select Like -----*/
	function selectLike(productId) {
		$(".list-selector.like").off();
		$(".list-selector.like").on("click", function() {
			var select = $(".list-selector.like").hasClass("fa-heart").toString();

			if(select === "false") {
				$.ajax({
					url: window._ctx.root + "/api/like/add/" + productId,
					success: function (data) {
						console.log(data.result);
						if (data.result === "ok") {
							$(".list-selector.like").removeClass("fa-heart-o");
							$(".list-selector.like").addClass("fa-heart");
							countLike(productId);
						}
						if (data.result === "no") {
							alert("로그인을 해주세요.");
						}

					},
					error: function() {
						alert("로그인을 해주세요.");
					},
				});
			}
			if(select === "true") {
				$.ajax({
					url: window._ctx.root + "/api/like/cancel/" + productId,
					success: function (data) {
						if (data.result === "ok") {
							$(".list-selector.like").removeClass("fa-heart");
							$(".list-selector.like").addClass("fa-heart-o");
							countLike(productId);
						}
					},
					error: function() {
						alert("로그인을 해주세요.");
					},
				});
			}
		});
	}

	/*-----Like count 불러오기-----*/
	function countLike(productId) {
		$.ajax({
			url: window._ctx.root + "/api/like/count/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .like-count").html("<span class='fa fa-heart-o'></span> "
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----comment count 불러오기-----*/
	function countComment(productId) {
		$.ajax({
			url: window._ctx.root + "/api/product/comment/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .comment").html("<span class='fa fa-commenting-o'></span> "
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----complain Info 불러오기-----*/
	function countComplain(productId) {
		$.ajax({
			url: window._ctx.root + "/api/product/complain/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .complain").html("<span class='fa fa-thumbs-o-down'></span> "
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----hits Info 불러오기-----*/
	function countHits(productId) {
		$.ajax({
			url: window._ctx.root + "/api/hits/count/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .hits").html("<span class='fa fa-eye'></span> "
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----like list 불러오기-----*/
	function showList() {
		$.ajax({
			url: window._ctx.root + "/api/like/list",
			data: {
				rowsPerPage: rowsPerPage,
				page: page,
			},
			success: function (result) {
				var count = result.count;
				var lastPage = parseInt(count / rowsPerPage) + (count % rowsPerPage === 0 ? 0 : 1) - 1;
				console.log(result);

				// count 검색 결과
				$(".list-header .product-count span").text(count);

				if(count === 0) {
					$("ul.list.like-list").html("<div class='default-text'>찜한 상품이 없습니다.</div>");
				}
				else {
					for (var i=0; i<result.list.length; i++) {
						var itemHTML ="";
						var item = result.list[i];
						var productId = item.product_id;

						console.log("productId : " + item.product_id);

						itemHTML += "<li class=\"product-item-list\" product-id=\""+ item.product_id +
							"\" process=\"" + item.selling_status + "\">";
						itemHTML += "<div class=\"product-info\">";
						itemHTML += "<img class=\"product-img\" src=\"" + item.img_url + "\">";
						itemHTML += "<div class=\"detail-info\">";
						itemHTML += "<div class=\"product name\">";
						itemHTML += item.product_name;
						itemHTML += "</div>";
						itemHTML += "<div class=\"product price\">";
						itemHTML += "<i class=\"fa fa-won\"></i>";
						itemHTML += common.numberWithCommas(item.price);
						itemHTML += "</div>";
						itemHTML += "<div class=\"product size\">";
						itemHTML += item.size;
						if (item.category_name === "신발") {
							itemHTML += "mm";
						}
						else if (item.category_name === "하의") {
							itemHTML += "inch";
						}
						itemHTML += "</div>";
						itemHTML += "<div class=\"product quality\">";
						if (item.quality === "new") {
							itemHTML += "새상품";
						}
						else if (item.quality === "used") {
							itemHTML += "중고";
						}
						itemHTML += "</div>";
						itemHTML += "<ul class=\"product dealing-mode\">";

						var dealMeans = item.deal_means.split("|");
						for (var j=0; j<dealMeans.length; j++) {
							var dealType = dealMeans[j];

							if (dealType === "direct") {
								itemHTML += "<li class=\"dealing-mode directly\">";
								itemHTML += "직접거래";
								itemHTML += "</li>";
							}
							if (dealType === "delivery") {
								itemHTML += "<li class=\"dealing-mode delivery\">";
								itemHTML += "택배거래";
								itemHTML += "</li>";
							}
						}

						if (item.safe_deal === 1) {
							itemHTML += "<li class=\"dealing-mode safety\">";
							itemHTML += "안심결제";
							itemHTML += "</li>";
						}

						itemHTML += "</ul>";
						itemHTML += "<div class=\"seller-info\">";
						itemHTML += "<div class=\"info-label\">판매자</div>";
						itemHTML += "<div class=\"seller-rank ";
						if (item.user_rank === "member") {
							itemHTML +=	"fa fa-star-o\"></div>";
						}
						else if (item.user_rank === "silver") {
							itemHTML +=	"fa fa-star\"></div>";
						}
						else if (item.user_rank === "gold") {
							itemHTML +=	"fa fa-diamond\"></div>";
						}
						else if (item.user_rank === "admin") {
							itemHTML +=	"fa fa-user-circle-o\"></div>";
						}
						else if (item.user_rank === "blackList") {
							itemHTML +=	"fa fa-frown-o\"></div>";
						}

						itemHTML += "<div class=\"seller-name\">";
						itemHTML += item.user_name;
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"board-info\">";
						itemHTML += "<div class=\"like-count\">";
						itemHTML += "</div>";
						itemHTML += "<div class=\"comment\">";
						itemHTML += "<span class=\"fa fa-commenting-o\"></span>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"complain\">";
						itemHTML += "<span class=\"fa fa-thumbs-o-down\"></span>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"hits\">";
						itemHTML += "<span class=\"fa fa-eye\"></span>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"reporting-date\">";
						itemHTML += "<span class=\"fa fa-clock-o\"></span> " + common.getFormatDate(item.update_date);
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"list-selector like fa fa-heart\" valid=\"true\"></div>";
						itemHTML += "</li>";

						$("ul.list.like-list").append(itemHTML);
						countHits(productId);
						countComplain(productId);
						countComment(productId);
						countLike(productId);
						selectLike(productId);
					}

					/* 더보기 클릭시*/
					if(count > rowsPerPage || page < lastPage) {
						var moreHTML = "More<span class=\"fa fa-angle-down\"></span>";
						$(".more-list").html(moreHTML);
					}

					$(".more-list").off();
					$(".more-list").on("click", function () {
						++page;
						if (page <= lastPage) {
							showList();
						}
						else {
							alert("마지막 물품입니다.");
						}
					});

					goMarketDetail();
				}
			},
			error: function () {
				alert("로그인이 필요합니다.");
			}
		});
	}

	/* list 클릭시 마켓디테일 페이지 이동*/
	function goMarketDetail() {
		$(".like-list>li").off();
		$(".like-list>li").on("click", function () {
			var productId= $(this).attr("product-id");

			var url = window._ctx.root+"/market/market-detail.html";
			url += "?product="+productId;
			location.href =url;
		});
	}

	showList();
	goMarketDetail();
});
