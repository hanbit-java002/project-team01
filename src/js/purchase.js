require([
	"common",
], function() {

	//거래 방식 선택 (싱글)
	$(".trade-select").on("click", function(event) {
		event.stopPropagation();

		if( $(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
		else {
			$(".trade-select").removeClass("selected");
			$(this).addClass("selected");
		}


		if(!$(".trade-select").hasClass("selected")) {
			$(".alert-text").show();
			$(".trade-select.btn-direct").focus();
		}
		else {
			$(".alert-text").hide();
		}


		if($(".trade-select.btn-direct").hasClass("selected")) {
			$(".trade-details").show();
		}
		else if($(".trade-select.btn-delivery").hasClass("selected")) {
			$(".trade-details").hide();
		}

	});

});
