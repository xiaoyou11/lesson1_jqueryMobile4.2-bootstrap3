/**
 * 产品中心加载产品列表
 */
	var myScroll,
		pullDownEl, pullDownOffset,
		pullUpEl, pullUpOffset,
		generatedCount = 0;
	var maxScrollY = 0;
	var hasMoreData = false;
	var OFFSET = 5;	  //偏移量
	var page = 1;	  //起始分页
	var PAGESIZE = 6; //页面大小
	var TEXT_PULL_DOWN_FRESH = "下拉刷新...";
	var TEXT_LOADING = "正在加载...";
	var TEXT_PULL_UP_FRESH = "上拉加载更多...";
	var TEXT_RELEASE_FRESH = "释放立即刷新...";
	
	var DATA_URL = null;
	var DATA_URL_PARAMS = {};
/**
 * 装载列表页面:(产品中心列表) 或者 (查询列表) 共用一套数据接口
 * @param {string} pageUrl			页面路径
 * @param {string} dataUrl			页面请求地址
 * @param {object} extraParams	页面请求地址参数
 * @param {number} currentPage		属于左侧导航的第几个菜单项
 */
function loadViewListDiv(pageUrl,dataUrl,extraParams,currentPage){
	
		 DATA_URL = dataUrl;
		//设置当前载入页面索引
		 Options.currentPage = currentPage;
		 //准备参数
		 DATA_URL_PARAMS = {NEXT_KEY : page, PAGE_SIZE : PAGESIZE};
		 $.extend(true, DATA_URL_PARAMS, extraParams);
		 
		 $("#LoadDiv").load(pageUrl, function() {
				/**
				 * 事件绑定
				 */
				//单击产品列表行
				$("#vlistWrapper").off().on("click","tr",function(){
					//进入产品图表
					$.mobile.changePage( "#found-chart-page",{ transition: "slide", changeHash: true });
		 		});
				//单击产品查询列表的回退按钮
				$(".rightBackCond").off().on("click",function(){
					loadQueryCondDiv(); //回到产品查询界面
				});
				
			 	//列表加载完毕,页面初始化数据
				//滚动表格数据加载
				pullDownEl = document.getElementById('pullDown');
				pullDownOffset = pullDownEl.offsetHeight;
				pullUpEl = document.getElementById('pullUp');
				pullUpOffset = pullUpEl.offsetHeight;
			    
				hasMoreData = false;
				$("#pullUp").hide();
				$("#pullDown").hide();
				
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = TEXT_LOADING;
			
				if(Options.enableDebug){ //仅用于测试数据
					$.getJSON( "json/found_viewlist.json", function( response ) {
						onProdMainSucc( response );
					});
				}else{  //取第一批数据
			  		YT.Net.call(DATA_URL, DATA_URL_PARAMS , onProdMainSucc, function() {
			  			WL.SimpleDialog.show("提示", "请求执行失败!", [ {
			  				text : "确定",
			  				handler : function() {
			  				}
			  			} ]);
			  		});
				}
	 });
}

//产品列表加载成功
function onProdMainSucc( response ){
	if (response.LIST.length < PAGESIZE) {
		hasMoreData = false;
		$("#pullUp").hide();
	} else {
		hasMoreData = true;
		$("#pullUp").show();
	}
	
	myScroll = new iScroll('vlistWrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function() {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = 'idle';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = TEXT_PULL_DOWN_FRESH;
				this.minScrollY = -pullDownOffset;
			}
			if (pullUpEl.className.match('loading')) {
				pullUpEl.className = 'idle';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = TEXT_PULL_UP_FRESH;
			}
		},
		onScrollMove: function() {
			$("#pullDown").show();
			if (this.y > OFFSET && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = TEXT_RELEASE_FRESH;
				this.minScrollY = 0;
			} else if (this.y < OFFSET && pullDownEl.className.match('flip')) {
				pullDownEl.className = 'idle';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = TEXT_PULL_DOWN_FRESH;
				this.minScrollY = -pullDownOffset;
			} 
			if (this.y < (maxScrollY - pullUpOffset - OFFSET) && !pullUpEl.className.match('flip')) {
				if (hasMoreData) {
					this.maxScrollY = this.maxScrollY - pullUpOffset;
					pullUpEl.className = 'flip';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = TEXT_RELEASE_FRESH;
				}
			} else if (this.y > (maxScrollY - pullUpOffset - OFFSET) && pullUpEl.className.match('flip')) {
				if (hasMoreData) {
					this.maxScrollY = maxScrollY;
					pullUpEl.className = 'idle';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = TEXT_PULL_UP_FRESH;
				}
			}
		},
		onScrollEnd: function() {
			$("#pullDown").hide();
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = TEXT_LOADING;
			}
			if (hasMoreData && pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = TEXT_LOADING;
				//取下一批数据
				//nextPage();
			}
		}
	});
	
	 var content = $("#foundListTmpl").render(response.LIST);
	 $(".scrollContent").html($.parseHTML(content));
	 //TODO:数据要保存在行DOM节点
	 //????
	 myScroll.refresh();
	 if (hasMoreData) {
		myScroll.maxScrollY = myScroll.maxScrollY + pullUpOffset;
	 } else {
		myScroll.maxScrollY = myScroll.maxScrollY;
	 }
	 maxScrollY = myScroll.maxScrollY;
	
}

/**
 * 列表滚动翻页
 */

function nextPage() {
	page++;
	YT.Net.call(DATA_URL, DATA_URL_PARAMS , function(response) {
		var dataList = response.LIST;
		if (dataList.length < PAGESIZE) {
			hasMoreData = false;
			$("#pullUp").hide();
		} else {
			hasMoreData = true;
			$("#pullUp").show();
		}
		
		var content = $("#foundListTmpl").render(response.LIST);
		$(".scrollContent").append($.parseHTML(content));
		//TODO:数据要保存在行DOM节点
		//????
		myScroll.refresh();
		if (hasMoreData) {
			myScroll.maxScrollY = myScroll.maxScrollY + pullUpOffset;
		} else {
			myScroll.maxScrollY = myScroll.maxScrollY;
		}
		maxScrollY = myScroll.maxScrollY;
			
	}, function() {
		WL.SimpleDialog.show("提示", "请求执行失败!", [ {
			text : "确定",
			handler : function() {
			}
		} ]);
	});
}



