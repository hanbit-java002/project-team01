require([
	"common",
], function() {
	var common = require("common");
	var productId = common.getQuerystring("product");

	/*-----split (list로 리턴)-----*/
	function split(x) {
		return x.split("|");
	}

	/*-----product image 불러오기-----*/
	function loadProductImg() {
		$.ajax({
			url: window._ctx.root + "/api/product/image/" + productId,
			success: function (result) {
				var item = result[0];
				$(".product-img").attr("src", item.img_url);
			},
		});
	}

	/*-----product Detail + 거래 Info 불러오기-----*/
	function loadProductDetail() {
		$.ajax({
			url: window._ctx.root + "/api/product/detail/" + productId,
			success: function(result) {
				console.log(result);
				var item = result.productInfo;
				var itemHTML = "";

				itemHTML += "<div class='product name'>";
				itemHTML += item.product_name;
				itemHTML += "</div>";
				itemHTML += "<div class='product price'>";
				itemHTML += "<i class='fa fa-won'></i>";
				itemHTML += common.numberWithCommas(item.price);
				itemHTML += "</div>";
				itemHTML += "<div class='product size'>";
				itemHTML += "<div class='info-label'>";
				itemHTML += "Size";
				itemHTML += "</div>";
				itemHTML += "<span for='date'>";
				itemHTML += item.size;
				// 사이즈
				if (item.category_name !== undefined && item.category_name.length > 0) {
					if (item.category_name === "신발") {
						itemHTML += "<span> mm</span>";
					}
					if (item.category_name === "하의") {
						itemHTML += "<span> inch</span>";
					}
				}
				itemHTML += "</span>";
				itemHTML += "</div>";
				itemHTML += "<div class='product quality'>";
				itemHTML += "<div class='info-label'>";
				itemHTML += "Quality";
				itemHTML += "</div>";
				itemHTML += "<span for='quality'>";
				// 퀄리티
				if (item.quality !== undefined && item.quality.length > 0) {
					if (item.quality === "used") {
						itemHTML += "중고상품";
					}
					if (item.quality === "new") {
						itemHTML += "새상품";
					}
				}
				itemHTML += "</span>";
				itemHTML += "</div>";

				$(".product-info .detail-info").html(itemHTML);


				// 거래 정보
				var dealMeans = split(item.deal_means);
				var deliveryCheck = item.delivery_check;

				for (var i=0; i<dealMeans.length; i++) {
					var dealType = dealMeans[i];

					if (dealType === "direct") {
						if (item.direct_place === "" || item.direct_place === undefined) {
							$(".detail-info span[for=directly]").text("가능");
						}
						else {
							$(".detail-info span[for=directly]").text(item.direct_place);
						}
					}

					if (dealType === "delivery") {
						if (deliveryCheck === "exclude") {
							$(".detail-info span[for=delivery]").text("택배비 착불");
						}
						if (deliveryCheck === "include") {
							$(".detail-info span[for=delivery]").text("무료 배송");
						}
					}
				}

				if (item.safe_deal === 1) {
					$(".trade-info span[for=safety]").text("가능");
				}
				if (item.safe_deal === 0) {
					$(".trade-info span[for=safety]").text("불가");
				}
			},
		});
	}

	/*-----판매자 정보 불러오기-----*/
	function loadSellerInfo() {
		$.ajax({
			url: window._ctx.root + "/api/product/seller/" + productId,
			success: function(result) {
				console.log(result);
				var sellerInfo = result.sellerInfo;
				var countSell = result.countSell;

				$(".seller-info span[for=name]").text(sellerInfo.user_name);

				// user rank 에 따른 icon 변경
				if (sellerInfo.user_rank !== undefined && sellerInfo.user_rank.length > 0) {
					var userRank = sellerInfo.user_rank;

					$(".seller-info .seller-rank").removeClass();
					if(userRank === "member") {
						$(".seller-info span[for=rank]").html("일반 회원 (총 <span class=\"count-selling\"></span>");
					}
					if(userRank === "silver") {
						$(".seller-info span[for=rank]").html("우수 회원 (총 <span class=\"count-selling\"></span>");
					}
					if(userRank === "gold") {
						$(".seller-info span[for=rank]").html("골드 회원 (총 <span class=\"count-selling\"></span>");
					}
					if(userRank === "admin") {
						$(".seller-info span[for=rank]").html("관리자 (총 <span class=\"count-selling\"></span>");
					}
					if(userRank=== "blackList") {
						$(".seller-info span[for=rank]").html("블랙 리스트 (총 <span class=\"count-selling\"></span>");
					}
				}
				$(".seller-info .count-selling").text(countSell + "건 판매)");


				// 전화 번호 form
				var phoneNum = result.sellerInfo.phone_num;
				var splite = "-";
				var position = ["3", "8"];
				var output = [phoneNum.slice(0, position[0]), splite, phoneNum.slice(position[0])].join("");
				output = [output.slice(0, position[1]), splite, output.slice(position[1])].join("");

				$(".seller-info span[for=contact]").text(output);
			},
		});
	}

	/*-----구매자 정보 불러오기-----*/
	function loadPurchaserInfo() {
		$.ajax({
			url: window._ctx.root + "/api/deal/sellingPurchaser/" + productId,
			success: function (result) {
				console.log(result);
				if (result.user_name === undefined) {
					alert("거래 정보가 없는 품목입니다.");
					location.href = window._ctx.root + "/market/market-detail.html?product="+productId;
				}
				var itemHTML = "";

				itemHTML += "<div class='purchaser-info' detail-info='name'>";
				itemHTML += "<div class='info-label'>";
				itemHTML += "이름";
				itemHTML += "</div>";
				itemHTML += "<span for='name'>";
				itemHTML += result.user_name;
				itemHTML += "</span>";
				itemHTML += "</div>";
				itemHTML += "<div class='purchaser-info' detail-info='contact'>";
				itemHTML += "<div class='info-label'>";
				itemHTML += "연락처";
				itemHTML += "</div>";
				itemHTML += "<span for='contact'>";
				itemHTML += result.phone_num;
				itemHTML += "</span>";
				itemHTML += "</div>";
				itemHTML += "<div class='purchaser-info' detail-info='deal_means'>";
				itemHTML += "<div class='info-label'>";
				itemHTML += "거래 방법";
				itemHTML += "</div>";
				itemHTML += "<span for='deal_means'>";
				if(result.deal_means === "direct") {
					itemHTML += "직접 거래";
				}
				else if (result.deal_means === "delivery") {
					itemHTML += "택배 거래";
				}
				itemHTML += "</span>";
				itemHTML += "</div>";

				if(result.zipcode !== "") {
					itemHTML += "<div class='purchaser-info' detail-info='zipCode'>";
					itemHTML += "<div class='info-label'>";
					itemHTML += "우편 번호";
					itemHTML += "</div>";
					itemHTML += "<span for='zipCode'>";
					itemHTML += result.zipcode;
					itemHTML += "</span>";
					itemHTML += "</div>";
				}

				if(result.address !== "") {
					itemHTML += "<div class='purchaser-info' detail-info='address'>";
					itemHTML += "<div class='info-label'>";
					itemHTML += "주소";
					itemHTML += "</div>";
					itemHTML += "<span for='address'>";
					itemHTML += result.address;
					itemHTML += "</span>";
					itemHTML += "</div>";
				}

				if(result.direct_place !== "") {
					itemHTML += "<div class='purchaser-info' detail-info='direct-place'>";
					itemHTML += "<div class='info-label'>";
					itemHTML += "희망 지역";
					itemHTML += "</div>";
					itemHTML += "<span for='direct-place'>";
					itemHTML += result.direct_place;
					itemHTML += "</span>";
					itemHTML += "</div>";
				}

				$(".purchaser-info .detail-info").html(itemHTML);

				//안심 결제 버튼 display
				if (result.safe_deal) {
					$(".resell-btn.safety-payment").css("display", "block");
				}

			},
			error: function () {
				alert("로그인을 해주세요.");
			}
		});
	}

	//안심 거래 사이트로 이동
	$(".resell-btn.safety-payment").on("click", function() {
		location.href = "https://www.unicro.co.kr/index.jsp";
	});

	//"확인" 버튼 클릭시, 마켓으로 이동
	$(".resell-btn.ok").on("click", function() {
		var statusSelectBefore = "processing";
		var statusSelect= "complete";
		$.ajax({
			url: window._ctx.root+"/api/market/updateStatus",
			data: {
				productId: productId,
				statusSelect: statusSelect,
				statusSelectBefore: statusSelectBefore,
			},
			success: function () {
				alert("구매 완료 되었습니다.");
				location.href = window._ctx.root+"/mypage/selling-list.html";
			},
		});
		/*
		var preURL = document.referrer;

		if(preURL.includes("purchase.html")) {
			location.href = window._ctx.root + "/market/market.html?brandId=brand-all";
		}
		else if(preURL.includes("purchase-list.html")) {
			location.href = window._ctx.root + "/mypage/purchase-list.html";
		}
		else {
			location.href = window._ctx.root + "/market/market.html?brandId=brand-all";
		}*/
	});

	// 상품 문의 버튼 클릭시, 해당 상품 상세 페이지로 이동
	$(".resell-btn.deal-cancel").on("click", function() {
		var statusSelectBefore = "processing";
		var statusSelect= "selling";
		$.ajax({
			url: window._ctx.root+"/api/market/updateStatus",
			data: {
				productId: productId,
				statusSelect: statusSelect,
				statusSelectBefore: statusSelectBefore,
			},
			success: function () {
				alert("구매취소 되었습니다.");
				location.href = window._ctx.root+"/mypage/selling-list.html";
			},
		});
	});

	//product Info에서 >> 버튼 클릭시 해당 상품 상세 페이지로 이동
	$(".info-body .fa-angle-double-right").on("click", function() {
		location.href = window._ctx.root + "/market/market-detail.html?product=" + productId;
	});

	loadProductImg();
	loadProductDetail();
	loadSellerInfo();
	loadPurchaserInfo();
});
