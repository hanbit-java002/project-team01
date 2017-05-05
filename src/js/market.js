require([
	"common",
], function() {
	var common = require("common");

	var naviHandler = function (jqElement) {
		if ($(jqElement).attr("menu-category-detail") === "ALL") {
			alert("all");
		}
		else if ($(jqElement).attr("menu-category-detail") === "NIKE") {
			alert("nike");
		}
		else if ($(jqElement).attr("menu-category-detail") === "PALACE") {
			alert("palace");
		}
		else if ($(jqElement).attr("menu-category-detail") === "SUPREME") {
			alert("supreme");
		}
	};

	function clickedMenu() {
		$(".menu-category>ul>li").on("click", function () {
			common.navigate(this, naviHandler);
		});
	}

	$(".filter-series").on("click", function() {
		common.popUp("pop-up-series", "top");
	});

	$(".product-inquire").on("click", function () {
		location.href = window._ctx.root + "/mypage/purchase-inqure-view.html";
	});

	/* 드롭다운 리스트*/
	$(".dropdown-size").on("click", function (event) {
		var categorySelected= $(".dropdown-category .dropdown-selected").text();
		if (categorySelected === "Category" || categorySelected === "기타" || categorySelected === "ALL") {
			alert("카테고리를 선택하세요");
			event.stopPropagation();
		}
	});

	// 드롭다운 메뉴들
	function dropdownList() {
		$(".dropdown-menu>li").on("click", function () {
			var isCategory= $(this).parents(".input-style").hasClass("dropdown-category");
			var value = $(this).children().text();
			var sValue =$(this).attr("value");
			$(this).parents(".dropdown").find(".dropdown-selected").text(value);
			$(this).parents(".dropdown").find(".dropdown-selected").attr("s-value", sValue);

			var brandSelected= $(".dropdown-brand .dropdown-selected").text();
			var categorySelected= $(".dropdown-category .dropdown-selected").text();

			if (brandSelected == "NIKE" && categorySelected == "신발") {
				/*initSeries();
				 $(".dropdown-series").show();*/
			}
			else {
				/*$(".dropdown-series .dropdown-selected").removeAttr("s-value");*/
			}
			if (isCategory) {
				$(".dropdown-size .dropdown-selected").removeAttr("s-value");
				$(".dropdown-size .dropdown-selected").text("Size");

				if (categorySelected !== "Category" || categorySelected !=="ALL" || categorySelected === "ALL") {
					var sizeHTML = "<li value=\"size-all\"><a>ALL</a></li>";
					if (categorySelected === "신발") {
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
					else if (categorySelected === "상의") {
						sizeHTML += "<li value=\"xsmall\"><a>xsmall 이하</a></li>";
						sizeHTML += "<li value=\"small\"><a>small</a></li>";
						sizeHTML += "<li value=\"midum\"><a>midum</a></li>";
						sizeHTML += "<li value=\"large\"><a>large</a></li>";
						sizeHTML += "<li value=\"xlarge\"><a>xlarge</a></li>";
						sizeHTML += "<li value=\"xxlarge\"><a>xxlarge 이상</a></li>";
					}
					else if (categorySelected === "하의") {
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
					dropdownList();
				}
			}
		});
	}

	function initCategory() {
		$.ajax({
			url: window._ctx.root+"/api/category/list",
			success: function(data) {
				var categoryHTML = "<li value=\"category-all\"><a>ALL</a></li>";
				for (var i = 0; i<data.length; i++) {
					var item = data[i];
					var categoryId = item.category_id;
					var categoryName = item.category_name;
					categoryHTML += "<li value=\""+categoryId+"\"><a>"+categoryName+"</a></li>";
				}
				$(".dropdown-category .dropdown-menu").html(categoryHTML);
				dropdownList();

			},
		});
	}
	/* 시리즈 선택했을 때 처리*/
	function seriesSelected() {
		$(".pop-up-series li").on("click", function() {
			var seriesId = $(this).attr("s-value");
			var seriesName = $(this).find(".popup-series-name").text();
			$(".filter-series").attr("s-value", seriesId);
			$(".filter-series>span").text(seriesName);
			$(".dark-layer"). click();
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
					if (i ===0) {
						seriesHTML +="<ul>";
					}
					if ("Nike Ect" === seriesName) {
						seriesHTML += "<li s-value='"+seriesId+"'>" +
							"<img src=\""+window._ctx.root+"/img/ect.png\">" +
							"<div class='popup-series-name'>"+seriesName+"</div>" +
							"</li>";
					}
					else {
						seriesHTML += "<li s-value='"+seriesId+"'>" +
							"<img src=\""+window._ctx.root+"/img/jordan"+(i+1)+".png\">" +
							"<div class='popup-series-name'>"+seriesName+"</div>" +
							"</li>";
					}

					if (data.length-1 === i) {
						seriesHTML += "<li s-value='series-all'>" +
							"<img src=\""+window._ctx.root+"/img/icon_all.png\">" +
							"<div class='popup-series-name'>All</div>" +
							"</li>";
						seriesHTML +="</ul>";
						break;
					}

					if (((i+1)%3 === 0) && i !== 0) {
						seriesHTML +="</ul><ul>";
					}
				}
				$(".pop-up-series").prepend(seriesHTML);
				seriesSelected();
			},
		});
	}
	function initBrandAjax() {
		$.ajax({
			url: window._ctx.root+"/api/brand/list",
			success: function(data) {
				var brandHTML = "<li brandId=\"brand-all\" menu-category-detail=\"ALL\">ALL</li>";
				for (var i = 0; i<data.length; i++) {
					var item = data[i];
					var brandId = item.brand_id;
					var brandName = item.brand_name;
					brandHTML += "<li brandId=\""+brandId+"\" menu-category-detail=\""+brandName+"\">"
						+brandName+"</li>";
				}
				$(".menu-category ul").html(brandHTML);
				common.initNavi();
				initBrand();
				clickedMenu();
			},
		});
	}

	function initBrand() {
		var brand=common.getQuerystring("brand");

		$(".menu-category>ul>li").removeClass("active");
		if (brand=== "ALL") {
			$("[menu-category-detail='ALL']").addClass("active");
		}
		else if (brand=== "NIKE") {
			$("[menu-category-detail='NIKE']").addClass("active");
		}
		else if (brand=== "PALACE") {
			$("[menu-category-detail='PALACE']").addClass("active");
		}
		else if (brand=== "SUPREME") {
			$("[menu-category-detail='SUPREME']").addClass("active");
		}
	}

	initSeries();
	dropdownList();
	initCategory();
	initBrandAjax();
});
