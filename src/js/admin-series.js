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
			$("#add-series_name").val("");
			$("#add-series_name").focus();
			getBrandId();
		}
		else if (section === ".admin-update") {
			var seriesId = jqElement.attr("series-id");
			$.ajax({
				url: window._ctx.root + "/api/admin/series/" + seriesId,
				success: function(item) {
					$("#upt-series_id").val(item.series_id);
					$("#upt-series_name").val(item.series_name);
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
			url: window._ctx.root + "/api/admin/series/list",
			success: function(list) {
				var itemHTML = "";

				for (var i=0; i<list.length; i++) {
					var item = list[i];

					itemHTML += "<tr series-id='" + item.series_id + "'>";
					itemHTML += "<td>" + (i+1) + "</td>";
					itemHTML += "<td>" + item.series_id + "</td>";
					itemHTML += "<td>" + item.series_name + "</td>";
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
		var seriesName = $("#add-series_name").val().trim();
		getBrandId();

		if (seriesName === "") {
			alert("카테고리명을 입력하세요.");
			$("#add-series_name").focus();
			return;
		}

		$.ajax({
			url: window._ctx.root + "/api/admin/series/add",
			data: {
				seriesName: seriesName,
				brandId: brandId,
			},
			success: function() {
				showSection(".admin-list", null, handler);
			},
			error: function() {
				alert("저장에 실패했습니다.");
			},
		});
		console.log(brandId);
	});

	/*-----카테고리 수정-----*/
	$(".btn-admin-update").on("click", function() {
		var seriesName = $("#upt-series_name").val().trim();

		if (seriesName === "") {
			alert("카테고리명을 입력하세요.");
			$("#upt-series_name").focus();
			return;
		}

		var seriesId = $("#upt-series_id").val();

		$.ajax({
			url: window._ctx.root + "/api/admin/series/" + seriesId,
			method: "PUT",
			data: {
				seriesName: seriesName,
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
		var seriesId = $("#upt-series_id").val();

		$.ajax({
			url: window._ctx.root + "/api/admin/series/" + seriesId,
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
