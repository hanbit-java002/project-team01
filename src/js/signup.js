require([
	"common",
], function() {
	/*var common = require("common");*/

	/* 인증 버튼 클릭 시
	 메일 인증 발송 팝업창*/
	/*$(".btn-verify").on("click", function() {
		common.popUp("popup-email-verify-box", "top");
	});*/

	function signUp() {
		var userId = $("#input-email").val();
/*		var userInputCode = $("#input-code").val();*/
		var userPw = $("#input-pw").val();
/*		var userPwCfm = $("#input-pw-conf").val();*/
		var userName = $("#input-name").val();
		var userPhone = $("#input-phone-num").val();
		var userAddr = $("#input-addr").val();
		var userAddrDetail = $("#input-detail-addr").val();
		var userZipcode = $("#input-zip-code").val();

		/*var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

		if (!userId.match(regExp)) {
			alert("정확한 이메일 주소를 입력하세요.");
			$("#input-email").focus;
			common.fnMove("#input-email");
			return;
		}

		else if (userInputCode.length < 6) {
			alert("인증번호 여섯자리를 정확히 입력하세요.");
			$("#input-code").focus;
			common.fnMove("#input-code");
			return;
		}

		else if (userPw.length == 0 || userPw == null) {
			alert("비밀번호를 입력하세요.");
			$("#input-pw").focus;
			common.fnMove("#input-pw");
			return;
		}

		else if (userPwCfm !== userPw) {
			alert("비밀번호가 일치하지 않습니다.");
			$("#input-pw").val("");
			$("#input-pw-conf").val("");
			$("#input-pw").focus;
			common.fnMove("#input-pw");
			return;
		}

		else if (userName === null || userName.length < 3) {
			alert("이름을 바르게 입력하세요.");
			$("#input-name").focus;
			common.fnMove("#input-name");
			return;
		}

		else if (userPhone === null) {
			alert("휴대폰 번호를 입력하세요.");
			$("#input-phone-num").focus;
			common.fnMove("#input-phone-num");
			return;
		}

		else if (userPhone.length < 11 || userPhone.length > 11) {
			alert("휴대폰 번호를 정확하게 입력하세요.");
			$("#input-phone-num").focus;
			common.fnMove("#input-phone-num");
			return;
		}

		else if (userAddr.length == 0) {
			alert("주소를 입력하세요.");
			return;
		}

		else if (userAddrDetail.length == 0) {
			alert("상세주소를 입력하세요.");
			return;
		}

		else if (userZipcode.length == 0) {
			alert("우편번호를 입력하세요.");
			return;
		}

		else if (userZipcode.length > 6 || userZipcode.length < 5) {
			alert("우편번호를 정확히 입력하세요.");
			return;
		}*/



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
