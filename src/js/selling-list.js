require([
	"common",
], function() {
	var common = require("common");
	var rowsPerPage = 5;
	var page =0;

	/* 검색 버튼*/
	$(".selling-search-btn").on("click", function () {
		$(".selling-product-list").html("");
		showList();
	});



	/* 물품관리 버튼 눌렀을때 팝업*/
	function clickProductController() {
		/* 팝업을 취소 했을 때 설정*/
		$(".popup-close, .dark-layer").on("click", function () {
			/* 초기화*/
			$(".pop-up-controller-main").show();
			$(".popup-status").hide();
			$(".pop-up-delete").hide();
			$(".status-select").removeClass("selected");
		});

		$(".selling-product-controller").off();
		$(".selling-product-controller").on("click", function (event) {
			event.stopPropagation();
			var productId = $(this).parents(".product-listInfo-list").attr("product-id");
			var sellerUid = $(this).parents(".product-listInfo-list").attr("seller-uid");
			console.log(productId);

			/* 스태터스 초기 값 세팅*/
			var status = $(this).parents(".product-listInfo-list").attr("process");
			if (status === "selling") {
				$(".product-selling").addClass("selected");
			}
			else if (status === "processing") {
				$(".product-processing").addClass("selected");
			}
			else {
				$(".product-complete").addClass("selected");
			}


			common.popUp("pop-up-controller", "left");
			/* 수정하기*/
			$(".controller-edit").on("click", function () {
				location.href = window._ctx.root + "/selling/update-selling.html?product=" + productId;
			});
			/* 삭제하기*/
			$(".controller-delete").on("click", function () {
				$(".pop-up-controller-main").hide();
				$(".popup-status").hide();
				$(".pop-up-delete").show();

				$(".controller-delete-cancel").on("click", function () {
					$(".pop-up-delete").hide();
					$(".popup-status").hide();
					$(".pop-up-controller-main").show();
				});
				$(".controller-delete-ok").on("click", function () {
					$.ajax({
						url: window._ctx.root+"/api/market/delete",
						method: "POST",
						data: {
							productId: productId,
							sellerUid: sellerUid,
						},
						success: function(data) {
							if (data.result === "ok") {
								alert("삭제 완료");
								location.href = window._ctx.root+"/mypage/selling-list.html";
							}
							else {
								alert("판매자가 아닙니다 삭제가 불가능합니다.");
							}
						},
					});
				});
			});


			/* 진행상황*/
			var statusSelectBefore = $(".status-select.selected").attr("status");
			$(".controller-process").on("click", function () {
				$(".pop-up-delete").hide();
				$(".pop-up-controller-main").hide();
				$(".popup-status").show();

				/* 진행 취소 버튼 눌렀을 떼*/
				$(".controller-process-cancel").on("click", function () {
					$(".status-select").removeClass("selected");
					$(".status-select[status=\""+statusSelectBefore+"\"]").addClass("selected");
					$(".pop-up-delete").hide();
					$(".pop-up-controller-main").show();
					$(".popup-status").hide();
				});

				/* 진행 오케이 버튼 눌렀을 떼*/
				$(".controller-process-ok").on("click", function () {
					var statusSelect = $(".status-select.selected").attr("status");
					$.ajax({
						url: window._ctx.root+"/api/market/updateStatus",
						data: {
							productId: productId,
							statusSelect: statusSelect,
							statusSelectBefore: statusSelectBefore,
						},
						success: function () {
							alert("진행상황이 수정되었습니다.");
							location.href = window._ctx.root+"/mypage/selling-list.html";
						},
					});
				});
			});
		});
	}

	/* 리스트 클릭 처리처리*/
	function clickList() {
		$(".product-listInfo-list").on("click", function() {
			var productId=$(this).attr("product-id");
			var status=$(this).attr("process");
			console.log(status);
			console.log(productId);
			if (status === "selling") {
				location.href = window._ctx.root+"/market/market-detail.html?product="+productId;
			}
			else if (status === "blind") {
				alert("블라인드 된 게시물입니다.");
			}
			else {
				location.href = window._ctx.root+
					"/mypage/selling-detail.html?product="+productId+"&status="+status;
			}

		});
	}

	/* 리스트 보여주기*/
	function showList() {
		var searchValue=$(".selling-search").val();
		console.log(searchValue);
		$.ajax({
			url: window._ctx.root + "/api/market/sellingList",
			data: {
				page: page,
				rowsPerPage: rowsPerPage,
				searchValue: searchValue,
			},
			success: function (result) {
				var listCount = result.listCount;
				var list = result.list;
				$(".product-count>span").text(listCount);
				var lastPage = parseInt(listCount / rowsPerPage)
					+ (listCount % rowsPerPage === 0 ? 0 : 1)-1;
				console.log("마지막페이지"+lastPage);
				var productList ="";
				for (var i=0; i<list.length; i++) {
					var item = list[i];

					productList += "<li class=\"product-listInfo-list\" product-id=\""+item.product_id+"" +
						"\" process=\""+item.selling_status+"\" seller-uid = \""+item.seller_uid+"\">";
					productList += "    <div class=\"product-info\">";
					productList += "        <img class=\"product-img\" src=\""+item.img_url+"\">";
					productList += "        <div class=\"detail-info\">";
					productList += "            <div class=\"product name\">";
					productList += 						item.product_name;
					productList += "            </div>";
					productList += "            <div class=\"product price\">";
					productList += "                <i class=\"fa fa-won\"></i>";
					productList += 				common.numberWithCommas(item.price);
					productList += "            </div>";
					productList += "            <div class=\"product size\">";
					productList += 					item.size;
					if (item.category_name === "신발") {
						productList += 	"mm";
					}
					else if (item.category_name === "허리") {
						productList += 	"inch";
					}
					productList += "            </div>";
					productList += "            <div class=\"product quality\">";
					if (item.quality === "new") {
						productList += 	"새상품";
					}
					else if (item.quality === "used") {
						productList += 	"중고";
					}
					productList += "            </div>";
					productList += "            <ul class=\"product dealing-mode\">";

					var dealMeans = item.deal_means.split("|");
					for (var j=0; j<dealMeans.length; j++) {
						var dealType = dealMeans[j];

						if (dealType === "direct") {
							productList += "<li class=\"dealing-mode directly\">";
							productList += "직접거래";
							productList += "</li>";
						}
						if (dealType === "delivery") {
							productList += "<li class=\"dealing-mode delivery\">";
							productList += "택배거래";
							productList += "</li>";
						}
					}

					if (item.safe_deal === 1) {
						productList += "<li class=\"dealing-mode safety\">";
						productList += "안심결제";
						productList += "</li>";
					}

					productList += "            </ul>";
					if (item.purchaser_name !== undefined) {
						productList += "            <div class=\"purchaser-info\">";
						productList += "                <div class=\"info-label\">구매자</div>";

						productList += "                <div class=\"purchaser-rank ";
						if (item.user_rank === "member") {
							productList +=	"fa fa-star-o\"></div>";
						}
						else if (item.user_rank === "silver") {
							productList +=	"fa fa-star\"></div>";
						}
						else if (item.user_rank === "gold") {
							productList +=	"fa fa-diamond\"></div>";
						}
						else if (item.user_rank === "admin") {
							productList +=	"fa fa-user-circle-o\"></div>";
						}
						else if (item.user_rank === "blackList") {
							productList +=	"fa fa-frown-o\"></div>";
						}

						productList += "                <div class=\"purchaser-name\">";
						productList += item.purchaser_name;
						productList += "                </div>";
						productList += "            </div>";
					}

					productList += "        </div>";
					productList += "    </div>";
					productList += "    <div class=\"board-info\">";
					productList += "        <div class=\"like\">";
					productList += "            <span class='fa fa-heart-o'></span>";

					if (item.like_count === undefined) {
						productList +="0";
					}
					else {
						productList +=item.like_count;
					}

					productList += "        </div>";
					productList += "        <div class=\"comment\">";
					productList += "            <span class=\"fa fa-commenting-o\"></span>";
					if (item.comment_count === undefined) {
						productList +="0";
					}
					else {
						productList += item.comment_count;
					}
					productList += "        </div>";
					productList += "        <div class=\"complain\">";
					productList += "            <span class=\"fa fa-thumbs-o-down\"></span>";

					if (item.complain_count === undefined) {
						productList +="0";
					}
					else {
						productList += item.complain_count;
					}
					productList += "        </div>";
					productList += "        <div class=\"hits\">";
					productList += "            <span class=\"fa fa-eye\"></span>";

					if (item.hits_count === undefined) {
						productList +="0";
					}
					else {
						productList += item.hits_count;
					}

					productList += "        </div>";
					productList += "        <div class=\"reporting-date\">";
					productList += "            <span class=\"fa fa-clock-o\"></span>";
					productList += common.getFormatDate(item.update_date);
					productList += "        </div>";
					productList += "    </div>";
					productList += "<div class=\"selling-product-controller\">";
					productList += "<i class=\"fa fa-cog\"></i>";
					productList += "</div>";
					productList += "</li>";
				}
				$(".selling-product-list").append(productList);
				clickList();
				/* 더보기 클릭시*/
				$(".more-list").off();
				$(".more-list").on("click", function () {
					++page;
					if (page<=lastPage) {
						showList();
					}
					else {
						alert("마지막 물품입니다.");
					}
				});
				clickProductController();
			},
		});
	}

	/* 진행상황 하나만 고르기*/
	$(".status-select").on("click", function () {
		$(".status-select").removeClass("selected");
		$(this).addClass("selected");
	});

	showList();
});
