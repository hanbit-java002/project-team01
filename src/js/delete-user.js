require([
	"common",
], function() {
	var common = require("common");


	/* default 유저 정보 가져오기 */
	function loadUserData() {
		var uid = common.getQuerystring("uid");

		$("#member-name").val("");
		$("#member-phone-num").val("");

		$.ajax({
			url: window._ctx.root + "/api/member/" + uid,
			method: "GET",
			success: function(data) {
				$("#member-name").val(data.user_name);
				$("#member-phone-num").val(data.phone_num);

				//var pw = data.user_pw;
				//alert(pw + " load");
			},
		});
	}


	/* 회원 정보 수정 */
	function deleteUser() {
		var userUid = common.getQuerystring("uid");

		var userPw = $("#member-pw").val();
		//var deleteReson = $("#member-reason").val().trim();


		$.ajax({
			url: window._ctx.root + "/api/member/delete",
			method: "POST",
			data: {
				userUid: userUid,
				userPw: userPw,
			},
			success: function() {
				$(".popup-delete-box").show();

				$(".dark-layer").show();
				$("body").css("overflow", "hidden");
				$(".popup-delete-box").css("z-index", "31");

			},
			error: function(jqXHR) {
				alert(jqXHR.responseJSON.message);
			},
		});

	}


	loadUserData();


	//탈퇴 완료 버튼 클릭 시
	<!-- 탈퇴 완료 팝업창 -->
	$(".btn-delete").on("click", function() {
		deleteUser();
	});

	$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-delete-box").hide();
		location.href = window._ctx.root + "/index.html";

		$(".dark-layer").hide();
		$("body").css("overflow", "");
		$(".popup-delete-box").css("z-index", "");
	});


	//취소 버튼 클릭 시
	$(".btn-cancel").on("click", function() {
		history.back();
	});
});
