require([
	"common",
], function() {
	var common = require("common");

	//수정 버튼 클릭 시 확인 팝업 창
	$(".btn-update").on("click", function() {
		common.popUp("pop-up-series", "left");

		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>.text1").text("회원 정보를 수정하시겠습니까?");
	});

	//취소 버튼 클릭 시 취소확인 팝업 창
	$(".btn-cancel").on("click", function() {
		common.popUp("pop-up-series", "left");

		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>.text1").text("수정을 취소하시겠습니까?");
	});
});
