require([
	"common",
], function() {
	function loadUserData() {
		var common = require("common");
		$.ajax({
			url: window._ctx.root + "/api/member/signedin",
			success: function(data) {
				/*var itemHTML = "";
				itemHTML += "<span class='title'>회원 탈퇴</span>";
				itemHTML += "<input id='member-name' type='text' value='" + data.userId + "' disabled>";
				itemHTML += "<input id='member-phone-num' type='text' value='" + data.phone_num + "' disabled>";
				itemHTML += "<input id='member-pw' type='password' placeholder='Password'>";
				itemHTML += "<input id='member-reason' type='text' placeholder='탈퇴 사유'>";

				itemHTML += "<button class='btn-bottom btn-delete'>탈퇴 완료</button>";
				itemHTML += "<button class='btn-bottom btn-cancel'>취소</button>";
				$(".delete-user").html(itemHTML);*/
				$("#member-name").val(data.userId);
				$("#member-num").val(data.phone_num);

				/* 버튼 클릭시 password 체크 */
				$(".btn-delete").on("click", function() {
					var passwordVal = $("#member-pw").val().trim();
					var reason = $("#member-reason").val().trim();

					if (passwordVal === "") {
						alert("비밀번호를 입력하세요.");
						$("#member-pw").focus();
						return;
					}
					else if (reason === "") {
						alert("사유를 입력해주세요.");
						$("#member-reason").focus();
						return;
					}
					else {
						var userId = $("#member-name").val();
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
									/*-----회원 정보 수정-----*/
									$.ajax({
										url: window._ctx.root + "/api/admin/member/" + userUid,
										method: "PUT",
										data: {
											userRank: userRank,
										},
										success: function() {
											location.href = window._ctx.root + "/admin/admin-member.html";
										},
										error: function() {
											alert("수정에 실패했습니다.");
										},
									});
									/*탈퇴완료 팝업*/
									common.popUp("popup-delete-box", "top");
								}
								else {
									alert("정상적으로 처리 되지 않았습니다.");
								}
							},
							error: function (jqXHR) {
								alert(jqXHR.responseJSON.message);
							},
						});
					}
				});
			},
		});
	}
	loadUserData();
});
