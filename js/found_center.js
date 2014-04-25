document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, false);

/**
 * 基金中心 -- 全局入口函数
 */
$(document).off("pagecreate","#found-center-page").on("pagecreate","#found-center-page",function(){
	
	
	 //左侧导航 -- 点击一级菜单
	 $("#zd dt").click(function(){$(this).next("dd").slideToggle(500).siblings("dd").slideUp();});
	 
	 //左侧导航 -- 点击二级菜单
	 $("#leftcategory > li").click(function(){
	 	$(this).addClass("active");
	 	var index = $(this).index();
	 	if (index == 0) { //业务介绍
	 		if(Options.currentPage != 0){
	 			//loadBusiIntroDiv();
	 		}
	 	} else if(index == 1){ //产品中心
	 		if(Options.currentPage != 1){
	 			//进入产品列表界面
	 			loadViewListDiv("pages/center_view_list.html",Options.foundListUrl,{},1);
	 		}
	 	}else if(index == 2){ //基金查询
	 		if(Options.currentPage != 2){
	 			loadQueryCondDiv();
	 		}
	 	}
	 });
	 
	 //左侧导航 -- 鼠标悬停
	 $("#leftcategory > li").hover(function(){
	 	$(this).removeClass("active");
	 	$( this ).siblings().removeClass("active");
	 },function () {
	 	$(this).removeClass("active");
	 	$("#leftcategory > li").eq(Options.currentPage).addClass("active");
	 });
	 
	 //Entry Point=========================================================================
	 //首先进入产品中心,页面会加载列表页面
	 loadViewListDiv("pages/center_view_list.html",Options.foundListUrl,{},1);
});
