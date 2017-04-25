require([
	"common",
], function() {

	$(".menu-category>ul>li").on("click", function() {
		var menu = $(this).attr("menu-category-detail");
		location.href = window._ctx.root + "/admin/admin-" + menu + ".html";
	});

	$(".resell-btn.add").on("click", function() {
		showSection(".admin-add");
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
			$("#add-category_name").val("");
			$("#add-category_name").focus();
		}
		else if (section === ".admin-update") {
			var categoryId = jqElement.attr("category-id");
			$.ajax({
				url: window._ctx.root + "/api/admin/category/" + categoryId,
				success: function(item) {
					$("#upt-category_id").val(item.category_id);
					$("#upt-category_name").val(item.category_name);
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
			url: window._ctx.root + "/api/admin/category/list",
			success: function(list) {
				var itemHTML = "";

				for (var i=0; i<list.length; i++) {
					var item = list[i];

					itemHTML += "<tr category-id='" + item.category_id + "'>";
					itemHTML += "<td>" + (i+1) + "</td>";
					itemHTML += "<td>" + item.category_id + "</td>";
					itemHTML += "<td>" + item.category_name + "</td>";
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
		var categoryName = $("#add-category_name").val().trim();

		if (categoryName === "") {
			alert("카테고리명을 입력하세요.");
			$("#add-category_name").focus();
			return;
		}

		$.ajax({
			url: window._ctx.root + "/api/admin/category/add",
			data: {
				categoryName: categoryName,
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
		var categoryName = $("#upt-category_name").val().trim();

		if (categoryName === "") {
			alert("카테고리명을 입력하세요.");
			$("#upt-category_name").focus();
			return;
		}

		var categoryId = $("#upt-category_id").val();

		$.ajax({
			url: window._ctx.root + "/api/admin/category/" + categoryId,
			method: "PUT",
			data: {
				categoryName: categoryName,
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
		var categoryId = $("#upt-category_id").val();

		$.ajax({
			url: window._ctx.root + "/api/admin/category/" + categoryId,
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
