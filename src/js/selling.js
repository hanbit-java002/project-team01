require([
	"common",
], function() {
	var common = require("common");

	//거래 방식 선택
	$(".trade-select").on("click", function(event) {
		event.stopPropagation();

		if( $(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
		else {
			$(this).addClass("selected");
		}

		if(!$(".trade-info .trade-select").hasClass("selected")) {
			$(".alert-text.trade").text("* 거래 방식은 1개 이상 선택되어야 합니다");
			$(".trade-select.btn-direct").focus();
		}
		else if($(".trade-info .trade-select").hasClass("selected")) {
			$(".alert-text.trade").text("");
		}


		if($(".trade-select.btn-direct").hasClass("selected")) {
			$(".trade-details").show();
		}
		else if($(".trade-select.btn-delivery").hasClass("selected")) {
			$(".trade-details").hide();
		}
	});





	//판매 등록 버튼 클릭 시 확인 팝업 창
	$(".btn-ok").on("click", function() {
		common.popUp("pop-up-series", "left");
		$(".pop-up-series").addClass("register");
		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "30%");
		$(".pop-up-series>.text1").text("판매 상품을 등록하시겠습니까?");
		$(".pop-up-series>.text2").text("");
	});

	//취소 버튼 클릭 시 취소확인 팝업 창
	$(".btn-cancel").on("click", function() {
		common.popUp("pop-up-series", "left");
		$(".pop-up-series").addClass("register-cancel");
		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "15%");
		$(".pop-up-series>.text1").text("판매 등록을 취소하시겠습니까?");
		$(".pop-up-series>.text2").text("취소시, 작성하던 글은 저장되지 않습니다.");
	});

	// 드롭다운 메뉴들
	function dropDown(className) {
		$(className+" .dropdown-menu>li").on("click", function () {
			var value = $(this).children().text();
			var sValue =$(this).attr("value");
			$(this).parents(".dropdown").find(".dropdown-selected").text(value);
			$(this).parents(".dropdown").find(".dropdown-selected").attr("s-value", sValue);

			var brandSelected= $(".dropdown-brand .dropdown-selected").text();
			var categorySelected= $(".dropdown-category .dropdown-selected").text();

			if (brandSelected == "NIKE" && categorySelected == "신발") {
				initSeries();
				$(".dropdown-series").show();
			}
			else {
					$(".dropdown-series").hide();
			}
			if (className == ".dropdown-category") {
				$(".dropdown-size .dropdown-selected").text("Size");
			}

			if (!(categorySelected == "기타")) {
				$(".dropdown-size").show();
				var sizeHTML ="";

				if (categorySelected == "신발") {
					for (var i=0; i<19; i++) {
						var shoeSize = (210+i*5);
						sizeHTML += "<li value=\"SZ-shoes-"+shoeSize+"\"><a>";
						if (shoeSize == 210) {
							sizeHTML += shoeSize+" 이하</a></li>";
						}
						else if (shoeSize == 300) {
							sizeHTML += shoeSize+" 이상</a></li>";
						}
						else {
							sizeHTML += shoeSize+"</a></li>";
						}
					}
				}
				else if (categorySelected == "상의") {
					sizeHTML += "<li value=\"SZ-top-xsmall\"><a>xsmall 이하</a></li>";
					sizeHTML += "<li value=\"SZ-top-small\"><a>small</a></li>";
					sizeHTML += "<li value=\"SZ-top-midum\"><a>midum</a></li>";
					sizeHTML += "<li value=\"SZ-top-large\"><a>large</a></li>";
					sizeHTML += "<li value=\"SZ-top-xlarge\"><a>xlarge</a></li>";
					sizeHTML += "<li value=\"SZ-top-xxlarge\"><a>xxlarge 이상</a></li>";
				}
				else if (categorySelected == "하의") {
					for (var i=0; i<14; i++) {
						var bottomSize = (23+i);
						sizeHTML += "<li value=\"SZ-bottom-"+bottomSize+"\"><a>";
						if (bottomSize == 23) {
							sizeHTML += bottomSize+" 이하</a></li>";
						}
						else if (bottomSize == 40) {
							sizeHTML += bottomSize+" 이상</a></li>";
						}
						else {
							sizeHTML += bottomSize+"</a></li>";
						}
					}
				}
				$(".dropdown-size .dropdown-menu").html(sizeHTML);
				dropDown(".dropdown-size");
			}
			else {
				$(".dropdown-size").hide();
			}


		});
	}

	function initSeries() {
		$.ajax({
			url: window._ctx.root+"/api/series/list",
			success: function(data) {
				var seriesHTML = "";
				for (var i = 0; i<data.length; i++) {
					var item = data[i];
					var seriesId = item.series_id;
					var seriesName = item.series_name;
					seriesHTML += "<li value=\""+seriesId+"\"><a>"+seriesName+"</a></li>";
				}
				$(".dropdown-series .dropdown-menu").html(seriesHTML);
				dropDown(".dropdown-series");
			},
		});
	}

	function initBrand() {
		$.ajax({
			url: window._ctx.root+"/api/brand/list",
			success: function(data) {
				var brandHTML = "";
				for (var i = 0; i<data.length; i++) {
					var item = data[i];
					var brandId = item.brand_id;
					var brandName = item.brand_name;
					brandHTML += "<li value=\""+brandId+"\"><a>"+brandName+"</a></li>";
				}
				$(".dropdown-brand .dropdown-menu").html(brandHTML);
				dropDown(".dropdown-brand");
			},
		});
	}

	function initCategory() {
		$.ajax({
			url: window._ctx.root+"/api/category/list",
			success: function(data) {
				var categoryHTML = "";
				for (var i = 0; i<data.length; i++) {
					var item = data[i];
					var categoryId = item.category_id;
					var categoryName = item.category_name;
					categoryHTML += "<li value=\""+categoryId+"\"><a>"+categoryName+"</a></li>";
				}
				$(".dropdown-category .dropdown-menu").html(categoryHTML);
				dropDown(".dropdown-category");

			},
		});
	}

	var arrImg = new Array(1);

	function deleteImg() {
		$(".img-delete").off("click");
		$(".img-delete").on("click", function() {
			$(this).parents(".input-img-box").remove();
		});
	}

	function readURL(input) {
		for (var i = 0; i<input[0].files.length; i++ ) {
			if (input[0].files && input[0].files[i]) {
				var reader = new FileReader();
				reader.onload = function (e) {
					$(".img-input-slider").append("<div class='input-img-box main-img'>" +
						"<div class='input-img' style='background-image: url("+e.target.result+")'>" +
							"<div class='img-delete'>"+
								"<i class='glyphicon glyphicon-remove-circle'></i>" +
							"</div>" +
						"</div>");
					deleteImg();
				};
				reader.readAsDataURL(input[0].files[i]);
			}
		}
	}


	$("#file-img-input").on("change", function () {
		readURL($(this));
		for (var i = 0; i<arrImg.length; i++) {
			if (arrImg[i] != undefined) {
				console.log(arrImg[i]);
			}
		}
	});

	var arrStrImgSrc = new Array(1);

	function currnetValues() {
		scrapImgs();
	}


	function scrapImgs() {
		var images = $(".input-imgs");

		for (var i=0; i<images.length; i++) {
			var strImgSrcLen=$(images[i]).css("background-image").length;
			var strImgSrc = $(images[i]).css("background-image").substring(5, (strImgSrcLen-3));
			arrStrImgSrc.push(strImgSrc);
		}
	}

	//팝업 선택 후 처리

	$(".popup-ok").on("click", function () {
		//물품 등록 취소
		if ($(this).parent().hasClass("register-cancel")) {
			location.href = window._ctx.root+"/index.html";
		}
		//물품 등록
		else if ($(this).parent().hasClass("register")) {
			currnetValues();
		}
	});


	initBrand();
	initCategory();
	initSeries();


});
