require([
	"common",
], function() {

	var common = require("common");

	function loadList() {
		$.ajax({
			url: window._ctx.root + "/api/purchase/list",
			success: function() {
				var itemHTML = "";

					itemHTML += "<div class='product name'>";
					itemHTML += "에어 조던 14 Black Pink New";
					itemHTML += "</div>";
					itemHTML += "<div class='product price'>";
					itemHTML += "<i class='fa fa-won'></i>";
					itemHTML += "200,000";
					itemHTML += "</div>";
					itemHTML += "<div class='product size'>";
					itemHTML += "<div class='info-label'>";
					itemHTML += "Size";
					itemHTML += "</div>";
					itemHTML += "<span for='date'>";
					itemHTML += "235mm";
					itemHTML += "</span>";
					itemHTML += "</div>";
					itemHTML += "<div class='product quality'>";
					itemHTML += "<div class='info-label'>";
					itemHTML += "Quality";
					itemHTML += "</div>";
					itemHTML += "<span for='quality'>";
					itemHTML += "새제품";
					itemHTML += "</span>";
					itemHTML += "</div>";
				$(".detail-info").html(itemHTML);
			},
		});
	}

	//거래 방식 선택 (싱글)
	$(".trade-select-btn").on("click", function(event) {
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

	// "구매" 버튼 팝업
	$(".half.resell-btn.purchase-ok").on("click", function() {
		$(".popup-layer.purchase-complete").show();
		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
	});

	//"취소" 버튼의 "확인" 버튼 클릭시
	$(".purchase-cancel>.popup-btn-area>.btn-ok").on("click", function () {
		initPopUp();
		location.href = window._ctx.root + "/mypage/selling-list.html";
		// 마켓으로 이동
	});

	//"구매" 버튼의 "확인" 버튼 클릭시
	$(".purchase-complete>.popup-btn-area>.btn-ok").on("click", function() {
		initPopUp();
		location.href = window._ctx.root + "/mypage/purchase-detail.html";
		// 구매 상세 정보 페이지로 이동
	});

	function initPopUp() {
		$(".popup-layer").hide();
		$(".dark-layer").hide();
		$("body").css("overflow", "");
	}

	common.listSelector();
	loadList();

});
