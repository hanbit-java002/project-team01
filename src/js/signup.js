require([
	"common",
], function() {

	//인증 버튼 클릭 시
	<!-- 메일 인증 발송 팝업창 -->
	$(".btn-verify").on("click", function() {
		$(".popup-email-verify-box").show();

		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
		$(".popup-email-verify-box").css("z-index", "31");
	});

	$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-email-verify-box").hide();

		$(".dark-layer").hide();
		$("body").css("overflow", "");
		$(".popup-email-verify-box").css("z-index", "");
	});
});
