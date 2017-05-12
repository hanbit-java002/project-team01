require([
	"common",
], function() {

	//탈퇴 완료 버튼 클릭 시
	<!-- 탈퇴 완료 팝업창 -->
	$(".btn-delete").on("click", function() {
		$(".popup-delete-box").show();

		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
		$(".popup-delete-box").css("z-index", "31");
	});

	$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-delete-box").hide();

		$(".dark-layer").hide();
		$("body").css("overflow", "");
		$(".popup-delete-box").css("z-index", "");
	});


	//취소 버튼 클릭 시
	$(".btn-cancel").on("click", function() {
		history.back();
	});
});
