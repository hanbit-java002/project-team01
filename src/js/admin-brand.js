require([
	"common",
], function() {
	var rowsPerPage = 2;
	var pagesPerPaging = 3;
	var currentPage = 1;

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
			loadList(currentPage);
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
	function loadList(currentPage) {
		$.ajax({
			url: window._ctx.root + "/api/admin/brand/list",
			data: {
				currentPage: currentPage,
				rowsPerPage: rowsPerPage,
			},
			success: function(result) {
				var list = result.list;
				var count = result.count;
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

				// for Paging
				var firstPage = 1;
				var lastPage = parseInt(count / rowsPerPage)
					+ (count % rowsPerPage === 0 ? 0 : 1);
				// count : DB에 저장된 총 store 개수

				var pagingHTML = "";

				//맨 처음으로 가기
				pagingHTML += "<li page='" + firstPage + "'>";
				pagingHTML += "<a href='#'><i class='fa fa-angle-double-left'></i></a></li>";

				//하단 paging step에 시작&끝 페이지 구하기
				var startPage = parseInt((currentPage-1) / pagesPerPaging)
					* pagesPerPaging + 1;
				var endPage = Math.min(startPage + (pagesPerPaging - 1), lastPage);

				// 한 칸씩 앞(이전)으로 가기
				if (startPage > 1) {
					pagingHTML += "<li page='" + (startPage - 1) + "'>";
					pagingHTML += "<a href='#'><i class='fa fa-angle-left'></i></a></li>";
				}

				// 현재 페이지 표시 & 페이지 개수
				for (var i=startPage; i<=endPage; i++) {
					pagingHTML += "<li page='" + i + "'";

					if (i === currentPage) {
						pagingHTML += " class='active'";
					}

					pagingHTML += "><a href='#'>" + i + "</a></li>";
				}

				// 한 칸씩 뒤(다음)로 가기
				if (endPage < lastPage) {
					pagingHTML += "<li page='" + (endPage + 1) + "'>";
					pagingHTML += "<a href='#'><i class='fa fa-angle-right'></i></a></li>";
				}

				// 맨 끝으로 가기
				pagingHTML += "<li page='" + lastPage + "'>";
				pagingHTML += "<a href='#'><i class='fa fa-angle-double-right'></i></a></li>";

				$(".admin-brand .paging").html(pagingHTML);

				// Paging 영역의 숫자(page)를 선택할 때 list 불러오기
				$(".paging>li>a").on("click", function(event) {
					event.preventDefault();

					var page = parseInt($(this).parent("li").attr("page"));

					loadList(page);
				});

				//브랜드 정보 update
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

	loadList(currentPage);
});
