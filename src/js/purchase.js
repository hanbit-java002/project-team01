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
					$(".trade-info span[for=safety-payment]").text("가능");
				}
				if (item.safe_deal === 0) {
					$(".trade-info span[for=safety-payment]").text("불가");
				}
			},
		});

		$.ajax({
			url: window._ctx.root + "/api/deal/userInfo",
			success: function(result) {
				var address = result.addr + " " + result.addr_detail;
				$(".trade #input-name").attr("value", result.user_name);
				$(".trade #input-phone-num").attr("value", result.phone_num);
				$(".trade #input-zip-code").attr("value", result.zip_code);
				$(".trade #input-addr").attr("value", address);
			},
		});
	}

	// 구매
	function purchase() {
		//"구매" 버튼의 "확인" 버튼 클릭시
		$(".purchase-complete>.popup-btn-area>.btn-ok").on("click", function() {
			var userName = "";
			var phoneNum = "";
			var dealMeans = "";
			var safeDeal = "";
			var directPlace = "";
			var zipcode = "";
			var address = "";

			if($(".trade-select-btn.direct").hasClass("selected")) {
				userName = $(".selected-direct #input-name").val().trim();
				phoneNum = $(".selected-direct #input-phone-num").val().trim();
				dealMeans = "direct";
				if($(".list-selector.escrow").attr("get-checked") === "false") {
					safeDeal = "0";
				}
				else if($(".list-selector.escrow").attr("get-checked") === "true") {
					safeDeal = "1";
				}
				directPlace = $(".selected-direct #input-place").val();
				zipcode = "";
				address = "";
			}
			else if($(".trade-select-btn.delivery").hasClass("selected")) {
				userName = $(".selected-delivery #input-name").val().trim();
				phoneNum = $(".selected-delivery #input-phone-num").val().trim();
				dealMeans = "delivery";
				if($(".list-selector.escrow").attr("get-checked") === "false") {
					safeDeal = "0";
				}
				else if($(".list-selector.escrow").attr("get-checked") === "true") {
					safeDeal = "1";
				}
				directPlace = "";
				zipcode = $(".selected-delivery #input-zip-code").val().trim();
				address = $(".selected-delivery #input-addr").val();
			}


			$.ajax({
				url: window._ctx.root + "/api/deal/purchase/" + productId,
				data: {
					userName: userName,
					phoneNum: phoneNum,
					dealMeans: dealMeans,
					safeDeal: safeDeal,
					directPlace: directPlace,
					zipcode: zipcode,
					address: address,
				},
				success: function() {
					initPopUp();
					location.href = window._ctx.root + "/mypage/purchase-detail.html?product=" + productId;
				},
				error: function() {
					initPopUp();
					alert("로그인을 해주세요.");
				},
			});
		});
	}


	//거래 방식 선택 (싱글)
	$(".trade-select-btn").on("click", function(event) {
		$(".alert-default").css("color", "#242947");

		$("[check-box]").attr("get-checked", "false");
		event.stopPropagation();

		if( $(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
		else {
			$(".trade-select-btn").removeClass("selected");
			$(this).addClass("selected");
		}

		if(!$(".trade-select-btn").hasClass("selected")) {
			$(".alert-default").show();
			$(".trade-select-btn.btn-direct").focus();

			$(".selected-direct").hide();
			$(".selected-delivery").hide();
			$(".alert-text2").hide();
			$(".alert-text3").hide();
		}

		else {
			$(".alert-default").hide();
			$(".alert-text2").hide();
		}

		if($(".trade-select-btn.direct").hasClass("selected")) {

			if( $(".trade-info[detail-info='directly']>span").text() === "불가") {
				$(".alert-text2").text("해당 상품은 직접 거래가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").hide();
				$(".selected-delivery").hide();
			}
			else if($(".trade-info[detail-info='safety-payment']>span").text() === "불가") {
				$(".alert-text2").text("해당 상품은 안심 결제가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").show();
				$(".selected-delivery").hide();
			}
			else {
				$(".alert-text2").hide();
				$(".alert-text3").show();

				$(".selected-direct").show();
				$(".selected-delivery").hide();
			}
		}
		else if($(".trade-select-btn.delivery").hasClass("selected")) {

			if( $(".trade-info[detail-info='delivery']>span").text() === "불가") {
				$(".alert-text2").text("해당 상품은 택배 거래가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").hide();
				$(".selected-delivery").hide();
			}
			else if($(".trade-info[detail-info='safety-payment']>span").text() === "불가") {
				$(".alert-text2").text("해당 상품은 안심 거래가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").hide();
				$(".selected-delivery").show();
			}
			else {
				$(".alert-text2").hide();
				$(".alert-text3").show();

				$(".selected-direct").hide();
				$(".selected-delivery").show();
			}
		}
	});


	//팝업 레이어 취소 버튼 클릭시
	$(".dark-layer, .popup-btn-area>.btn-cancel").on("click", function () {
		initPopUp();
	});

	// "구매 취소" 버튼 팝업
	$(".half.resell-btn.cancel").on("click", function() {
		$(".popup-layer.purchase-cancel").show();
		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
	});

	$(document).on("click", function(event) {
		console.log(event.target);
	});

	// "구매" 버튼 팝업
	$(".half.resell-btn.purchase-ok").on("click", function() {
		console.log(01);
		if ($(".trade-select-btn").hasClass("selected")) {
			console.log(02);
			$(".popup-layer.purchase-complete").show();
			$(".dark-layer").show();
			$("body").css("overflow", "hidden");
		}
		else if (!$(".trade-select-btn").hasClass("selected")) {
			console.log(03);
			$(".alert-default").css("color", "#968279");
		}
	});

	//"취소" 버튼의 "확인" 버튼 클릭시
	$(".purchase-cancel>.popup-btn-area>.btn-ok").on("click", function () {
		initPopUp();
		location.href = window._ctx.root + "/market/market.html?brandId=brand-all";
		// 마켓으로 이동
	});

	//product Info에서 >> 버튼 클릭시 해당 상품 상세 페이지로 이동
	$(".info-body .fa-angle-double-right").on("click", function() {
		location.href = window._ctx.root + "/market/market-detail.html?product=" + productId;
	});

	function initPopUp() {
		$(".popup-layer").hide();
		$(".dark-layer").hide();
		$("body").css("overflow", "");
	}

	common.listSelector();
	loadProductImg();
	loadProductDetail();
	purchase();
});
