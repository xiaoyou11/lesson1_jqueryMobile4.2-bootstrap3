
$(document).off("pagecreate","#found-chart-page").on("pagecreate","#found-chart-page",function(){
	
	//回退按钮
	$(".back_home").click(function() {
		//$('[data-role=dialog]').dialog( "close" );
		//$('.ui-dialog').dialog('close');

		var previous = $.mobile.activePage.prev('[data-role=page]');
		$.mobile.changePage(previous, {
			transition : 'slide',
			reverse : true
		});
	})

});

$(document).off("pageshow","#found-chart-page").on("pageshow","#found-chart-page",function(){
	
	//请求数据
	if (Options.enableDebug) {
  		$.getJSON("json/found_viewdetail.json", function( data ) {
  			drawChart(data);
  		});
  	}else{
  		//调用ajax服务
  	}
});

function drawChart (data) {
	
	var V_LABEL =  data["V_LABEL"];
	var C_LABEL = data["C_LABEL"];
	var FLOW = data["FLOW"];
	var ACC_FLOW = data["ACC_FLOW"]; 
	var START_SCALE = data["START_SCALE"]; 
	var END_SCALE = data["END_SCALE"];
	var SCALE_SPACE = data["SCALE_SPACE"];
	
//	var flow = []; //Y轴数据
//	var acc_flow = [];
//	for (var i = 1; i < 21; i++) {
//		flow.push(Math.floor(Math.random() * (30 + ((i % 12) * 5))) + 10);
//	}
	//console.log(FLOW);
	
	
	var chartWH = $('div.inner_bottom').width();
	var chartHH = $("div.inner_bottom").height();
	
	//alert(chartHH);
	var data = [{
		name : 'PV',
		value : FLOW,
		color : '#0d8ecf',
		line_width : 2
	}];

	var line = new iChart.LineBasic2D({
		render : 'chartDiv',
		data : data,
		align : 'center',
//		title : '/////标题/////',
//		subtitle : '////子标题////',
//		footnote : '///底部说明////',
		width :  chartWH,
		height : chartHH,
		sub_option : {
			smooth : true, //平滑曲线
			point_size : 10
		},
		tip:{
				enable:true,
				shadow:true,
				listeners:{
					 //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
					parseText:function(tip,name,value,text,i){
						return "<span>"+C_LABEL[i]+"</span>"+
						"<br/><span >单位净值："+value+"</span>"+
						"<br/><span>累计净值："+ACC_FLOW[i];
					}
				}
			},
		legend : {
			enable : false
		},
		crosshair : {
			enable : true,
			line_color : '#62bce9'
		},
		coordinate : {
//			width:'95%',
//			height:'90%',
//			valid_width : 500,
  			axis : {
  				color : '#9f9f9f',
  				width : [0, 0, 2, 2]
  			},
  			grids : {
  				vertical : {
  					way : 'share_alike',
  					value : 12
  				}
  			},
			scale : [{
				position : 'left',
				start_scale : parseInt(START_SCALE), //y轴起始
				end_scale : parseInt(END_SCALE), //y轴终止
				scale_space : parseInt(SCALE_SPACE), //y轴步长
				scale_size : 2,
				scale_color : '#9f9f9f'
			}, {
				position : 'bottom',
				labels : V_LABEL
			}]
		}
	});
	//开始画图
	line.draw();
}