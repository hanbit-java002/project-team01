require([
	"common",
], function() {
	var common = require("common");

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "selling-all") {
			$(".selling-list .all-selected").css("display", "none");
			$(".selling-list>section.selling-processing").css("display", "none");
			$(".selling-list>section.selling-complete").css("display", "none");
			$(".selling-list>section.selling-all").css("display", "block");
		}
		else if ($(jqElement).attr("menu-category-detail") === "selling-processing") {
			$(".selling-list .all-selected").css("display", "block");
			$(".selling-list>section.selling-all").css("display", "none");
			$(".selling-list>section.selling-complete").css("display", "none");
			$(".selling-list>section.selling-processing").css("display", "block");
			common.listSelector();
		}
		else if ($(jqElement).attr("menu-category-detail") === "selling-complete") {
			$(".selling-list .all-selected").css("display", "none");
			$(".selling-list>section.selling-all").css("display", "none");
			$(".selling-list>section.selling-processing").css("display", "none");
			$(".selling-list>section.selling-complete").css("display", "block");
		}
	};

	$(".menu-category>ul>li").on("click", function () {
		common.navigate(this, naviHandler);
	});


	//팝업 레이어 "취소" 버튼 클릭시
	$(".dark-layer, .popup-btn-area>.btn-cancel").on("click", function () {
		initPopUp();
	});

	// "거래 취소" 버튼 팝업
	$(".half.resell-btn.selling-cancel").on("click", function() {
		$(".popup-layer.selling-cancel").show();
		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
	});

	//"거래 취소" 버튼의 "확인" 버튼 클릭시
	$(".selling-cancel>.popup-btn-area>.btn-ok").on("click", function () {
		initPopUp();
		location.href = window._ctx.root + "/mypage/selling-list.html";
		// 판매리스트>"거래 중" 탭으로 이동
	});

	// "판매 완료" 버튼 팝업
	$(".resell-btn.selling-complete").on("click", function() {
		$(".popup-layer.selling-complete").show();
		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
	});

	//"판매 완료" 버튼의 "확인" 버튼 클릭시
	$(".selling-complete>.popup-btn-area>.btn-ok").on("click", function() {
		initPopUp();
		location.href = window._ctx.root + "/mypage/selling-list.html";
		// 판매리스트>"거래 중" 탭으로 이동
	});

	function initPopUp() {
		$(".popup-layer").hide();
		$(".dark-layer").hide();
		$("body").css("overflow", "");
	}
});
