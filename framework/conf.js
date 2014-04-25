/**
 * 静态参数配置
 */
Options = {
	enableDebug : true,
	currentPage : 1,   //当前导航的页面索引,默认是1 - 即产品中心
	foundListUrl: '',  //产品列表查询URL地址 ,参数需要在具体页面配置
	chartUrl:''  	   //图表展现URL,参数需要在具体页面配置
};

function showLoadingBox() {
	$.mobile.loading("show", {
		text : "正在加载...",
		textVisible : true,
		theme : "b",
		textonly : false,
		html : ""
	});
}

function hideLoadingBox(){
	$.mobile.loading( "hide" );
}