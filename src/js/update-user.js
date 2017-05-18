require([
	"common",
], function() {
	var common = require("common");


	/* default 유저 정보 가져오기 */
	function loadUserData() {
		var uid = common.getQuerystring("uid");

		$("#member-name").val("");
		$("#member-phone-num").val("");
		$("#member-address").val("");
		$("#member-addr-detail").val("");
		$("#member-zip-code").val("");

		$("#member-email").val("");

		$.ajax({
			url: window._ctx.root + "/api/member/" + uid,
			method: "GET",
			success: function(data) {
				$("#member-name").val(data.user_name);
				$("#member-phone-num").val(data.phone_num);
				$("#member-address").val(data.addr);
				$("#member-addr-detail").val(data.addr_detail);
				$("#member-zip-code").val(data.zip_code);

				$("#member-email").val(data.user_id);

				//var pw = data.user_pw;
				//alert(pw + " load");
			},
		});
	}


	/* 회원 정보 수정 */
	function update() {
		var userUid = common.getQuerystring("uid");

		var userName = $("#member-name").val().trim();
		var userPhoneNum = $("#member-phone-num").val().trim();
		var userAddr = $("#member-address").val().trim();
		var userAddrDetail = $("#member-addr-detail").val().trim();
		var userZipCode = $("#member-zip-code").val().trim();

		var modifyPw = $("#modify-pw").val().trim();
		var modifyPwConf = $("#modify-pw-conf").val().trim();


		//var regExpPH = /^\d{3}\d{3,4}\d{4}$/;
		var phoneRegExp = new RegExp("^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$", "g");

		if (!userPhoneNum.match(phoneRegExp)) {
			$(".alert-text").text("");
			$("#member-phone-num").focus();
			//$(".alert-text.t1").text("*휴대폰 번호를 정확하게 입력하세요. (공백 또는 - 없이)");
			$(".alert-text.t1").text("-을 포함하여 휴대폰 번호를 정확하게 입력하세요.");
			return;
		}
		else if(modifyPwConf !== modifyPw ) {
			$(".alert-text").text("");
			$("#member-pw-conf").focus();
			$(".alert-text.t2").text("*변경할 비밀번호와 동일하게 입력하세요.");
			return;
		}
		else {
			$(".alert-text").text("");

			//비밀번호 변경하지 않았을 때
			if(modifyPw === null || modifyPw === "") {
				$.ajax({
					url: window._ctx.root + "/api/member/" + userUid,
					method: "PUT",
					data: {
						userName: userName,
						userPhoneNum: userPhoneNum,
						userAddr: userAddr,
						userAddrDetail: userAddrDetail,
						userZipCode: userZipCode,

					},
					success: function() {
						$(".popup-update-box").show();

						$(".dark-layer").show();
						$("body").css("overflow", "hidden");
						$(".popup-update-box").css("z-index", "31");
					},
					error: function(jqXHR) {
						alert(jqXHR.responseJSON.message);
					},
				});
			}
			else {	//비밀번호 변경했을 때
				$.ajax({
					url: window._ctx.root + "/api/member/" + userUid,
					method: "POST",
					data: {
						modifyPw: modifyPw,
						userName: userName,
						userPhoneNum: userPhoneNum,
						userAddr: userAddr,
						userAddrDetail: userAddrDetail,
						userZipCode: userZipCode,
					},
					success: function() {
						$(".popup-update-box").show();

						$(".dark-layer").show();
						$("body").css("overflow", "hidden");
						$(".popup-update-box").css("z-index", "31");
					},
					error: function(jqXHR) {
						alert(jqXHR.responseJSON.message);
					},
				});

			}

		}


	}


	loadUserData();

	//업데이트 버튼 클릭 시
	<!-- 수정 완료 팝업창 -->
	$(".btn-update").on("click", function() {
		update();
	});

	$(".dark-layer, .popup-contents>.btn-ok").on("click", function () {
		$(".popup-update-box").hide();
		location.reload(true);

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

	//회원탈퇴 팝업 확인 버튼 클릭 시
	$(".popup-apply-leave-box>.popup-contents>.btn-ok").on("click", function() {
		var uid = common.getQuerystring("uid");

		location.href = window._ctx.root + "/member/delete-user.html?uid=" + uid;		//회원탈퇴 페이지로
	});



	//취소 버튼 클릭 시
	$(".btn-cancel").on("click", function() {
		history.back();
	});
});
