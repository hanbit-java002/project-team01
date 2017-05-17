require([
	"common",
], function() {
	var common = require("common");

	/* 인증 버튼 클릭 시
	 메일 인증 발송 팝업창*/
	$(".btn-verify").on("click", function() {
		var userEmail = $("#input-email").val();
		$.ajax({
			url: window._ctx.root+"/api/member/emailConfirmMail",
			method: "POST",
			data: {
				userEmail: userEmail,
			},
			success: function (result) {
				if (result.result === "ok") {
					common.popUp("popup-email-verify-box", "top");
				}
			},
			error: function (jqXHR) {
				alert(jqXHR.responseJSON.message);
			},

		});

	});

	/*  인증번호 확인*/
	$(".btn-confirm").on("click", function () {
		var cfm = $("#input-code").val();
		$.ajax({
			url: window._ctx.root+"/api/member/emailConfirm",
			method: "POST",
			data: {
				cfm: cfm,
			},
			success: function (result) {
				if (result.result === "ok") {
					$("#input-code").attr("disabled", "");
					alert("확인 되었습니다.");
				}
			},
			error: function (jqXHR) {
				$("#input-code").val("");
				$("#input-code").removeAttr("disabled", "");
				alert(jqXHR.responseJSON.message);
			},

		});
	});

	$(".btn-addr-search").on("click", function () {
		alert("직접입력하세요.");
	});

	function signUp() {
		var userId = $("#input-email").val();
		var userCodeCfm = $("#input-code").attr("disabled");
		var userPw = $("#input-pw").val().trim();
		var userPwCfm = $("#input-pw-conf").val();
		var userName = $("#input-name").val().trim();
		var userPhone = $("#input-phone-num").val().trim();
		var userAddr = $("#input-addr").val();
		var userAddrDetail = $("#input-detail-addr").val();
		var userZipcode = $("#input-zip-code").val();

		var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

		var phoneRegExp = new RegExp("^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$", "g");

		if (!userId.match(regExp)) {
			alert("정확한 이메일 주소를 입력하세요.");
			$("#input-email").focus;
			common.fnMove("#input-email");
			return;
		}

		else if (userCodeCfm !== "disabled") {
			alert("인증번호를 입력하세요.");
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

		else if (!userPhone.match(phoneRegExp)) {
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
				if (data.result === "ok") {
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


	//sign up 버튼 클릭 시
	$(".btn-signup").on("click", function () {
		signUp();
	});

	//취소 버튼 클릭 시
	$(".btn-cancel").on("click", function() {
		history.back();
	});


});
