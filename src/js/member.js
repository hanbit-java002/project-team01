require([
	"common",
], function() {
	$(".admin-menu>ul>li").on("click", function() {
		var menu = $(this).attr("menu");

		location.href = "/admin/" + menu + ".html";
	});
	function showSection(section, jqElement, handler) {
		$("section").hide();
		$(section).show();

		handler(section, jqElement);
	}

	function initMgmt(handler) {
		$(".btn-admin-file").on("click", function() {
			var btn = $(this);
			var fileInputId = btn.attr("for");
			var fileInput = $("#" + fileInputId);

			fileInput.off("change");
			fileInput.on("change", function() {
				try {
					var fileReader = new FileReader();

					fileReader.onload = function(event) {
						var tmpImgId = "tmp-" + fileInputId;
						btn.html("<img id='" + tmpImgId + "'>");

						$("#" + tmpImgId).attr("src", event.target.result);
					};

					fileReader.readAsDataURL(this.files[0]);
				}
				catch (e) {
					btn.text($(this).val());
					return;
				}
			});

			fileInput.click();
		});

		$(".btn-admin-add").on("click", function() {
			showSection(".admin-add", null, handler);
		});

		$(".btn-admin-cancel").on("click", function() {
			showSection(".admin-list", null, handler);
		});

		showSection(".admin-list", null, handler);
	}

	return {
		initMgmt: initMgmt,
		showSection: showSection,
	};
});
