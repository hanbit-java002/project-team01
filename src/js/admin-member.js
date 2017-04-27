require([
	"common",
], function() {
	var rowsPerPage = 2;
	var pagesPerPaging = 3;
	var currentPage = 1;

	// 드롭다운 메뉴 & Rank 필터링
	$(".dropdown-menu>li").on("click", function () {
		var value = $(this).children().text();
		var sValue = $(this).attr("value");
		$(this).parents(".dropdown").find(".dropdown-selected").text(value);
		$(this).parents(".dropdown").find(".dropdown-selected").attr("s-value", sValue);

		loadList(currentPage);
	});


	/*-----list 불러오기-----*/
	function loadList(currentPage) {
		var sValue = $("#userRank>.dropdown-selected").attr("s-value");

		$.ajax({
			url: window._ctx.root + "/api/admin/member/list",
			data: {
				currentPage: currentPage,
				rowsPerPage: rowsPerPage,
				sValue: sValue,
			},
			success: function(result) {
				var list = result.list;
				var count = result.count;

				var itemHTML = "";

				for (var i=0; i<list.length; i++) {
					var item = list[i];

					itemHTML += "<tr uid='" + item.uid + "'>";
					itemHTML += "<td>" + item.user_name + "</td>";
					itemHTML += "<td>" + item.user_id + "</td>";
					itemHTML += "<td>" + item.user_rank + "</td>";
					itemHTML += "</tr>";
				}
				$(".admin-member-list table>tbody").html(itemHTML);


				// list 총 개수 (result 개수)
				var countHTML = "<div class='product-count'>총 <span>" + count + "</span>건</div>";
				$(".admin.list-header").html(countHTML);


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

				$(".admin-member .paging").html(pagingHTML);

				// Paging 영역의 숫자(page)를 선택할 때 list 불러오기
				$(".paging>li>a").on("click", function(event) {
					event.preventDefault();

					var page = parseInt($(this).parent("li").attr("page"));

					loadList(page);
				});

				console.log(list);
				console.log(count);
				console.log(svalue);

				//회원 리스트 클릭 시, 회원 정보 수정으로 이동
				$(".admin-member-list table>tbody>tr").on("click", function() {
					var userUid = $(this).attr("uid");
					location.href = window._ctx.root + "/admin/admin-update-member.html?uid=" + userUid;
				});
			},
		});
	}

	loadList(currentPage);
});
