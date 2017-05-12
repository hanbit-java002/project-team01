require([
	"common",
], function() {
	var common = require("common");
	var productId= common.getQuerystring("product");
	var beforeMain ="";

	function initTypes() {
		var brandSelected= $(".dropdown-brand .dropdown-selected").text();
		var categorySelected= $(".dropdown-category .dropdown-selected").text();

		if (brandSelected == "NIKE" && categorySelected == "신발") {
			initSeries();
		}
		if (!(categorySelected == "기타")) {
			var sizeHTML ="";

			if (categorySelected == "신발") {
				for (var i=0; i<19; i++) {
					var shoeSize = (210+i*5);
					sizeHTML += "<li value=\""+shoeSize+"\"><a>";
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
				sizeHTML += "<li value=\"xsmall\"><a>xsmall 이하</a></li>";
				sizeHTML += "<li value=\"small\"><a>small</a></li>";
				sizeHTML += "<li value=\"medium\"><a>medium</a></li>";
				sizeHTML += "<li value=\"large\"><a>large</a></li>";
				sizeHTML += "<li value=\"xlarge\"><a>xlarge</a></li>";
				sizeHTML += "<li value=\"xxlarge\"><a>xxlarge 이상</a></li>";
			}
			else if (categorySelected == "하의") {
				for (var i=0; i<14; i++) {
					var bottomSize = (23+i);
					sizeHTML += "<li value=\""+bottomSize+"\"><a>";
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
	}

	function initProduct() {
		$.ajax({
			url: window._ctx.root+"/api/market/getProduct",
			data: {
				productId: productId,
			},
			success: function (result) {
				var data = result.product;
				var img = result.productImg;
				var valid = result.valid;

				if (valid === "no") {
					alert("수정권한이 없습니다.");
					location.herf =window._ctx.root+"market.html?brand-id=brand-all";
				}
				else {
					$("#input-name").val(data.user_name);
					$("#input-phone-num").val(data.phone_num);
					$("#input-product-name").val(data.product_name);
					$(".dropdown-brand .dropdown-selected").text(data.brand_name);
					$(".dropdown-brand .dropdown-selected").attr("s-value", data.brand_id);
					$(".dropdown-category .dropdown-selected").text(data.category_name);
					$(".dropdown-category .dropdown-selected").attr("s-value", data.category_id);

					if (data.series_id !== undefined && data.series_id !== "" && data.series_id !== null) {
						$(".dropdown-series").show();
						$(".dropdown-series .dropdown-selected").text(data.series_name);
						$(".dropdown-series .dropdown-selected").attr("s-value", data.series_id);
					}

					if (data.size !== undefined && data.size !== "" && data.size !== null) {
						$(".dropdown-size").show();
						$(".dropdown-size .dropdown-selected").text(data.size);
						$(".dropdown-size .dropdown-selected").attr("s-value", data.size);
					}

					if (data.quality === "new") {
						$(".dropdown-quality .dropdown-selected").text("새상품");
					}
					else {
						$(".dropdown-quality .dropdown-selected").text("중고");
					}

					$(".dropdown-quality .dropdown-selected").attr("s-value", data.quality);
					$("#input-price").val(data.price);

					if (data.description !== undefined && data.description !== "" && data.description !== null) {
						$("#input-details").val(data.description);
					}
					else {
						$("#input-details").val("");
					}

					for (var j = 0; j <img.length; j++) {
						var imgHtml ="<div class=\"input-img-box ";
						if (img[j].img_main) {
							imgHtml+= "main-img";
						}
							imgHtml+="\" img-id=\"";
							imgHtml+=img[j].img_id;
							imgHtml+=	"\">";
							imgHtml+=	"<div class=\"input-img\""+
							" style=\"background-image: url("+img[j].img_url+")\">" +
							"<div class=\"img-delete\">"+
							"<i class=\"glyphicon glyphicon-remove-circle\"></i>" +
							"</div>" +
							"</div>";
						$(".img-input-slider").append(imgHtml);
					}
					beforeMain = $(".input-img-box.main-img").attr("img-id");
					deleteImg();
					selectMainImg();

					var dealMeans = data.deal_means.split("|");
					for (var j=0; j<dealMeans.length; j++) {
						var dealType = dealMeans[j];

						if (dealType === "direct") {
							$(".btn-direct").addClass("selected");
						}
						if (dealType === "delivery") {
							$(".btn-delivery").addClass("selected");
						}
					}
					if ($(".btn-direct").hasClass("selected")) {
						$(".direct-place").show();
					}
					else if ($(".btn-direct").hasClass("selected")) {
						$(".delivery-check").show();
					}

					if (data.direct_place !== undefined && data.direct_place !== "" && data.direct_place !== null) {
						$("#input-place-time").val(data.direct_place);
					}
					if (data.delivery_check === "include") {

						$(".delivery-check-btn").addClass("selected");
					}

					if (data.safe_deal) {
						$(".trade-select.safe-pay").addClass("selected");
					}

					if (data.selling_status === "selling") {
						$(".product-selling").addClass("selected");
					}
					else if (data.selling_status === "processing") {
						$(".product-processing").addClass("selected");
					}
					else {
						$(".product-complete").addClass("selected");
					}
					initTypes();
				}
			},
		});

	}

	initProduct();

	/* 진행상황 하나만 고르기*/
	$(".status-select").on("click", function () {
		$(".status-select").removeClass("selected");
		$(this).addClass("selected");
	});


	function insertSellerInfo() {
		$.ajax({
			url: window._ctx.root+"/api/member/getUserInfo",
			success: function (data) {
				/*m.uid, m.user_id, m.user_name, m.user_rank, d.phone_num, d.addr, d.addr_detail, d.zip_code*/
				var nameHTML = "<input class=\"input-default\" id=\"input-name\" type=\"text\" value=\"" +
					data.user_name +
					"\" disabled>";
				$(".seller-name").append(nameHTML);
				var phoneHTML = "<input class=\"input-default\" id=\"input-phone-num\" type=\"text\" value=\"" +
					data.phone_num +
					"\" disabled>";
				$(".seller-phone").append(phoneHTML);
			},
		});
	}

	insertSellerInfo();


	//거래 방식 선택
	$(".trade-select").on("click", function(event) {
		event.stopPropagation();

		if( $(this).hasClass("selected")) {
			$(this).removeClass("selected");
		}
		else {
			$(this).addClass("selected");
		}

		if(!$(".trade-btns .trade-select").hasClass("selected")) {
			$(".alert-text.trade").text("* 거래 방식은 1개 이상 선택되어야 합니다");
			$(".trade-select.btn-direct").focus();
		}
		else if($(".trade-info .trade-select").hasClass("selected")) {
			$(".alert-text.trade").text("");
		}

		if($(".trade-select.btn-direct").hasClass("selected")) {
			$(".direct-place").show();
		}
		else {
			$("#input-place-time").val("");
			$(".direct-place").hide();
		}
		if($(".trade-select.btn-delivery").hasClass("selected")) {
			$(".delivery-check").show();
		}
		else {
			$(".delivery-check-btn").removeClass("selected");
			$(".delivery-check").hide();
		}


	});

	// 드롭다운 메뉴들
	function dropDown(className) {
		$(className+" .dropdown-menu>li").off();
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
				$(".dropdown-series .dropdown-selected").removeAttr("s-value");
				$(".dropdown-series .dropdown-selected").text("Series");
				$(".dropdown-series").hide();
			}
			if (className == ".dropdown-category") {
				$(".dropdown-size .dropdown-selected").removeAttr("s-value");
				$(".dropdown-size .dropdown-selected").text("Size");
			}

			if (!(categorySelected == "기타")) {
				$(".dropdown-size").show();
				var sizeHTML ="";

				if (categorySelected == "신발") {
					for (var i=0; i<19; i++) {
						var shoeSize = (210+i*5);
						sizeHTML += "<li value=\""+shoeSize+"\"><a>";
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
					sizeHTML += "<li value=\"xsmall\"><a>xsmall 이하</a></li>";
					sizeHTML += "<li value=\"small\"><a>small</a></li>";
					sizeHTML += "<li value=\"medium\"><a>medium</a></li>";
					sizeHTML += "<li value=\"large\"><a>large</a></li>";
					sizeHTML += "<li value=\"xlarge\"><a>xlarge</a></li>";
					sizeHTML += "<li value=\"xxlarge\"><a>xxlarge 이상</a></li>";
				}
				else if (categorySelected == "하의") {
					for (var i=0; i<14; i++) {
						var bottomSize = (23+i);
						sizeHTML += "<li value=\""+bottomSize+"\"><a>";
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



	function selectMainImg() {
		$(".input-img-box").off("click");
		$(".input-img-box").on("click", function() {
			$(".input-img-box").removeClass("main-img");
			$(this).addClass("main-img");
		});
	}

	function defaultMainImg() {
		/* 여러번 실행되는거 설정 해야함*/
		$($(".input-img-box")[0]).off("change");
		$($(".input-img-box")[0]).addClass("main-img");
	}

	var arrDelImgId = new Array(0);

	function deleteImg() {
		$(".img-delete").off("click");
		$(".img-delete").on("click", function() {
			if ($(this).parents(".input-img-box").hasClass("main-img")) {
				defaultMainImg();
			}

			var isOld= $(this).parents(".input-img").css("background-image").match("/api/file/");
			if (isOld) {
				arrDelImgId.push($(this).parents(".input-img-box").attr("img-id"));
			}

			$(this).parents(".input-img-box").remove();
		});
	}

	var _imgIdIndex = 0;

	function readURL(input) {
		for (var i = 0; i<input[0].files.length; i++ ) {
			if (input[0].files && input[0].files[i]) {
				var reader = new FileReader();
				reader.onload = function (e) {
					var imgId = "new-image-" + _imgIdIndex++;

					$(".img-input-slider").append("<div class='input-img-box' img-id='" + imgId + "'>" +
						"<div class='input-img' style='background-image: url("+e.target.result+")'>" +
						"<div class='img-delete'>"+
						"<i class='glyphicon glyphicon-remove-circle'></i>" +
						"</div>" +
						"</div>");
					deleteImg();
					selectMainImg();
				};
				reader.readAsDataURL(input[0].files[i]);
			}
		}
	}


	function getMainImg() {
		var images = $(".input-img-box.main-img");
		var mainImg = "default";

		if (beforeMain !== images.attr("img-id")) {
			mainImg = images.attr("img-id");
		}

		return mainImg;
	}

	function scrapImgs() {
		var arrStrImgSrc = new Array(0);
		var images = $(".input-img");

		for (var i=0; i<images.length; i++) {
			var strImgSrcLen=$(images[i]).css("background-image").length;
			var isOld= $(images[i]).css("background-image").match("/api/file/");
			if (!isOld) {
				var strImgSrc = $(images[i]).css("background-image").substring(5, (strImgSrcLen-3));
				arrStrImgSrc.push(strImgSrc);
			}
		}
		return arrStrImgSrc;
	}

	/* 파일 읽는 부분 바뀌었을 때*/
	$("#file-img-input").on("change", function () {
		readURL($(this));
	});

	function getDealMeans() {
		var dealMeans = "";
		if ($(".btn-direct").hasClass("selected")) {
			dealMeans+= "direct|";
		}
		if ($(".btn-delivery").hasClass("selected")) {
			dealMeans+= "delivery";
		};
		return dealMeans;
	}

	function currentValues() {
		var currentProduct = {
			productId: productId,
			arrImgSrc: scrapImgs(),
			arrDelImgId: arrDelImgId,
			mainImg: getMainImg(),
			beforeMainImg: beforeMain,
			name: $("#input-product-name").val().trim(),
			brandId: $(".dropdown-brand .dropdown-selected").attr("s-value"),
			categoryId: $(".dropdown-category .dropdown-selected").attr("s-value"),
			sizeId: $(".dropdown-size .dropdown-selected").attr("s-value"),
			seriesId: $(".dropdown-series .dropdown-selected").attr("s-value"),
			qualityId: $(".dropdown-quality .dropdown-selected").attr("s-value"),
			price: $("#input-price").val().trim(),
			detail: $("#input-details").val(),
			dealMeans: getDealMeans(),
			directPlace: $("#input-place-time").val().trim(),
			safeDeal: $(".safe-pay").hasClass("selected"),
			deliveryCheck: $(".delivery-check-btn").hasClass("selected")?"include":"exclude",
			status: $(".status-select.selected").attr("status"),
		};

		var formData = new FormData();
		formData.append("productId", currentProduct.productId);
		formData.append("name", currentProduct.name);
		formData.append("brandId", currentProduct.brandId);
		formData.append("categoryId", currentProduct.categoryId);
		formData.append("sizeId", currentProduct.sizeId);
		formData.append("seriesId", currentProduct.seriesId);
		formData.append("price", currentProduct.price);
		formData.append("detail", currentProduct.detail);

		for (var i=0; i<currentProduct.arrImgSrc.length; i++) {
			formData.append("arrImgSrc", currentProduct.arrImgSrc[i]);
		}
		for (var i=0; i<currentProduct.arrDelImgId.length; i++) {
			formData.append("arrDelImgId", currentProduct.arrDelImgId[i]);
		}
		formData.append("beforeMainImg", currentProduct.beforeMainImg);
		formData.append("mainImg", currentProduct.mainImg);

		formData.append("dealMeans", currentProduct.dealMeans);
		formData.append("directPlace", currentProduct.directPlace);
		formData.append("safeDeal", currentProduct.safeDeal);
		formData.append("qualityId", currentProduct.qualityId);
		formData.append("seriesId", currentProduct.seriesId);
		formData.append("deliveryCheck", currentProduct.deliveryCheck);
		formData.append("status", currentProduct.status);
		console.log(currentProduct);
		return formData;
	}

	function validImgs() {
		var images = $(".input-img").length;
		if (images<=0) {
			return 1;
		}
		return 0;
	}

	validImgs();
	function infoValidation() {
		var currentProduct = {
			productId: productId,
			name: $("#input-product-name").val().trim(),
			brandId: $(".dropdown-brand .dropdown-selected").attr("s-value"),
			categoryId: $(".dropdown-category .dropdown-selected").attr("s-value"),
			sizeId: $(".dropdown-size .dropdown-selected").attr("s-value"),
			seriesId: $(".dropdown-series .dropdown-selected").attr("s-value"),
			qualityId: $(".dropdown-quality .dropdown-selected").attr("s-value"),
			price: $("#input-price").val().trim(),
			detail: $("#input-details").val(),
			dealMeans: getDealMeans(),
			directPlace: $("#input-place-time").val().trim(),
			safeDeal: $(".safe-pay").hasClass("selected"),
			deliveryCheck: $(".delivery-check-btn").hasClass("selected")?"include":"exclude",
			status: $(".status-select.selected").attr("status"),
		};

		if (currentProduct.name ==="" || currentProduct.name === undefined) {
			alert("이름을 입력하세요.");
			return 0;
		}
		if (currentProduct.brandId ==="" || currentProduct.brandId === undefined) {
			alert("Brand을 입력하세요.");
			return 0;
		}
		if (currentProduct.categoryId ==="" || currentProduct.categoryId === undefined) {
			alert("Category을 입력하세요.");
			return 0;
		}
		if (($(".dropdown-category .dropdown-selected").text() === "신발")
			&& ($(".dropdown-brand .dropdown-selected").text() ==="NIKE")) {
			if (currentProduct.seriesId =="" || currentProduct.seriesId === undefined) {
				alert("Series을 입력하세요.");
				return 0;
			}
		}
		if (!($(".dropdown-category .dropdown-selected").text() === "기타")) {
			if (currentProduct.sizeId =="" || currentProduct.sizeId === undefined) {
				alert("Size을 입력하세요.");
				return 0;
			}
		}
		if (currentProduct.qualityId ==="" || currentProduct.qualityId === undefined) {
			alert("Quality을 입력하세요.");
			return 0;
		}
		if (currentProduct.price ==="" || currentProduct.price === undefined) {
			alert("Price을 입력하세요.");
			return 0;
		}
		if (validImgs()) {
			alert("이미지를 입력하세요");
			return 0;
		}
		if (currentProduct.dealMeans ==="" || currentProduct.dealMeans === undefined) {
			alert("거래방식을 하나이상 선택하세요");
			return 0;
		}
		else {
			if ($(".btn-direct").hasClass("selected")) {
				if (currentProduct.directPlace ==="" || currentProduct.directPlace === undefined) {
					alert("거래장소를 입력하세요");
					return 0;
				}
			}
		}

	}

	//판매 등록 버튼 클릭 시 확인 팝업 창
	$(".btn-ok").on("click", function() {
		common.popUp("pop-up-series", "left");
		$(".pop-up-series").addClass("register");
		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "30%");
		$(".pop-up-series>.text1").text("판매 상품을 수정하시겠습니까?");
		$(".pop-up-series>.text2").text("");
		var valid = infoValidation();
		if (valid === 0) {
			$(".popup-close").click();
		}

	});

	//취소 버튼 클릭 시 취소확인 팝업 창
	$(".btn-cancel").on("click", function() {
		common.popUp("pop-up-series", "left");
		$(".pop-up-series").addClass("register-cancel");
		$(".pop-up-series").css("position", "fixed");
		$(".pop-up-series>span").css("top", "15%");
		$(".pop-up-series>.text1").text("판매 수정을 취소하시겠습니까?");
		$(".pop-up-series>.text2").text("취소시, 작성하던 글은 저장되지 않습니다.");
	});

	//팝업 선택 후 처리

	$(".popup-ok").on("click", function () {
		//물품 등록 취소
		if ($(this).parent().hasClass("register-cancel")) {
			location.href = window._ctx.root+"/index.html";
		}
		//물품 등록
		else if ($(this).parent().hasClass("register")) {
			var formData = currentValues();
			if (formData === 0) {
				return;
			}
			console.log(formData);
			$.ajax({
				url: window._ctx.root+"/api/market/selling-update",
				method: "POST",
				data: formData,
				processData: false,
				contentType: false,
				success: function(data) {
					if (data.result == "ok") {
						alert("수정완료");
						/*location.href= window._ctx.root+"/market/market-detail.html?product="+productId;*/
					}
					else {
						alert("저장실패");
					}
				},
			});
		}
	});

	dropDown(".dropdown-quality");
	initBrand();
	initCategory();
	initSeries();


});
