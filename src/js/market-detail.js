require([
	"common",
	"clipboard",
], function() {
	var common = require("common");
	var productId = common.getQuerystring("product");


	/*----- URL 클립보드 복사-----*/
	function shareLink() {
		var url = location;
		$(".board-setting .board-clipboard").attr("data-clipboard-text", url);
		var Clipboard = require("clipboard");
		var clipboard = new Clipboard(".board-clipboard");
		clipboard.on("success", function() {
			alert("페이지의 주소가 복사되었습니다.");
		});
	}


	/*-----split (list로 리턴)-----*/
	function split(x) {
		return x.split("|");
	}

	function initPopUp() {
		$(".popup-layer").hide();
		$(".dark-layer").hide();
		$("body").css("overflow", "");
	}

	/*-----Like 초기 세팅 -----*/
	function initLike() {
		$.ajax({
			url: window._ctx.root + "/api/like/hasLike/" + productId,
			success: function (data) {
				var likeHTML = "";
				if (data.result) {
					likeHTML = "<div class=\"list-selector like fa fa-heart\"></div>";
				}
				else {
					likeHTML = "<div class=\"list-selector like fa fa-heart-o\"></div>";
				}

				$(".market-detail .list-selector.like").replaceWith(likeHTML);
				selectLike();
			},
		});
	}

	/*-----select Like -----*/
	function selectLike() {
		$(".list-selector.like").off();
		$(".list-selector.like").on("click", function() {
			var select = $(".list-selector.like").hasClass("fa-heart").toString();

			if(select === "false") {
				$.ajax({
					url: window._ctx.root + "/api/like/add/" + productId,
					success: function (data) {
						console.log(data.result);
						if (data.result === "ok") {
							$(".list-selector.like").removeClass("fa-heart-o");
							$(".list-selector.like").addClass("fa-heart");
							countLike();
						}
						if (data.result === "no") {
							alert("로그인을 해주세요.");
						}

					},
					error: function() {
						alert("로그인을 해주세요.");
					},
				});
			}
			if(select === "true") {
				$.ajax({
					url: window._ctx.root + "/api/like/cancel/" + productId,
					success: function (data) {
						if (data.result === "ok") {
							$(".list-selector.like").removeClass("fa-heart");
							$(".list-selector.like").addClass("fa-heart-o");
							countLike();
						}
					},
					error: function() {
						alert("로그인을 해주세요.");
					},
				});
			}
		});
	}

	/*-----Like count 불러오기-----*/
	function countLike() {
		$.ajax({
			url: window._ctx.root + "/api/like/count/" + productId,
			success: function (result) {
				$(".market-detail .board-info .like").html("<span class='fa fa-heart-o'></span>" + result);
			},
		});
	}

	/*-----comment reply 쓰기-----*/
	function writeReply(upperId) {
		$(".write-reply .fa-pencil.resell-btn").off();
		$(".write-reply .fa-pencil.resell-btn").on("click", function() {

			var replyText = $(".write-reply textarea").val();

			if(replyText === "") {
				alert("답글을 입력해주세요.");
				$(".write-reply textarea").focus();
				return;
			}

			$.ajax({
				url: window._ctx.root + "/api/comment/addReply/" + productId,
				data: {
					replyText: replyText,
					upperId: upperId,
				},
				success: function (result) {
					console.log(result);
					loadComment();
					$(".write-replay textarea").val("");
				},
				error: function () {
					alert("로그인을 해주세요.");
				},
			});
		});
	}

	function replyComment() {
		$(".comment-setting .comment-reply").off();
		$(".comment-setting .comment-reply").on("click", function() {
			$(".write-reply").remove();

			if ($(this).hasClass("select")) {
				$(this).removeClass("select");
				return;
			}
			else {
				$(".comment-setting .comment-reply").removeClass("select");
				var upperId = $(this).parents("li").attr("comment_id");
				var commentHTML = "";
				commentHTML += "<section class=\"write-reply\">";
				commentHTML += "<textarea id=\"input-details\" placeholder=\"답글을 달아 보세요.\"></textarea>";
				commentHTML += "<div class=\"resell-btn fa fa-pencil\"></div>";
				commentHTML += "</section>";
				$(this).parents("li").after(commentHTML);
				$(this).addClass("select");
				$(".write-reply textarea").focus();
				writeReply(upperId);
			}
		});

	}


	/*-----comment 쓰기-----*/
	function writeComment() {
		$(".write-comment .fa-pencil").on("click", function() {
			var commentText = $(".write-comment textarea").val();
			if(commentText === "") {
				alert("댓글을 입력해주세요.");
				$(".write-comment textarea").focus();
				return;
			}
			$.ajax({
				url: window._ctx.root + "/api/comment/add/" + productId,
				data: {
					commentText: commentText,
				},
				success: function (result) {
					console.log(result);
					loadComment();
					$(".write-comment textarea").val("");
				},
				error: function () {
					alert("로그인을 해주세요.");
				},
			});
		});
	}

	/*-----comment Info 불러오기-----*/
	function loadComment() {
		$.ajax({
			url: window._ctx.root + "/api/comment/list/" + productId,
			success: function (result) {
				console.log(result);
				var sessionUid = result.sessionUid;
				var list = result.commentInfo;

				if(list.length === 0) {
					var commentHTML = "";
					commentHTML += "<li class=\"default-comment\">";
					commentHTML += "아직 작성된 댓글이 없습니다.";
					commentHTML += "</li>";
					$(".market-detail.comment .comments-body").html(commentHTML);
					return;
				}

				$(".write-reply").remove();
				$(".comments-body>li").remove();

				for (var i=0; i<list.length; i++) {
					var item = list[i];
					var commentHTML = "";
					var userRank = item.user_rank;
					var commenTimeForm = "time";
					var date = common.getFormatDate(item.comment_time, commenTimeForm);

					commentHTML += "<li comment_id=\"" + item.comment_id + "\"";
					if (item.upper_id !== undefined) {
						commentHTML += " upper_id=\"" + item.upper_id + "\"";
					}
					commentHTML += ">";
					if (item.upper_id !== undefined) {
						commentHTML += "<i class=\"reply glyphicon glyphicon-arrow-right\"></i>";
					}
					commentHTML += "<div class=\"comment-body";
					if (item.upper_id !== undefined) {
						commentHTML += " reply";
					}
					commentHTML += "\">";
					commentHTML += "<div class=\"user-info\">";
					commentHTML += "<i class=\"user-rank\"></i>";
					commentHTML += "<div class=\"user-name\">";
					commentHTML += item.user_name;
					commentHTML += "</div>";
					commentHTML += "</div>";
					commentHTML += "<ul class=\"comment-setting\">";
					if(sessionUid === item.uid) {
						commentHTML += "<li class=\"comment-modify\">수정</li>";
						commentHTML += "<li class=\"comment-delete\">삭제</li>";
					}
					if(sessionUid !== item.uid || sessionUid === null) {
						commentHTML += "<li class=\"comment-reply fa fa-reply\"> 답글</li>";
					}
					commentHTML += "</ul>";
					commentHTML += "<div class=\"comment-content\">";
					commentHTML += item.comment_contents.replace(/\n/g, "<br>");
					commentHTML += "</div>";
					commentHTML += "<div class=\"reporting-date\">";
					commentHTML += "<span class=\"fa fa-clock-o\"></span> ";
					commentHTML += date;
					commentHTML += "</div>";
					commentHTML += "</div>";
					commentHTML += "</li>";

					if (item.upper_id === undefined) {
						$(".market-detail.comment .comments-body").append(commentHTML);
						console.log(userRank);
						updateUserRank(userRank, item.comment_id);
					}
					else if (item.upper_id !== undefined) {
						var countUpperId = $(".comments-body>li[upper_id=" + item.upper_id + "]").length;
						var upper = $(".comments-body>li[comment_id=" + item.upper_id + "]");
						var lastReply = $(".comments-body>li[upper_id=" + item.upper_id + "]").last();

						//동일한 upperId를 가진 li가 있으면 뒤에 갖다 붙여라
						if (countUpperId > 0) {
							lastReply.after(commentHTML);
							updateUserRank(userRank, item.comment_id);
						}
						else if (countUpperId === 0) {
							upper.after(commentHTML);
							updateUserRank(userRank, item.comment_id);
						}
					}
				}
				replyComment();
				removeComment();
				updateComment();
			},
		});
	}

	// user rank 에 따른 icon 변경
	function updateUserRank(userRank, commentId) {
		if(userRank === "member") {
			$("li[comment_id=" + commentId +"] .user-info>.user-rank").addClass("fa fa-star-o");
		}
		if(userRank === "silver") {
			$("li[comment_id=" + commentId +"] .user-info>.user-rank").addClass("fa fa-star");
		}
		if(userRank === "gold") {
			$("li[comment_id=" + commentId +"] .user-info>.user-rank").addClass("fa fa-diamond");
		}
		if(userRank === "admin") {
			$("li[comment_id=" + commentId +"] .user-info>.user-rank").addClass("fa fa-user-circle-o");
		}
		if(userRank=== "blackList") {
			$("li[comment_id=" + commentId +"] .user-info>.user-rank").addClass("fa fa-frown-o");
		}
	}

	/*-----comment 삭제-----*/
	function removeComment() {
		$(".comment-setting .comment-delete").on("click", function() {
			var commentId = $(this).parents("li").attr("comment_id");
			$(".popup-layer.comment-remove").show();
			$(".dark-layer").show();
			$("body").css("overflow", "hidden");
			$(".popup-layer.comment-remove .btn-ok").off();
			$(".popup-layer.comment-remove .btn-ok").on("click", function() {
				var hasReply = $(".comments-body>li[upper_id=" + commentId + "]").length;

				if (hasReply > 0) {
					alert("답글이 달린 댓글은 삭제하실 수 없습니다.");
					initPopUp();
				}
				else if (hasReply === 0) {
					$.ajax({
						url: window._ctx.root + "/api/comment/remove/" + productId,
						data: {
							commentId: commentId,
						},
						success: function (result) {
							initPopUp();
							loadComment();
						},
						error: function () {
							alert("로그인을 해주세요.");
						}
					});
				}
			});
			$(".popup-layer.comment-remove .btn-cancel").on("click", function() {
				initPopUp();
			});
		});
	}

	// 클릭 이벤트 발생 target 확인
	$(document).on("click", function(event) {
		console.log(event.target);
	});

	/*-----comment 수정-----*/
	function updateComment() {
		$(".comment-setting .comment-modify").off();
		$(".comment-setting .comment-modify").on("click", function() {
			var commentId = $(this).parents("li").attr("comment_id");
			var placeholder = $(this).parents("li").find(".comment-content").text();
			var initHTML = "<div class=\"comment-content\">" + placeholder + "</div>";
			var initSetting = "<li class=\"comment-modify\">수정</li><li class=\"comment-delete\">삭제</li>";
			var newSetting = "<li class=\"comment-udt-ok\">확인</li><li class=\"comment-udt-cancel\">취소</li>";
			var newCommentHTML = "<textarea id=\"update-details\"></textarea>";
			var hasReply = $(".comments-body>li[upper_id=" + commentId + "]").length;

			if (hasReply > 0) {
				alert("답글이 달린 댓글은 수정하실 수 없습니다.");
				initPopUp();
			}

			else if (hasReply === 0) {
				$("li[comment_id=" + commentId + "] .comment-content").replaceWith(newCommentHTML);
				$("li[comment_id=" + commentId + "] #update-details").text(placeholder);
				$("li[comment_id=" + commentId + "] .comment-setting>li").remove();
				$("li[comment_id=" + commentId + "] .comment-setting").html(newSetting);

				$(".comment-setting .comment-udt-cancel").off();
				$(".comment-setting .comment-udt-cancel").on("click", function() {
					$("li[comment_id=" + commentId + "] #update-details").replaceWith(initHTML);
					$("li[comment_id=" + commentId + "] .comment-setting").html(initSetting);
					updateComment();
					removeComment();
				});


				$(".comment-setting .comment-udt-ok").off();
				$(".comment-setting .comment-udt-ok").on("click", function() {
					var newCommentText = $(this).parents("li").find("#update-details").val();
					var commentId = $(this).parents("li").attr("comment_id");
					if(newCommentText === "") {
						alert("댓글을 입력해주세요.");
						$("#update-details").focus();
						return;
					}

					$.ajax({
						url: window._ctx.root + "/api/comment/update/" + productId,
						data: {
							commentId: commentId,
							newCommentText: newCommentText,
						},
						success: function () {
							/*$("li[comment_id=" + commentId + "] .comment-setting").html(initSetting);
							$(this).parents("li").find("#update-details").replaceWith(initHTML);*/
							loadComment();
						},
						error: function () {
							alert("로그인을 해주세요.");
						}
					});
				});
			}
		});
	}


	/*-----comment count 불러오기-----*/
	function countComment() {
		$.ajax({
			url: window._ctx.root + "/api/product/comment/" + productId,
			success: function (result) {
				$(".market-detail .board-info .comment").html("<span class='fa fa-commenting-o'></span>" + result);
			},
		});
	}


	/*-----신고 버튼-----*/
	function initComplain() {
		$.ajax({
			url: window._ctx.root + "/api/complain/hasComplain/" + productId,
			success: function (data) {

				if (data.result) {
					$(".board-setting .board-complain").addClass("select");
				}
				else {
					$(".board-setting .board-complain").removeClass("select");
				}
			},
		});
	}

	function addComplain() {
		$(".board-setting .board-complain").on("click", function() {
			var select = $(".board-setting .board-complain").hasClass("select").toString();

			if(select === "false") {
				$.ajax({
					url: window._ctx.root + "/api/complain/add/" + productId,
					success: function (data) {
						console.log(data.result);
						if (data.result === "ok") {
							$(".board-setting .board-complain").addClass("select");
							countComplain();
							alert("신고가 완료되었습니다.");
						}
						if (data.result === "no") {
							alert("로그인을 해주세요.");
						}
					},
				});
			}
			if(select === "true") {
				alert("이미 신고한 게시글입니다.");
			}
		});
	}

	/*-----complain Info 불러오기-----*/
	function countComplain() {
		$.ajax({
			url: window._ctx.root + "/api/product/complain/" + productId,
			success: function (result) {
				$(".market-detail .board-info .complain").html("<span class='fa fa-thumbs-o-down'></span>" + result);
			},
		});
	}

	/*-----hits Info 불러오기-----*/
	function countHits() {
		$.ajax({
			url: window._ctx.root + "/api/hits/count/" + productId,
			success: function (result) {
				$(".market-detail .board-info .hits").html("<span class='fa fa-eye'></span>" + result);
			},
		});
	}

	function plusHits() {
		$.ajax({
			url: window._ctx.root + "/api/hits/plus/" + productId,
			success: function () {
				countHits();
			},
		});
	}

	/*-----product img 불러오기-----*/
	function loadProductImg() {
		$.ajax({
			url: window._ctx.root + "/api/product/image/" + productId,
			success: function (result) {
				var itemHTML = "";
				var indicatorsHTML = "";
				var imageLayerHTML = "";
				var layerIndicatorHTML = "";

				for (var i=0; i<result.length; i++) {
					var item = result[i];

					// 상품 이미지
					itemHTML += "<div class=\"item";
					if(i==0) {
						itemHTML += " active";
					}
					itemHTML += "\"> <div class=\"product-img\" style=\"background-image: url('";
					itemHTML += item.img_url;
					itemHTML += "')\"></div>";
					itemHTML += "<div class=\"carousel-caption\"></div>";
					itemHTML += "</div>";


					//상세 이미지 레이어의 이미지
					imageLayerHTML += "<div class=\"item";
					if(i==0) {
						imageLayerHTML += " active";
					}
					imageLayerHTML += "\"><img src='" + item.img_url + "'>";
					imageLayerHTML += "<div class=\"carousel-caption\">";
					imageLayerHTML += "</div>";
					imageLayerHTML += "</div>";


					//indicator
					indicatorsHTML += "<li data-target=\"#market-detail-img-carousel\"";
					indicatorsHTML += " data-slide-to=\"" + i + "\" class=\"";
					if(i==0) {
						indicatorsHTML += " active";
					}
					indicatorsHTML += "\"></li>";


					//상세 이미지 Layer indicator
					layerIndicatorHTML += "<li data-target=\"#img-layer-carousel\"";
					layerIndicatorHTML += " data-slide-to=\"" + i + "\" class=\"";
					if(i==0) {
						layerIndicatorHTML += " active";
					}
					layerIndicatorHTML += "\"></li>";
				}

				$("#market-detail-img-carousel .carousel-inner").html(itemHTML);
				$("#market-detail-img-carousel .carousel-indicators").html(indicatorsHTML);
				$(".product-img-layer .carousel-inner").html(imageLayerHTML);
				$(".product-img-layer .carousel-indicators").html(layerIndicatorHTML);

				/*---show product-img-layer---*/
				$("#market-detail-img-carousel .carousel-inner").on("click", function() {
					$(".product-img-layer").css("display", "block");
					$("body").css("overflow", "hidden");
				});

				$(".product-img-layer .carousel").carousel("pause");

				/*---hide product-img-layer---*/
				$(".product-img-layer .close-icon").on("click", function() {
					$(".product-img-layer").css("display", "none");
					$("body").css("overflow", "");
				});
			},
		});
	}

	/*-----판매자 정보 불러오기-----*/
	function loadSellerInfo() {
		$.ajax({
			url: window._ctx.root + "/api/product/seller/" + productId,
			success: function(result) {
				var sellerInfo = result.sellerInfo;
				var countSell = result.countSell;

				$(".market-detail .seller-info .seller-name").text(sellerInfo.user_name);
				$(".market-detail .seller-info .selling-complete span").text(countSell);
				$(".market-detail .seller-info .seller-rank").attr("seller-rank", sellerInfo.user_rank);

				// user rank 에 따른 icon 변경
				if (sellerInfo.user_rank !== undefined && sellerInfo.user_rank.length > 0) {
					var userRank = $(".market-detail .seller-info .seller-rank").attr("seller-rank");

					$(".seller-info .seller-rank").removeClass();
					if(userRank === "member") {
						$(".seller-info>.seller.name [seller-rank=member]").addClass("seller-rank fa fa-star-o");
					}
					if(userRank === "silver") {
						$(".seller-info>.seller.name [seller-rank=silver]").addClass("seller-rank fa fa-star");
					}
					if(userRank === "gold") {
						$(".seller-info>.seller.name [seller-rank=gold]").addClass("seller-rank fa fa-diamond");
					}
					if(userRank === "admin") {
						$(".seller-info>.seller.name [seller-rank=admin]").addClass("seller-rank fa fa-user-circle-o");
					}
					if(userRank=== "blackList") {
						$(".seller-info>.seller.name [seller-rank=blackList]").addClass("seller-rank fa fa-frown-o");
					}
				}
			},
		});
	}

	/*-----product Detail + 거래 Info 불러오기-----*/
	function loadProductDetail() {
		$.ajax({
			url: window._ctx.root + "/api/product/detail/" + productId,
			success: function(result) {
				console.log(result);

				var item = result.productInfo;
				var sessionUid = result.sessionUid;
				var price = common.numberWithCommas(item.price);
				var form = "date";
				var date = common.getFormatDate(item.update_date, form);
				var boardSettingHTML = "";
				var status = item.selling_status;

				console.log(result);
				console.log(sessionUid === null);

				// 판매자와 동일한 uid인지 체크
				if (item.seller_uid === sessionUid) {
					boardSettingHTML += "<li class=\"board-update\">수정</li>";
					boardSettingHTML += "<li class=\"board-delete\">삭제</li>";
				}

				else if (status === "complete") {
					boardSettingHTML += "<li class=\"board-complain\">신고</li>";
					boardSettingHTML += "<li class=\"board-clipboard\" data-clipboard-text=\"\">URL</li>";
				}

				else if (status === "processing") {
					boardSettingHTML += "<li class=\"board-complain\">신고</li>";
					boardSettingHTML += "<li class=\"board-clipboard\" data-clipboard-text=\"\">URL</li>";
				}

				else if (item.seller_uid !== sessionUid || sessionUid === null) {
					boardSettingHTML += "<li class=\"board-complain\">신고</li>";
					boardSettingHTML += "<li class=\"board-clipboard\" data-clipboard-text=\"\">URL</li>";
					$(".purchase-area").html("<div class=\"resell-btn purchase\">구매</div>");
					/*-----구매 페이지로 이동-----*/
					$(".resell-btn.purchase").on("click", function() {
						if (sessionUid === null) {
							alert("로그인을 해주세요.");
						}
						else {
							location.href = window._ctx.root + "/purchase/purchase.html?product=" + productId;
						}
					});
				}

				$(".market-detail .board-setting>ul").html(boardSettingHTML);

				var completeText = "해당 상품은 판매가 완료되었습니다.";
				var processingText = "거래가 진행 중인 상품입니다.";

				if (status === "complete") {
					$("section.purchase-area").html("<div class=\"complete-text\">" + completeText + "</div>");
				}

				else if (status === "processing") {
					$("section.purchase-area").html("<div class=\"processing-text\">" + processingText + "</div>");
				}

				updateSelling();
				shareLink();
				addComplain();

				// 사이즈
				if (item.category_name !== undefined && item.category_name.length > 0) {
					var sizeHTML = "<line></line>" + item.size;
					if (item.category_name === "신발") {
						sizeHTML += "<span> mm</span>";
						$(".market-detail .product.size").html(sizeHTML);
					}
					if (item.category_name === "하의") {
						sizeHTML += "<span> inch</span>";
						$(".market-detail .product.size").html(sizeHTML);
					}
					$(".market-detail .product.size").html(sizeHTML);
				}

				// 퀄리티
				if (item.quality !== undefined && item.quality.length > 0) {
					var qulityHTML = "<line></line>";
					if (item.quality === "used") {
						qulityHTML += "중고상품";
						$(".market-detail .product.quality").html(qulityHTML);
					}
					if (item.quality === "new") {
						qulityHTML += "새상품";
						$(".market-detail .product.quality").html(qulityHTML);
					}
				}

				// 거래 방식 info
				var dealMeans = split(item.deal_means);
				var deliveryCheck = item.delivery_check;

				var dealHTML = "";
				for (var i=0; i<dealMeans.length; i++) {
					var dealType = dealMeans[i];

					if (dealType === "direct") {
						dealHTML += "<div class='directly'>";
						dealHTML += "<line></line>";

						if (item.direct_place === "" || item.direct_place === undefined) {
							dealHTML += "가능";
						}
						else {
							dealHTML += item.direct_place;
						}
						dealHTML += "</div>";
					}
					if (dealType === "delivery") {
						dealHTML += "<div class='delivery'>";
						dealHTML += "<line></line>";
						if (deliveryCheck === "exclude") {
							dealHTML += "택배비 착불";
						}
						if (deliveryCheck === "include") {
							dealHTML += "무료 배송";
						}
						dealHTML += "</div>";
					}
				}
				dealHTML += "<div class='safety'>";
				dealHTML += "</div>";
				$(".market-detail .dealing-mode").append(dealHTML);

				if (item.safe_deal === 1) {
					$(".market-detail .dealing-mode .safety").html("<line></line>가능");
				}
				if (item.safe_deal === 0) {
					$(".market-detail .dealing-mode .safety").html("<line></line>불가");
				}

				//상세 설명
				if (item.description === undefined || item.description === "") {
					$(".market-detail .user-description").text("상세 설명이 없습니다.");
				}
				else {
					$(".market-detail .user-description").html(item.description.replace(/\n/g, "<br>"));
				}

				$(".market-detail .product.name").text(item.product_name);
				$(".market-detail .product.price").html("<i class='fa fa-won'></i>" + price);
				$(".board-info .reporting-date").html("<span class='fa fa-clock-o'></span>" + date);

				/* 삭제 팝업 이벤트*/
				deletePopUp(item.seller_uid);
			},
		});
	}

	// 판매 상품 수정 페이지로 이동
	function updateSelling() {
		$(".board-setting .board-update").on("click", function() {
			location.href = window._ctx.root + "/selling/update-selling.html?product=" + productId;
		});
	}

	/* 삭제 팝업 그리고 물품 삭제*/

	//판매 등록 버튼 클릭 시 확인 팝업 창
	function deletePopUp(sellerUid) {
		$(".board-delete").on("click", function() {
			common.popUp("pop-up-series", "left");
			$(".pop-up-series").addClass("register");
			$(".pop-up-series").css("position", "fixed");
			$(".pop-up-series>span").css("top", "30%");
			$(".pop-up-series>.text1").text("삭제하시겠습니까?");
			$(".pop-up-series>.text2").text("");
		});
		//팝업 선택 후 처리
		$(".popup-ok").on("click", function () {
			$.ajax({
				url: window._ctx.root+"/api/market/delete",
				method: "POST",
				data: {
					productId: productId,
					sellerUid: sellerUid,
				},
				success: function(data) {
					if (data.result === "ok") {
						alert("삭제 완료");
						window.history.back();
					}
					else {
						alert("판매자가 아닙니다 삭제가 불가능합니다.");
					}
				},
			});
		});
	}



	loadProductImg();
	loadProductDetail();
	loadSellerInfo();
	loadComment();
	countComment();
	initLike();
	initComplain();
	countLike();
	countComplain();
	plusHits();
	writeComment();
	writeReply();
	updateComment();
});
