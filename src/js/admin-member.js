require([
	"common",
], function() {

	/*-----list 불러오기-----*/
	function loadList() {
		$.ajax({
			url: window._ctx.root + "/api/admin/member/list",
			success: function(list) {
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

				$(".admin-member-list table>tbody>tr").on("click", function() {
					var userUid = $(this).attr("uid");
					location.href = window._ctx.root + "/admin/admin-update-member.html?uid=" + userUid;
				});
			},
		});
	}

	loadList();
});
