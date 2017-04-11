require([
	"common",
], function() {

	//찾기 버튼 클릭 시
	<!-- 메일 주소 확인 팝업창. -->
	$(".btn-find").on("click", function() {
		$(".popup-find-id-box").show();

		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
		$(".popup-find-id-box").css("z-index", "31");
	});

	$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-find-id-box").hide();

		$(".dark-layer").hide();
		$("body").css("overflow", "");
		$(".popup-find-id-box").css("z-index", "");
	});
});
