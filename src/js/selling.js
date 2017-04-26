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

		if(!$(".trade-info .trade-select").hasClass("selected")) {
			$(".alert-text.trade").text("* 거래 방식은 1개 이상 선택되어야 합니다");
			$(".trade-select.btn-direct").focus();
		}
		else if($(".trade-info .trade-select").hasClass("selected")) {
			$(".alert-text.trade").text("");
		}


		if($(".trade-select.btn-direct").hasClass("selected")) {
			$(".trade-details").show();
		}
		else if($(".trade-select.btn-delivery").hasClass("selected")) {
			$(".trade-details").hide();
		}
	});





	//판매 등록 버튼 클릭 시 확인 팝업 창
	$(".btn-ok").on("click", function() {
		common.popUp("pop-up-series", "left");
		$(".pop-up-series").addClass("register");
		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "30%");
		$(".pop-up-series>.text1").text("판매 상품을 등록하시겠습니까?");
		$(".pop-up-series>.text2").text("");
	});

	//취소 버튼 클릭 시 취소확인 팝업 창
	$(".btn-cancel").on("click", function() {
		common.popUp("pop-up-series", "left");
		$(".pop-up-series").addClass("register-cancel");
		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "15%");
		$(".pop-up-series>.text1").text("판매 등록을 취소하시겠습니까?");
		$(".pop-up-series>.text2").text("취소시, 작성하던 글은 저장되지 않습니다.");
	});

	// 드롭다운 메뉴들
	$(".dropdown-menu>li").on("click", function () {
		var value = $(this).children().text();
		var sValue =$(this).attr("value");
		$(this).parents(".dropdown").find(".dropdown-selected").text(value);
		$(this).parents(".dropdown").find(".dropdown-selected").attr("s-value", sValue);
	});

	//팝업 선택 후 처리

	$(".popup-ok").on("click", function () {
		//등록 취소
		if ($(this).parent().hasClass("register-cancel")) {
			location.href = window._ctx.root+"/index.html";
		}
		//등록
		else if ($(this).parent().hasClass("register")) {

		}
	});

	function initBrand() {
		$.ajax({
			url: window._ctx.root+"/api/brand/list",
			success: function(data) {
				for (var i = 0; i<data.length; i++) {
					var item = data[i];
					var brandId = item.brand_id;
					var brandName = item.brand_name;

				}
			},
		});
	}

});
