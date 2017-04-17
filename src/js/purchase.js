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
			$(".alert-text1").show();
			$(".trade-select.btn-direct").focus();

			$(".selected-direct").hide();
			$(".selected-delivery").hide();
			$(".alert-text2").hide();
			$(".alert-text3").hide();
		}
		else {
			$(".alert-text1").hide();
			$(".alert-text2").hide();
		}


		if($(".trade-select.btn-direct").hasClass("selected")) {
			if( $(".td-direct").text() === "불가") {
				$(".alert-text2").text("해당 상품은 직접 거래가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").hide();
				$(".selected-delivery").hide();
			}
			else if( $(".td-escrow").text() === "불가") {
				$(".alert-text2").text("해당 상품은 안심 거래가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").show();
				$(".selected-delivery").hide();
			}
			else {
				$(".alert-text2").hide();
				$(".alert-text3").show();

				$(".selected-direct").show();
				$(".selected-delivery").hide();
			}
		}
		else if($(".trade-select.btn-delivery").hasClass("selected")) {
			if( $(".td-delivery").text() === "불가") {
				$(".alert-text2").text("해당 상품은 택배 거래가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").hide();
				$(".selected-delivery").hide();
			}
			else if( $(".td-escrow").text() === "불가") {
				$(".alert-text2").text("해당 상품은 안심 거래가 불가합니다.").show();
				$(".alert-text3").hide();

				$(".selected-direct").hide();
				$(".selected-delivery").show();
			}
			else {
				$(".alert-text2").hide();
				$(".alert-text3").show();

				$(".selected-direct").hide();
				$(".selected-delivery").show();
			}
		}

	});




});
