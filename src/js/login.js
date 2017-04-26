require([
	"common",
], function() {
	$(".btn-login").on("click", function() {
		signIn();
	});

	function signIn() {
		var userId = $("#member-email").val();
		var userPw = $("#member-pw").val();

		var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		if (!userId.match(regExp)) {
			alert("이메일 주소로 입력하세요");
			return;
		}

		$.ajax({
			url: window._ctx.root+"/api/member/signIn",
			method: "POST",
			data: {
			userId: userId,
			userPw: userPw,
		},
		success: function (data) {
			if (data.result == "ok") {
			alert("로그인 되셨습니다.");
				location.href = window._ctx.root+"/index.html";
			}
			else {
				alert("정상적으로 로그인되지 않았습니다.");
			}
		},
		error: function (jqXHR) {
				alert(jqXHR.responseJSON.message);
			},
		});
	}
});
