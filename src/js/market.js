require([
	"common",
], function() {
	var common = require("common");
	var rowsPerPage = 5;
	var page =0;

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
		$(".dropdown-menu>li").off("click");
		$(".dropdown-menu>li").on("click", function () {
			var isCategory= $(this).parents(".input-style").hasClass("dropdown-category");
			var value = $(this).children().text();
			var sValue =$(this).attr("value");
			$(this).parents(".dropdown").find(".dropdown-selected").text(value);
			$(this).parents(".dropdown").find(".dropdown-selected").attr("s-value", sValue);

			var categorySelected= $(".dropdown-category .dropdown-selected").text();

			var brandSelected = $(".menu-category li.active").attr("brand-id");
			productListAjax(brandSelected);

			if (isCategory) {
				$(".dropdown-size .dropdown-selected").attr("s-value", "size-all");
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
						sizeHTML += "<li value=\"medium\"><a>medium</a></li>";
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
			/* 리스트 초기화*/
			$(".market-product-list").html("");
			page =0;
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
			var brandSelected = $(".menu-category li.active").attr("brand-id");
			/* 리스트 초기화*/
			$(".market-product-list").html("");
			page =0;
			productListAjax(brandSelected);
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
	function getPriceValue() {
		if ($(".product-price-order>.latest").hasClass("active")) {
			return "default";
		}
		else {
			if ($(".price>.price-arrow").hasClass("fa-arrow-down")) {
				return "DESC";
			}
			else if ($(".price>.price-arrow").hasClass("fa-arrow-up")) {
				return "ASC";
			}
		}
	}

	function goMarketDetail() {
		$(".market-product-list>li").off();
		/* 마켓디테일 페이지 이동*/
		$(".market-product-list>li").on("click", function () {
			var productId= $(this).attr("product-id");
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			console.log("제품아이디"+productId);
			$.ajax({
				url: window._ctx.root + "/api/hits/plus/" + productId,
				success: function () {
				},
			});
			var url = window._ctx.root+"/market/market-detail.html";
			url += "?product="+productId;
			location.href =url;
		});
	}

	function initCountLike(productId) {
		$.ajax({
			url: window._ctx.root + "/api/like/count/" + productId,
			success: function (result) {
				$(".product-item-list").find(".like-count").html("<span class='fa fa-heart-o'></span> " + result);
			},
		});
	}

	function initLike(productId) {
		$.ajax({
			url: window._ctx.root + "/api/like/hasLike/" + productId,
			success: function (data) {
				var likeHTML = "";
				if (data.result) {
					likeHTML = "<div class=\"list-selector like fa fa-heart\" valid=\"true\"></div>";
				}
				else {
					likeHTML = "<div class=\"list-selector like fa fa-heart-o\" valid=\"false\"></div>";
				}

				$(".product-item-list[product-id='" + productId + "'] .list-selector.like").replaceWith(likeHTML);
				setLike();
			},
		});

	}

	function countLike(jqEliment, productId) {
		$.ajax({
			url: window._ctx.root + "/api/like/count/" + productId,
			success: function (result) {
				$(jqEliment).parents(".product-item-list")
					.find(".like-count").html("<span class='fa fa-heart-o'></span> " + result);
			},
		});
	}

	function setLike() {
		$(".list-selector.like").off();
		$(".list-selector.like").on("click", function (event) {
			event.stopPropagation();
			var productId =$(this).parents(".product-item-list").attr("product-id");
			console.log("프로덕트 아이디: " +productId);
			var hasLike = $(this).attr("valid");
			var likeThis =this;
			if (hasLike === "false") {
				$.ajax({
					url: window._ctx.root + "/api/like/add/" + productId,
					success: function (data) {
						if (data.result === "ok") {
							console.log(likeThis);
							$(likeThis).removeClass("fa-heart-o");
							$(likeThis).addClass("fa-heart");
							$(likeThis).attr("valid", "true");
							countLike(likeThis, productId);
						}
					},
					error: function() {
						alert("로그인을 해주세요.");
					},
				});

			}
			else{
				$.ajax({
					url: window._ctx.root + "/api/like/cancel/" + productId,
					success: function (data) {
						if (data.result === "ok") {
							$(likeThis).removeClass("fa-heart");
							$(likeThis).addClass("fa-heart-o");
							$(likeThis).attr("valid", "false");
							countLike(likeThis, productId);
						}
					},
					error: function() {
						alert("로그인을 해주세요.");
					},
				});
			}
		});
	}

	function initHits(productId) {
		$.ajax({
			url: window._ctx.root + "/api/hits/count/" + productId,
			success: function (data) {
				var hitsHTML = "<div class=\"hits\"><span class=\"fa fa-eye\"></span>"+data+"</div>";

				$(".product-item-list[product-id='" + productId + "'] .hits").replaceWith(hitsHTML);
			},
		});
	}

	function showList(formData) {
		$.ajax({
			url: window._ctx.root + "/api/market/list",
			data: formData,
			processData: false,
			contentType: false,
			method: "POST",
			success: function (result) {
				var count = result.count;
				var lastPage = parseInt(count / rowsPerPage)
					+ (count % rowsPerPage === 0 ? 0 : 1)-1;
				console.log("마지막페이지"+lastPage);
				var productList ="";
				for (var i=0; i<result.list.length; i++) {
					var item = result.list[i];

					productList += "<li class=\"product-item-list\" product-id=\""+item.product_id+"" +
						"\" process=\""+item.selling_status+"\">";
					productList += "    <div class=\"product-info\">";
					productList += "        <img class=\"product-img\" src=\""+
						/*window._ctx.root+"/img/jordan1.png"*/item.img_url+"\">";
					productList += "        <div class=\"detail-info\">";
					productList += "            <div class=\"product name\">";
					productList += 						item.product_name;
					productList += "            </div>";
					productList += "            <div class=\"product price\">";
					productList += "                <i class=\"fa fa-won\"></i>";
					productList += 				common.numberWithCommas(item.price);
					productList += "            </div>";
					productList += "            <div class=\"product size\">";
					productList += 					item.size;
					if (item.category_name === "신발") {
						productList += 	"mm";
					}
					else if (item.category_name === "허리") {
						productList += 	"inch";
					}
					productList += "            </div>";
					productList += "            <div class=\"product quality\">";
					if (item.quality === "new") {
						productList += 	"새상품";
					}
					else if (item.quality === "used") {
						productList += 	"중고";
					}
					productList += "            </div>";
					productList += "            <ul class=\"product dealing-mode\">";

					var dealMeans = item.deal_means.split("|");
					for (var j=0; j<dealMeans.length; j++) {
						var dealType = dealMeans[j];

						if (dealType === "direct") {
							productList += "<li class=\"dealing-mode directly\">";
							productList += "직접거래";
							productList += "</li>";
						}
						if (dealType === "delivery") {
							productList += "<li class=\"dealing-mode delivery\">";
							productList += "택배거래";
							productList += "</li>";
						}
					}

					if (item.safe_deal === 1) {
						productList += "<li class=\"dealing-mode safety\">";
						productList += "안심결제";
						productList += "</li>";
					}

					productList += "            </ul>";
					productList += "            <div class=\"seller-info\">";
					productList += "                <div class=\"info-label\">판매자</div>";

					productList += "                <div class=\"seller-rank ";
					if (item.user_rank === "member") {
						productList +=	"fa fa-star-o\"></div>";
					}
					else if (item.user_rank === "silver") {
						productList +=	"fa fa-star\"></div>";
					}
					else if (item.user_rank === "gold") {
						productList +=	"fa fa-diamond\"></div>";
					}
					else if (item.user_rank === "admin") {
						productList +=	"fa fa-user-circle-o\"></div>";
					}
					else if (item.user_rank === "blackList") {
						productList +=	"fa fa-frown-o\"></div>";
					}

					productList += "                <div class=\"seller-name\">";
					productList += item.user_name;
					productList += "                </div>";
					productList += "            </div>";
					productList += "        </div>";
					productList += "    </div>";
					productList += "    <div class=\"board-info\">";
					productList += "        <div class=\"like-count\">";
					productList += "        </div>";
					productList += "        <div class=\"comment\">";
					productList += "            <span class=\"fa fa-commenting-o\"></span>";
					productList += "            10";
					productList += "        </div>";
					productList += "        <div class=\"complain\">";
					productList += "            <span class=\"fa fa-thumbs-o-down\"></span>";
					productList += "            10";
					productList += "        </div>";
					productList += "        <div class=\"hits\">";
					productList += "            <span class=\"fa fa-eye\"></span>";
					productList += "            1,0";
					productList += "        </div>";
					productList += "        <div class=\"reporting-date\">";
					productList += "            <span class=\"fa fa-clock-o\"></span>";
					productList += common.getFormatDate(item.update_date);
					productList += "        </div>";
					productList += "    </div>";
					productList += "    <div class=\"list-selector like fa fa-heart-o\" valid=\"false\"></div>";
					productList += "</li>";
					initCountLike(item.product_id);
					initLike(item.product_id);
					initHits(item.product_id);
				}
				$(".market-product-list").append(productList);
				goMarketDetail();
				/* 더보기 클릭시*/
				$(".more-list").off();
				$(".more-list").on("click", function () {
					var brandId = $(".menu-category li.active").attr("brand-id");
					++page;
					if (page<=lastPage) {
						productListAjax(brandId);

					}
				});
			},
		});
	}

	function getSearchFilter(brandId) {
		var filterCurrent = {
			brandId: brandId,
			searchValue: $(".filter-search-box").val().trim(),
			seriesId: $(".filter-series").attr("s-value"),
			categoryId: $(".dropdown-category .dropdown-selected").attr("s-value"),
			sizeId: $(".dropdown-size .dropdown-selected").attr("s-value"),
			qualityId: $(".dropdown-quality .dropdown-selected").attr("s-value"),
			priceFilter: getPriceValue(),
		};


		console.log("브랜드"+filterCurrent.brandId);
		console.log("서치"+filterCurrent.searchValue);
		console.log("시리즈"+filterCurrent.seriesId);
		console.log("카테고리"+filterCurrent.categoryId);
		console.log("사이즈"+filterCurrent.sizeId);
		console.log("퀄리티"+filterCurrent.qualityId);
		console.log("가격"+filterCurrent.priceFilter);

		var formData = new FormData();
		formData.append("brandId", filterCurrent.brandId);
		formData.append("searchValue", filterCurrent.searchValue);
		formData.append("seriesId", filterCurrent.seriesId);
		formData.append("categoryId", filterCurrent.categoryId);
		formData.append("sizeId", filterCurrent.sizeId);
		formData.append("qualityId", filterCurrent.qualityId);
		formData.append("priceFilter", filterCurrent.priceFilter);
		formData.append("rowsPerPage", rowsPerPage);
		formData.append("page", page);

		return formData;
	}

	function productListAjax(brandId) {
		var formData = getSearchFilter(brandId);
		showList(formData);

	}

	/* 브랜드 바꾸는 곳*/
	var naviHandler = function (jqElement) {
		var brandId = $(jqElement).attr("brand-id");

		/* 초기화 하는 부분*/
		$(".filter-search-box").val("");
		$(".filter-series").attr("s-value", "series-all");
		$(".filter-series").find("span").text("Series");
		$(".dropdown-category .dropdown-selected").attr("s-value", "category-all");
		$(".dropdown-category .dropdown-selected").text("Category");
		$(".dropdown-size .dropdown-selected").attr("s-value", "size-all");
		$(".dropdown-size .dropdown-selected").text("Size");
		$(".dropdown-quality .dropdown-selected").attr("s-value", "quality-all");
		$(".dropdown-quality .dropdown-selected").text("Quality");
		$(".product-price-order>li").removeClass("active");
		$(".product-price-order>.latest").addClass("active");
		/* 리스트 초기화*/
		$(".market-product-list").html("");
		page =0;
		/* 시리즈보이기 안보이기*/
		var brandSelected = $(".menu-category li.active").attr("menu-category-detail");
		if (brandSelected == "NIKE") {
			$(".filter-series").addClass("active");
			$(".filter-series").css("display", "inline-block");
			$(".filter-search").addClass("active");

		}
		else {
			$(".filter-series").removeClass("active");
			$(".filter-series").css("display", "none");
			$(".filter-search").removeClass("active");

		}
		/* 에이작스*/
		productListAjax(brandId);
	};

	function clickedMenu() {
		$(".menu-category>ul>li").on("click", function () {
			common.navigate(this, naviHandler);
		});
	}

	function initBrand() {
		var brandId=common.getQuerystring("brandId");
		console.log(brandId);
		$(".menu-category>ul>li").removeClass("active");
		$(".menu-category>ul>li[brand-id ="+brandId+" ]").addClass("active");
		productListAjax(brandId);
	}

	function initBrandAjax() {
		$.ajax({
			url: window._ctx.root+"/api/brand/list",
			success: function(data) {
				var brandHTML = "<li brand-id=\"brand-all\" menu-category-detail=\"ALL\">ALL</li>";
				for (var i = 0; i<data.length; i++) {
					var item = data[i];
					var brandId = item.brand_id;
					var brandName = item.brand_name;
					brandHTML += "<li brand-id=\""+brandId+"\" menu-category-detail=\""+brandName+"\">"
						+brandName+"</li>";
				}
				$(".menu-category ul").html(brandHTML);
				common.initNavi();
				initBrand();
				clickedMenu();
			},
		});
	}

	/* 가격 눌렀을 때*/
	function priceClick() {
		$(".product-price-order>li").on("click", function () {
			$(".product-price-order>li").removeClass("active");
			$(this).addClass("active");
			if ($(this).hasClass("price")) {
				if ($(this).find(".price-arrow").hasClass("fa-arrow-down")) {
					$(this).find(".price-arrow").removeClass("fa-arrow-down");
					$(this).find(".price-arrow").addClass("fa-arrow-up");
				}
				else {
					$(this).find(".price-arrow").addClass("fa-arrow-down");
					$(this).find(".price-arrow").removeClass("fa-arrow-up");
				}
			}
			var brandId= $(".menu-category li.active").attr("brand-id");
			/* 리스트 초기화*/
			$(".market-product-list").html("");
			page =0;
			productListAjax(brandId);
		});
	}

	/* 검색 필터 눌렀을때 검색결과*/
	$(".search-btn").on("click", function () {
		var brandId= $(".menu-category li.active").attr("brand-id");
		/* 리스트 초기화*/
		$(".market-product-list").html("");
		page =0;
		productListAjax(brandId);
		var searchValue = $(".filter-search-box").val().trim();
		if (searchValue === "" || searchValue === undefined) {
			$(".main-product-name.active").text("Products");
		}
		else {
			$(".main-product-name.active").text(searchValue);
		}
	});

	initSeries();
	priceClick();
	dropdownList();
	initCategory();
	initBrandAjax();
});
