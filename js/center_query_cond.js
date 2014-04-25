/**
 * 产品查询
 */
function loadQueryCondDiv(){
	
	//设置当前载入页面索引
	Options.currentPage = 2;
	$("#LoadDiv").load("pages/center_query_cond.html", function() {
		//事件绑定
		 $("#foundQueryBtn").off().on("click",function(){
		 	 //TODO:获取查询页面内的参数
		 	 var  extraParams = {};
		 	 //3 加载查询产品结果列表
		 	 loadViewListDiv("pages/center_query_list.html",Options.foundListUrl,extraParams,2);
	 	 
	 	 });
		//下拉框 //ajax获取基金公司
	});
	
}
