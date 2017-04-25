require([
	"common",
], function() {

	$(".menu-category>ul>li").on("click", function() {
		var menu = $(this).attr("menu-category-detail");
		location.href = window._ctx.root + "/admin/admin-" + menu + ".html";
	});

	$(".resell-btn.add").on("click", function() {
		showSection(".admin-add", null, handler);
	});

	$(".btn-admin-cancel").on("click", function() {
		showList();
	});


	/*-----handler-----*/
	var handler = function(section, jqElement) {
		if (section === ".admin-list") {
			loadList();
		}
		else if (section === ".admin-add") {
			$("#add-brand_name").val("");
			$("#add-brand_name").focus();
		}
		else if (section === ".admin-update") {
			var brandId = jqElement.attr("brand-id");
			$.ajax({
				url: window._ctx.root + "/api/admin/brand/" + brandId,
				success: function(item) {
					$("#upt-brand_id").val(item.brand_id);
					$("#upt-brand_name").val(item.brand_name);
				},
			});
		}
	};

	/*-----show Section-----*/
	function showSection(section, jqElement, handler) {
		$(".resell-container>section").css("display", "none");
		$(".resell-container>section" + section).css("display", "block");
		handler(section, jqElement);
	}

	/*-----show list-----*/
	function showList() {
		$(".resell-container>section").css("display", "none");
		$(".resell-container>section.admin-list").css("display", "block");
	}

	/*-----list 불러오기-----*/
	function loadList() {
		$.ajax({
			url: window._ctx.root + "/api/admin/brand/list",
			success: function(list) {
				var itemHTML = "";

				for (var i=0; i<list.length; i++) {
					var item = list[i];

					itemHTML += "<tr brand-id='" + item.brand_id + "'>";
					itemHTML += "<td>" + (i+1) + "</td>";
					itemHTML += "<td>" + item.brand_id + "</td>";
					itemHTML += "<td>" + item.brand_name + "</td>";
					itemHTML += "</tr>";
				}
				$(".admin-list table>tbody").html(itemHTML);
				$(".admin-list table>tbody>tr").on("click", function() {
					showSection(".admin-update", $(this), handler);
				});
			},
		});
	}

	/*-----카테고리 추가-----*/
	$(".btn-admin-save").on("click", function() {
		var brandName = $("#add-brand_name").val().trim();

		if (brandName === "") {
			alert("카테고리명을 입력하세요.");
			$("#add-brand_name").focus();
			return;
		}

		$.ajax({
			url: window._ctx.root + "/api/admin/brand/add",
			data: {
				brandName: brandName,
			},
			success: function() {
				showSection(".admin-list", null, handler);
			},
			error: function() {
				alert("저장에 실패했습니다.");
			},
		});
	});

	/*-----카테고리 수정-----*/
	$(".btn-admin-update").on("click", function() {
		var brandName = $("#upt-brand_name").val().trim();

		if (brandName === "") {
			alert("카테고리명을 입력하세요.");
			$("#upt-brand_name").focus();
			return;
		}

		var brandId = $("#upt-brand_id").val();

		$.ajax({
			url: window._ctx.root + "/api/admin/brand/" + brandId,
			method: "PUT",
			data: {
				brandName: brandName,
			},
			success: function() {
				showSection(".admin-list", null, handler);
			},
			error: function() {
				alert("수정에 실패했습니다.");
			},
		});
	});

	/*-----카테고리 삭제-----*/
	$(".btn-admin-delete").on("click", function() {
		var brandId = $("#upt-brand_id").val();

		$.ajax({
			url: window._ctx.root + "/api/admin/brand/" + brandId,
			method: "DELETE",
			success: function() {
				showSection(".admin-list", null, handler);
			},
			error: function() {
				alert("삭제에 실패했습니다.");
			},
		});
	});

	loadList();
});
