require([
	"common",
], function() {
	var common= require("common");
	var rowsPerPage = 5;
	var page =0;


	function initCountLike(productId) {
		$.ajax({
			url: window._ctx.root + "/api/like/count/" + productId,
			success: function (result) {
				$(".product-item-list").find(".like-count").html("<span class='fa fa-heart-o'></span> " + result);
			},
		});
	}

	function initHits(productId) {
		$.ajax({
			url: window._ctx.root + "/api/hits/count/" + productId,
			success: function (data) {
				var hitsHTML = "<div class=\"hits\"><span class=\"fa fa-eye\"></span>"+data+"</div>";

				$(".product-item-list[product-id='" + productId + "'] .hits").replaceWith(hitsHTML);
			},
		});
	}

	function goMarketDetail() {
		$(".product-list>li").off();
		/* 마켓디테일 페이지 이동*/
		$(".product-list>li").on("click", function () {
			var productId= $(this).attr("product-id");
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			$.ajax({
				url: window._ctx.root + "/api/hits/plus/" + productId,
				success: function () {
				},
			});
			var url = window._ctx.root+"/market/market-detail.html";
			url += "?product="+productId;
			location.href =url;
		});
	}

	function showList(menuCategory) {

		$.ajax({
			url: window._ctx.root + "/api/admin/product/list",
			data: {
				menuCategory: menuCategory,
				rowsPerPage: rowsPerPage,
				page: page,
			},
			method: "POST",
			success: function (result) {
				console.log("메뉴카테고리 "+menuCategory);


				var count = result.count;
				var lastPage = parseInt(count / rowsPerPage)
					+ (count % rowsPerPage === 0 ? 0 : 1)-1;
				console.log("마지막페이지"+lastPage);
				var productList ="";
				for (var i=0; i<result.list.length; i++) {
					$(".product-count>span").text(result.list.length);
					var item = result.list[i];

					productList += "<li class=\"product-item-list\" product-id=\""+item.product_id+"" +
						"\" process=\""+item.selling_status+"\">";
					productList += "    <div class=\"product-info\">";
					productList += "        <img class=\"product-img\" src=\""+
						/*window._ctx.root+"/img/jordan1.png"*/item.img_url+"\">";
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
					productList += "            <div class=\"seller-info\">";
					productList += "                <div class=\"info-label\">판매자</div>";

					productList += "                <div class=\"seller-rank ";
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

					productList += "                <div class=\"seller-name\">";
					productList += item.user_name;
					productList += "                </div>";
					productList += "            </div>";
					productList += "        </div>";
					productList += "    </div>";
					productList += "    <div class=\"board-info\">";
					productList += "        <div class=\"like-count\">";
					productList += "        </div>";
					productList += "        <div class=\"comment\">";
					productList += "            <span class=\"fa fa-commenting-o\"></span>";
					productList += "            10";
					productList += "        </div>";
					productList += "        <div class=\"complain\">";
					productList += "            <span class=\"fa fa-thumbs-o-down\"></span>";
					productList += "            10";
					productList += "        </div>";
					productList += "        <div class=\"hits\">";
					productList += "            <span class=\"fa fa-eye\"></span>";
					productList += "            1,0";
					productList += "        </div>";
					productList += "        <div class=\"reporting-date\">";
					productList += "            <span class=\"fa fa-clock-o\"></span>";
					productList += common.getFormatDate(item.update_date);
					productList += "        </div>";
					productList += "    </div>";

					if(menuCategory === "processing" || menuCategory === "complain") {
						productList += "<div class=\"list-selector\" check-box=\"\" name=\"chk\" get-checked=\"false\"></div>";
					}

					productList += "</li>";
					initCountLike(item.product_id);
					initHits(item.product_id);
				}


				$(".product-list").append(productList);

				goMarketDetail();
				/* 더보기 클릭시*/
				$(".more-list").off();
				$(".more-list").on("click", function () {
					var brandId = $(".menu-category li.active").attr("brand-id");
					++page;
					if (page<=lastPage) {
						productListAjax(brandId);
					}
					else {
						alert("마지막 물품입니다.");
					}
				});
			},
			error: function (jqXHR) {
				alert(jqXHR.responseJSON.message + "메뉴: " + menuCategory );
			},
		});
	}



	/*function settingURL() {
		var tabMenuId = $(".menu-category>ul .active").attr("menu-category-detail");
		var url = window._ctx.root + "admin/admin-product.html";
		url += "?tabMenuId=" + tabMenuId;
		location.href = url;
	}*/

	var naviHandler = function (jqElement) {
		var menuCategory = $(jqElement).attr("menu-category-detail");

		/*
		 디폴트 : selling (거래 가능한 상태)
		 거래중 : processing (거래 진행 중인 상태)
		 판매완료 : complete (판매 완료)
		 블라인드 : blind
		 */
		if (menuCategory === "complete") {
			$(".admin-product .all-selected").css("display", "none");
			$(".admin-product>section.processing").css("display", "none");
			$(".admin-product>section.complain").css("display", "none");
			$(".admin-product>section.complete").css("display", "block");
		}
		else if (menuCategory === "processing") {
			$(".admin-product .all-selected").css("display", "block");
			$(".admin-product>section.complete").css("display", "none");
			$(".admin-product>section.complain").css("display", "none");
			$(".admin-product>section.processing").css("display", "block");
			common.listSelector();
		}
		else if (menuCategory === "complain") {
			$(".admin-product .all-selected").css("display", "block");
			$(".admin-product>section.complete").css("display", "none");
			$(".admin-product>section.processing").css("display", "none");
			$(".admin-product>section.complain").css("display", "block");
			common.listSelector();
		}

		/* 리스트 초기화*/
		$(".product-list").html("");
		showList(menuCategory);
	};

	showList("complete");
	$(".menu-category>ul>li").on("click", function() {
		common.navigate(this, naviHandler);
	});


	//팝업 레이어 "취소" 버튼 클릭시
	$(".dark-layer, .popup-btn-area>.btn-cancel").on("click", function () {
		initPopUp();
	});

	// "판매 완료" 버튼 팝업
	$(".resell-btn.sell-complete").on("click", function() {
		$(".popup-layer.selling-complete").show();
		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
	});

	//"판매 완료" 버튼의 "확인" 버튼 클릭시
	$(".selling-complete>.popup-btn-area>.btn-ok").on("click", function() {
		initPopUp();
		location.href = window._ctx.root + "/admin/admin-product.html";
		// 판매 관리>"거래 중" 탭으로 이동
	});

	// "블라인드" 버튼 팝업
	$(".resell-btn.list-blind").on("click", function() {
		$(".popup-layer.list-blind").show();
		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
	});

	//"블라인드" 버튼의 "확인" 버튼 클릭시
	$(".list-blind>.popup-btn-area>.btn-ok").on("click", function() {
		initPopUp();
		location.href = window._ctx.root + "/admin/admin-product.html";
		// 판매 관리>"신고 리스트" 탭으로 이동
	});


	function initPopUp() {
		$(".popup-layer").hide();
		$(".dark-layer").hide();
		$("body").css("overflow", "");
	}

});
