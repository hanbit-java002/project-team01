require([
	"common",
], function() {
	var common= require("common");

	/*function settingURL() {
		var tabMenuId = $(".menu-category>ul .active").attr("menu-category-detail");
		var url = window._ctx.root + "admin/admin-product.html";
		url += "?tabMenuId=" + tabMenuId;
		location.href = url;
	}*/

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "complete") {
			$(".admin-product .all-selected").css("display", "none");
			$(".admin-product>section.processing").css("display", "none");
			$(".admin-product>section.complain").css("display", "none");
			$(".admin-product>section.complete").css("display", "block");
		}
		else if ($(jqElement).attr("menu-category-detail") === "processing") {
			$(".admin-product>section.complete").css("display", "none");
			$(".admin-product>section.complain").css("display", "none");
			$(".admin-product>section.processing").css("display", "block");
			$(".admin-product .all-selected").css("display", "block");
			common.listSelector();
		}
		else if ($(jqElement).attr("menu-category-detail") === "complain") {
			$(".admin-product>section.complete").css("display", "none");
			$(".admin-product>section.processing").css("display", "none");
			$(".admin-product>section.complain").css("display", "block");
			$(".admin-product .all-selected").css("display", "block");
			common.listSelector();
		}
	};

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
