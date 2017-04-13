require([
	"common",
], function() {
	var common = require("common");

	//거래 방식 선택
	$(".trade-select").on("click", function(event) {
		event.stopPropagation();

		if( $(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
		else {
			$(this).addClass("selected");
		}

		if(!$(".trade-select").hasClass("selected")) {
			$(".alert-text.trade").text("* 거래 방식은 1개 이상 선택되어야 합니다");
			$(".trade-select.btn-direct").focus();
		}
		else {
			$(".alert-text.trade").text("");
		}


		if($(".trade-select.btn-direct").hasClass("selected")) {
			$(".trade-details").show();
		}
		else if($(".trade-select.btn-delivery").hasClass("selected")) {
			$(".trade-details").hide();
		}

	});


	//결제 방식 선택
	$(".payment-select").on("click", function(event) {
		event.stopPropagation();

		if( $(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
		else {
			$(this).addClass("selected");
		}

		if(!$(".payment-select").hasClass("selected")) {
			$(".alert-text.payment").text("* 결제 방식은 1개 이상 선택되어야 합니다");
			$(".payment-select.btn-escrow").focus();
		}
		else {
			$(".alert-text.payment").text("");
		}


		if($(".payment-select.btn-escrow").hasClass("selected")) {
			$(".payment-details").show();
		}
		else if($(".payment-select.btn-direct").hasClass("selected")) {
			$(".payment-details").hide();
		}
	});


	//판매 등록 버튼 클릭 시 확인 팝업 창
	$(".btn-ok").on("click", function() {
		common.popUp("pop-up-series", "left");

		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "30%");
		$(".pop-up-series>.text1").text("판매 상품을 등록하시겠습니까?");
		$(".pop-up-series>.text2").text("");
	});

	//취소 버튼 클릭 시 취소확인 팝업 창
	$(".btn-cancel").on("click", function() {
		common.popUp("pop-up-series", "left");

		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "15%");
		$(".pop-up-series>.text1").text("판매 등록을 취소하시겠습니까?");
		$(".pop-up-series>.text2").text("취소시, 작성하던 글은 저장되지 않습니다.");
	});

});
