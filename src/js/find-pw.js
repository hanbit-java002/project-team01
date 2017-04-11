require([
	"common",
], function() {

	//찾기 버튼 클릭 시
	<!-- 메일 인증 발송 팝업창 -->
	$(".btn-find").on("click", function() {
		$(".popup-find-pw-box").show();

		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
		$(".popup-find-pw-box").css("z-index", "31");
	});

	$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-find-pw-box").hide();

		$(".dark-layer").hide();
		$("body").css("overflow", "");
		$(".popup-find-pw-box").css("z-index", "");
	});
});
