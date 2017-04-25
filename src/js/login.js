require([
	"common",
], function() {
	$(".btn-login").on("click", function() {
		signIn();
	});

	function signIn() {
		var userId = $("#member-email").val();
		var userPw = $("#member-pw").val();
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
