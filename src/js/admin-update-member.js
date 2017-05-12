require([
	"common",
], function() {
	var common = require("common");

	//수정 버튼 클릭 시 확인 팝업 창
	$(".btn-update").on("click", function() {
		common.popUp("pop-up-series", "left");
		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>.text1").text("회원 정보를 수정하시겠습니까?");
	});

	//취소 버튼 클릭 시 취소확인 팝업 창
	$(".btn-cancel").on("click", function() {
		common.popUp("pop-up-series", "left");

		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>.text1").text("수정을 취소하시겠습니까?");
	});

	// 드롭다운 메뉴들
	function dropDown() {
		$(".dropdown-menu>li").on("click", function () {
			var value = $(this).children().text();
			var sValue = $(this).attr("value");
			$(this).parents(".dropdown").find(".dropdown-selected").text(value);
			$(this).parents(".dropdown").find(".dropdown-selected").attr("s-value", sValue);
		});
	}

	/* default 유저 정보 가져오기 */
	function loadUserData() {
		var uid = common.getQuerystring("uid");
		$("#userName").val("");
		$("#userId").val("");
		$("#userRank>.dropdown-selected").attr("s-value", "");
		$("#userRank>.dropdown-selected").text("");
		$("#userPhoneNum").val("");
		$("#userAddr").val("");
		$("#userAddrDetail").val("");
		$("#userZipCode").val("");

		$.ajax({
			url: window._ctx.root + "/api/admin/member/" + uid,
			method: "GET",
			success: function(list) {
				$("#userName").val(list.user_name);
				$("#userId").val(list.user_id);
				$("#userRank>.dropdown-selected").attr("s-value", list.user_rank);
				$("#userRank>.dropdown-selected").text(list.user_rank);
				$("#userPhoneNum").val(list.phone_num);
				$("#userAddr").val(list.addr);
				$("#userAddrDetail").val(list.addr_detail);
				$("#userZipCode").val(list.zip_code);


				dropDown();
			},
		});
	}

	/*-----회원 정보 수정-----*/
	$(".pop-up-series .btn.popup-ok").on("click", function() {
		var userUid = common.getQuerystring("uid");
		var userName = $("input#userName[value]").val().trim();
		var userRank = $("#userRank .dropdown-selected").attr("s-value").trim();
		var userPhoneNum = $("input#userPhoneNum[value]").val().trim();
		var userAddr = $("input#userAddr[value]").val().trim();
		var userAddrDetail = $("input#userAddrDetail[value]").val().trim();
		var userZipCode = $("input#userZipCode[value]").val().trim();

		$.ajax({
			url: window._ctx.root + "/api/admin/member/" + userUid,
			method: "PUT",
			data: {
				userName: userName,
				userRank: userRank,
				userPhoneNum: userPhoneNum,
				userAddr: userAddr,
				userAddrDetail: userAddrDetail,
				userZipCode: userZipCode,
			},
			success: function() {
				location.href = window._ctx.root + "/admin/admin-member.html";
			},
			error: function() {
				alert("수정에 실패했습니다.");
			},
		});
	});

	loadUserData();
});
