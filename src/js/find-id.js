require([
	"common",
], function() {

	function findId() {
		var userName = $("#member-name").val();
		var phoneNum = $("#member-phone-num").val();

		var regExpPH = /^\d{3}\d{3,4}\d{4}$/;

		if (!phoneNum.match(regExpPH)) {
			alert("\n휴대폰 번호를 정확하게 입력하세요. \n(공백 또는 - 없이)");
			$("#member-phone-num").focus();
			return;
		}

		$.ajax({
			url: window._ctx.root+"/api/member/findId",
			method: "POST",
			data: {
				userName: userName,
				phoneNum: phoneNum,
			},
			success: function (data) {

				if (data.result == "ok") {
					$(".popup-find-id-box").show();
					$(".dark-layer").show();
					$("body").css("overflow", "hidden");
					$(".popup-find-id-box").css("z-index", "31");

					$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
						$(".popup-find-id-box").hide();

						$(".dark-layer").hide();
						$("body").css("overflow", "");
						$(".popup-find-id-box").css("z-index", "");

						location.href = window._ctx.root+"/member/login.html";
					});


					$(".user-name").text(userName);
					$(".user-id").text(data.userId);
				}
				else {
					alert("가입된 회원이 아닙니다.");
				}
			},
			error: function (jqXHR) {
				alert(jqXHR.responseJSON.message);
			},
		});
	}


	//찾기 버튼 클릭 시
	<!-- 메일 주소 확인 팝업창. -->
	$(".btn-find").on("click", function() {
		findId();
	});

});
