require([
	"common",
	"clipboard",
], function() {
	var common = require("common");
	var productId = common.getQuerystring("product");


	/*----- URL 클립보드 복사-----*/
	function shareLink() {
		var url = location;
		$(".board-setting .board-clipboard").attr("data-clipboard-text", url);
		var Clipboard = require("clipboard");
		var clipboard = new Clipboard(".board-clipboard");
		clipboard.on("success", function() {
			alert("페이지의 주소가 복사되었습니다.");
		});
	}


	/*-----split (list로 리턴)-----*/
	function split(x) {
		return x.split("|");
	}

	/*-----Like 초기 세팅 -----*/
	function initLike() {
		$.ajax({
			url: window._ctx.root + "/api/like/hasLike/" + productId,
			success: function (data) {
				console.log("initLike: " + data.result);
				var likeHTML = "";
				if (data.result) {
					likeHTML = "<div class=\"list-selector like fa fa-heart\"></div>";
				}
				else {
					likeHTML = "<div class=\"list-selector like fa fa-heart-o\"></div>";
				}

				$(".market-detail .list-selector.like").replaceWith(likeHTML);
				selectLike();
			},
		});
	}

	/*-----select Like -----*/
	function selectLike() {
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
							countLike();
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
							countLike();
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
	function countLike() {
		$.ajax({
			url: window._ctx.root + "/api/like/count/" + productId,
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


	/*-----신고 버튼-----*/
	function initComplain() {
		$.ajax({
			url: window._ctx.root + "/api/complain/hasComplain/" + productId,
			success: function (data) {

				console.log("initComplain: " + data.result);

				if (data.result) {
					$(".board-setting .board-complain").addClass("select");
				}
				else {
					$(".board-setting .board-complain").removeClass("select");
				}
			},
		});
	}

	function addComplain() {
		$(".board-setting .board-complain").on("click", function() {
			var select = $(".board-setting .board-complain").hasClass("select").toString();

			if(select === "false") {
				$.ajax({
					url: window._ctx.root + "/api/complain/add/" + productId,
					success: function (data) {
						console.log(data.result);
						if (data.result === "ok") {
							$(".board-setting .board-complain").addClass("select");
							countComplain();
							alert("신고가 완료되었습니다.");
						}
						if (data.result === "no") {
							alert("로그인을 해주세요.");
						}
					},
				});
			}
			if(select === "true") {
				alert("이미 신고한 게시글입니다.");
			}
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
		$.ajax({
			url: window._ctx.root + "/api/hits/count/" + productId,
			success: function (result) {
				console.log(result);
				$(".market-detail .board-info .hits").html("<span class='fa fa-eye'></span> " + result);
			},
		});
	}

	function plusHits() {
		$.ajax({
			url: window._ctx.root + "/api/hits/plus/" + productId,
			success: function () {
				countHits();
			},
		});
	}

	/*-----구매 페이지로 이동-----*/
	$(".resell-btn.purchase").on("click", function() {
		location.href = window._ctx.root + "/purchase/purchase.html?product=" + productId;
	});


	/*-----product img 불러오기-----*/
	function loadProductImg() {
		$.ajax({
			url: window._ctx.root + "/api/product/image/" + productId,
			success: function (result) {
				var itemHTML = "";
				var indicatorsHTML = "";
				var imageLayerHTML = "";
				var layerIndicatorHTML = "";

				for (var i=0; i<result.length; i++) {
					var item = result[i];

					// 상품 이미지
					itemHTML += "<div class=\"item";
					if(i==0) {
						itemHTML += " active";
					}
					itemHTML += "\"> <div class=\"product-img\" style=\"background-image: url('";
					itemHTML += item.img_url;
					itemHTML += "')\"></div>";
					itemHTML += "<div class=\"carousel-caption\"></div>";
					itemHTML += "</div>";


					//상세 이미지 레이어의 이미지
					imageLayerHTML += "<div class=\"item";
					if(i==0) {
						imageLayerHTML += " active";
					}
					imageLayerHTML += "\"><img src='" + item.img_url + "'>";
					imageLayerHTML += "<div class=\"carousel-caption\">";
					imageLayerHTML += "</div>";
					imageLayerHTML += "</div>";


					//indicator
					indicatorsHTML += "<li data-target=\"#market-detail-img-carousel\"";
					indicatorsHTML += " data-slide-to=\"" + i + "\" class=\"";
					if(i==0) {
						indicatorsHTML += " active";
					}
					indicatorsHTML += "\"></li>";


					//상세 이미지 Layer indicator
					layerIndicatorHTML += "<li data-target=\"#img-layer-carousel\"";
					layerIndicatorHTML += " data-slide-to=\"" + i + "\" class=\"";
					if(i==0) {
						layerIndicatorHTML += " active";
					}
					layerIndicatorHTML += "\"></li>";
				}

				$("#market-detail-img-carousel .carousel-inner").html(itemHTML);
				$("#market-detail-img-carousel .carousel-indicators").html(indicatorsHTML);
				$(".product-img-layer .carousel-inner").html(imageLayerHTML);
				$(".product-img-layer .carousel-indicators").html(layerIndicatorHTML);

				/*---show product-img-layer---*/
				$("#market-detail-img-carousel .carousel-inner").on("click", function() {
					$(".product-img-layer").css("display", "block");
					$("body").css("overflow", "hidden");
				});

				$(".product-img-layer .carousel").carousel("pause");

				/*---hide product-img-layer---*/
				$(".product-img-layer .close-icon").on("click", function() {
					$(".product-img-layer").css("display", "none");
					$("body").css("overflow", "");
				});
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
			success: function(result) {

				var item = result.productInfo;
				var sessionUid = result.sessionUid;
				var price = common.numberWithCommas(item.price);
				var date = common.getFormatDate(item.update_date);
				var boardSettingHTML = "";

				// 판매자와 동일한 uid인지 체크
				if (item.seller_uid === sessionUid) {
					boardSettingHTML += "<li class=\"board-update\">수정</li>";
					boardSettingHTML += "<li class=\"board-delete\">삭제</li>";
				}
				else if (item.seller_uid !== sessionUid || sessionUid === "null") {
					boardSettingHTML += "<li class=\"board-complain\">신고</li>";
					boardSettingHTML += "<li class=\"board-clipboard\" data-clipboard-text=\"\">URL</li>";
				}
				$(".market-detail .board-setting>ul").html(boardSettingHTML);
				updateSelling();
				shareLink();
				addComplain();

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

				var dealHTML = "";
				for (var i=0; i<dealMeans.length; i++) {
					var dealType = dealMeans[i];

					if (dealType === "direct") {
						dealHTML += "<div class='directly'>";
						dealHTML += "<line></line>";

						if (item.direct_place === "" || item.direct_place === undefined) {
							dealHTML += "가능";
						}
						else {
							dealHTML += item.direct_place;
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

				//상세 설명
				if (item.description === undefined || item.description === "") {
					$(".market-detail .user-description").text("상세 설명이 없습니다.");
				}
				else {
					$(".market-detail .user-description").html(item.description.replace(/\n/g, "<br>"));
				}

				$(".market-detail .product.name").text(item.product_name);
				$(".market-detail .product.price").html("<i class='fa fa-won'></i>" + price);
				$(".board-info .reporting-date").html("<span class='fa fa-clock-o'></span> " + date);
			},
		});
	}

	// 판매 상품 수정 페이지로 이동
	function updateSelling() {
		$(".board-setting .board-update").on("click", function() {
			location.href = window._ctx.root + "/selling/update-selling.html?product=" + productId;
		});
	}


	loadProductImg();
	loadProductDetail();
	loadSellerInfo();
	loadComment();
	countComment();
	initLike();
	initComplain();
	countLike();
	countComplain();
	plusHits();

});
