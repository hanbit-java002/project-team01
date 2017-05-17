require([
	"common",
], function() {
	var common = require("common");
	var rowsPerPage = 4;
	var page = 0;
	var searchValue = "";

	/*-----seller answer list 불러오기-----*/
	function getAnswerList(inquireId, sellerUid) {
		$.ajax({
			url: window._ctx.root + "/api/inquire/answer",
			data: {
				inquireId: inquireId,
				sellerUid: sellerUid,
			},
			success: function (result) {
				console.log(result);

				var upperComment = $(".question-info[comment_id =" + inquireId + "]");
				var prentLi = upperComment.parents("li");
				if(result.length === 0) {
					prentLi.find(".answer-info").find(".content").text("아직 작성된 판매자 답변이 없습니다.");
					prentLi.find(".answer-info").find(".content").addClass("default");
				}

				else {
					prentLi.find(".answer-info").attr("comment_id", result.comment_id);
					prentLi.find(".answer-info").attr("upper_id", result.upper_id);
					prentLi.find(".answer-info").find(".reporting-date").html("<span class=\"fa fa-clock-o\"></span>"
						+ common.getFormatDate(result.comment_time, "time"));
					prentLi.find(".answer-info").find(".content").text(result.comment_contents);
				}

			},
		});
	}

	/*-----inquire list 불러오기-----*/
	function showList(searchValue) {
		$.ajax({
			url: window._ctx.root + "/api/inquire/list",
			data: {
				rowsPerPage: rowsPerPage,
				page: page,
				searchValue: searchValue,
			},
			success: function (result) {
				var count = result.count;
				var lastPage = parseInt(count / rowsPerPage) + (count % rowsPerPage === 0 ? 0 : 1) - 1;
				console.log(result);
				console.log("lastPage : " + lastPage);
				console.log("page : " + page);

				// count 검색 결과
				$(".list-header .product-count span").text(count);
				$(".list-header .product-count span").attr("count", count);

				if(count === 0) {
					$("ul.list.inquire-list").html("<div class='default-text'>문의한 상품이 없습니다.</div>");
					$("section.more-list>span").remove();
					$("section.more-list").text("");
				}
				else {
					for (var i=0; i<result.list.length; i++) {
						var itemHTML ="";
						var item = result.list[i];
						var productId = item.product_id;
						var inquireId = item.comment_id;
						var sellerUid = item.seller_uid;

						itemHTML += "<li product-id=\""+ productId + "\">";
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
						itemHTML += "<i class=\"fa fa-angle-double-right\"></i>";
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"question-info\" comment_id=\"" + inquireId + "\">";
						itemHTML += "<div class=\"info-title\">";
						itemHTML += "문의 내용";
						itemHTML += "</div>";
						itemHTML += "<div class=\"reporting-date\">";
						itemHTML += "<span class=\"fa fa-clock-o\"></span>";
						itemHTML += common.getFormatDate(item.comment_time, "time");
						itemHTML += "</div>";
						itemHTML += "<div class=\"content\">";
						itemHTML += item.comment_contents;
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "<div class=\"answer-info\" comment_id=\"\" upper_id=\"\">";
						itemHTML += "<div class=\"info-title\">";
						itemHTML += "판매자 답변";
						itemHTML += "</div>";
						itemHTML += "<div class=\"reporting-date\">";
						itemHTML += "</div>";
						itemHTML += "<div class=\"content\">";
						itemHTML += "</div>";
						itemHTML += "</div>";
						itemHTML += "</li>";

						$("ul.list.inquire-list").append(itemHTML);
						getAnswerList(inquireId, sellerUid);
					}

					if(page < lastPage) {
						console.log("더보기 실행");
						var moreHTML = "More<span class=\"fa fa-angle-down\"></span>";
						$("section.more-list").html(moreHTML);
					}
					else if(page >= lastPage) {
						$("section.more-list>span").remove();
						$("section.more-list").text("");
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
		$(".product-info").off();
		$(".product-info").on("click", function () {
			var productId= $(this).parents("li").attr("product-id");

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
				page = 0;
				showList(searchValue);
				$(".list.inquire-list>li, .list.inquire-list>div").remove();
			}
			else if (event.keyCode === 27) {
				clearSearchKeywords();
			}
		});
		$(".list-search-box .fa-search").on("click", function () {
			searchValue = $(".list-search-box input").val().trim();
			console.log("searchValue : " + searchValue);
			if (searchValue === "") {
				alert("검색어를 입력해주세요.");
				$(".list-search-box input").focus();
			}
			else {
				page = 0;
				showList(searchValue);
				$(".list.inquire-list>li, .list.inquire-list>div").remove();
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
