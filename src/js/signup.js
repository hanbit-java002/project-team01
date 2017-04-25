require([
	"common",
], function() {
	var common = require("common");

	/* 인증 버튼 클릭 시
	 메일 인증 발송 팝업창*/
	$(".btn-verify").on("click", function() {
		common.popUp("popup-email-verify-box", "top");
	});

	function signUp() {
		var userId = $("#input-email").val();
		var userPw = $("#input-pw").val();
		var userPwCfm = $("#input-pw-conf").val();
		var userName = $("#input-name").val();
		var userPhone = $("#input-phone-num").val();
		var userAddr = $("#input-addr").val();
		var userAddrDetail = $("#input-detail-addr").val();
		var userZipcode = $("#input-zip-code").val();

		var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

		if (!userId.match(regExp)) {
			alert("이메일 주소로 입력하세요");
			$("#input-email").focus;
			return;
		}
		if (userPwCfm !== userPw) {
			alert("비밀번호가 일치하지 않습니다.");
			$("#input-pw").val("");
			$("#input-pw-conf").val("");
			location.href=".input-pw";
			$("#input-pw").focus;
			return;
		}

		$.ajax({
			url: window._ctx.root+"/api/member/signUp",
			method: "POST",
			data: {
				userId: userId,
				userPw: userPw,
				userName: userName,
				userPhone: userPhone,
				userAddr: userAddr,
				userAddrDetail: userAddrDetail,
				userZipcode: userZipcode,
			},
			success: function (data) {
				if (data.result == "ok") {
					alert("회원가입이 되셨습니다.");
					location.href = window._ctx.root+"/member/login.html";
				}
				else {
					alert("회원가입이 되지 않았습니다.");
				}
			},
			error: function (jqXHR) {
				alert(jqXHR.responseJSON.message);
			},
		});
	}

	$(".btn-signup").on("click", function () {
		signUp();
	});


});
