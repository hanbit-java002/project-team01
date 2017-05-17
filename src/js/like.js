require([
	"common",
], function() {
	var common = require("common");
	var rowsPerPage = 4;
	var page = 0;
	var searchValue = "";
	var form = "date";

	/*-----select Like -----*/
	function selectLike() {
		$(".list-selector.like").off();
		$(".list-selector.like").on("click", function() {
			event.stopPropagation();
			var productId = $(this).parents("li").attr("product-id");
			$.ajax({
				url: window._ctx.root + "/api/like/cancel/" + productId,
				success: function () {
					var resultCount = $(".list-header .product-count span").attr("count");
					console.log(resultCount);
					$(".list.like-list li[product-id=" + productId + "]").remove();
					$(".list-header .product-count span").attr("count", resultCount - 1);
					$(".list-header .product-count span").text(resultCount - 1);
				},
				error: function() {
					alert("로그인을 해주세요.");
				},
			});
		});
	}

	/*-----Like count 불러오기-----*/
	function countLike(productId) {
		$.ajax({
			url: window._ctx.root + "/api/like/count/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .like-count").html("<span class='fa fa-heart-o'></span>"
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----comment count 불러오기-----*/
	function countComment(productId) {
		$.ajax({
			url: window._ctx.root + "/api/product/comment/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .comment").html("<span class='fa fa-commenting-o'></span>"
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----complain Info 불러오기-----*/
	function countComplain(productId) {
		$.ajax({
			url: window._ctx.root + "/api/product/complain/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .complain").html("<span class='fa fa-thumbs-o-down'></span>"
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----hits Info 불러오기-----*/
	function countHits(productId) {
		$.ajax({
			url: window._ctx.root + "/api/hits/count/" + productId,
			success: function (result) {
				$("[product-id=" + productId + "] .board-info .hits").html("<span class='fa fa-eye'></span>"
					+ common.numberWithCommas(result));
			},
		});
	}

	/*-----like list 불러오기-----*/
	function showList(searchValue) {
		$.ajax({
			url: window._ctx.root + "/api/like/list",
			data: {
				rowsPerPage: rowsPerPage,
				page: page,
				searchValue: searchValue,
			},
			success: function (result) {
				var count = result.count;
				var lastPage = parseInt(count / rowsPerPage) + (count % rowsPerPage === 0 ? 0 : 1) - 1;
				console.log(result);

				// count 검색 결과
				$(".list-header .product-count span").text(count);
				$(".list-header .product-count span").attr("count", count);

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
						itemHTML += "<span class=\"fa fa-clock-o\"></span>" + common.getFormatDate(item.update_date, form);
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"list-selector like fa fa-heart\" valid=\"true\"></div>";
						itemHTML += "</li>";

						$("ul.list.like-list").append(itemHTML);
						countHits(productId);
						countComplain(productId);
						countComment(productId);
						countLike(productId);
						selectLike();
					}

					if(page < lastPage) {
						var moreHTML = "More<span class=\"fa fa-angle-down\"></span>";
						$(".more-list").html(moreHTML);
					}
					else if(page >= lastPage) {
						$("section.more-list").remove();
					}

					/* 더보기 클릭시*/
					$(".more-list").off();
					$(".more-list").on("click", function () {
						++page;
						if (page <= lastPage) {
							showList(searchValue);
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

	// search
	function search() {
		$(".list-search-box input").on("keyup", function(event) {
			searchValue = $(".list-search-box input").val().trim();
			if (event.keyCode === 13) {
				showList(searchValue);
				$(".list.like-list>li, .list.like-list>div").remove();
			}
			else if (event.keyCode === 27) {
				clearSearchKeywords();
			}
		});
		$(".list-search-box .fa-search").on("click", function () {
			searchValue = $(".list-search-box input").val().trim();
			console.log(searchValue);
			console.log("서치 실행");
			if (searchValue === "") {
				alert("검색어를 입력해주세요.");
				$(".list-search-box input").focus();
				console.log("서치 실행 포커스");
			}
			else {
				showList(searchValue);
				$(".list.like-list>li, .list.like-list>div").remove();
				console.log("서치 실행 리스트");
			}
		});
	}

	// 검색 input TEXT 초기화
	function clearSearchKeywords() {
		$(".list-search-box input").val("");
	}

	showList(searchValue);
	search();
	goMarketDetail();
});
