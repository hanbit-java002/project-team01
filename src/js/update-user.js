require([
	"common",
], function() {

	//업데이트 버튼 클릭 시
	<!-- 수정 완료 팝업창 -->
	$(".btn-update").on("click", function() {
		$(".popup-update-box").show();

		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
		$(".popup-update-box").css("z-index", "31");
	});

	$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-update-box").hide();

		$(".dark-layer").hide();
		$("body").css("overflow", "");
		$(".popup-update-box").css("z-index", "");
	});


	//회원탈퇴 클릭 시
	<!-- 탈퇴 신청 확인 팝업창 -->
	$(".apply-leave").on("click", function() {
		$(".popup-apply-leave-box").show();

		$(".dark-layer").show();
		$("body").css("overflow", "hidden");
		$(".popup-apply-leave-box").css("z-index", "31");
	});

	$(".dark-layer, .popup-contents>.btn-cancel, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-apply-leave-box").hide();

		$(".dark-layer").hide();
		$("body").css("overflow", "");
		$(".popup-apply-leave-box").css("z-index", "");
	});

	$(".popup-apply-leave-box>.popup-contents>.btn-ok").on("click", function() {
		location.href = "delete-user.html";
	});
});
