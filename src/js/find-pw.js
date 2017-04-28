require([
	"common",
], function() {

	function findPw() {
		var userEmail = $("#member-email").val();

		var regExpM = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

		if (!userEmail.match(regExpM)) {
			alert("정확한 이메일 주소를 입력하세요.");
			$("#member-email").focus;
			return;
		}

		$.ajax({
			url: window._ctx.root+"/api/member/findPw",
			method: "POST",
			data: {
				userEmail: userEmail,
			},
			success: function (data) {
				if (data.result == "ok") {
					$(".popup-find-pw-box").show();

					$(".dark-layer").show();
					$("body").css("overflow", "hidden");
					$(".popup-find-pw-box").css("z-index", "31");

					$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
						$(".popup-find-pw-box").hide();

						$(".dark-layer").hide();
						$("body").css("overflow", "");
						$(".popup-find-pw-box").css("z-index", "");

						location.href = window._ctx.root+"/member/login.html";
					});
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
	<!-- 메일 인증 발송 팝업창 -->
	$(".btn-find").on("click", function() {
		findPw();
	});

	$(".btn-cancel").on("click", function() {
		location.href = window._ctx.root+"/member/login.html";
	});


});
