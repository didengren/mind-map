function ShowPre(o){
	var that= this;
	this.box = $("#"+o["box"]);
	this.btnP = $("#"+o.Pre);
	this.btnN= $("#"+o.Next);
	this.v = o.v||1;
	this.c = 0;
	var li_node = "li";
	this.loop = o.loop||false;

	//循环生成dom
	if(this.loop){
		this.li =  this.box.find(li_node);
		this.box.append(this.li.eq(0).clone(true));
	};
	this.li = this.box.find(li_node);
	this.l = this.li.length;

	//滑动条件不成立
	if(this.l<=this.v){
		this.btnP.hide();
		this.btnN.hide();
	};
	this.deInit = true;
	this.w = this.li.outerWidth(true);
	this.box.width(this.w*this.l);
	this.maxL = this.l - this.v;

	//要多图滚动 重新计算变量
	this.s = o.s||1;
	if(this.s>1){
		this.w = this.v*this.w;
		this.maxL = Math.floor(this.l/this.v);
		this.box.width(this.w*(this.maxL+1));
		//计算需要添加数量
		var addNum = (this.maxL+1)*this.v-this.l;
		var addHtml = "";
		for(var adN = 0;adN < addNum;adN++){
			addHtml += "<li class='addBox'><div class='photo'></div><div class='text'></div></li>";
		};
		this.box.append(addHtml);
	};
	
	//生成状态图标
	this.numIco = null;
	if(o.numIco){
		this.numIco  = $("#"+o.numIco);
		var numHtml = "";
		numL = this.loop?(this.l-1):this.l;
		for(var i = 0;i<numL;i++){
				numHtml+="<a href='javascript:void(0);'>"+i+"</a>";
		};
		this.numIco.html(numHtml);
		this.numIcoLi = this.numIco.find("a");
		this.numIcoLi.bind("click",function(){
			if(that.c==$(this).html())return false;
			that.c=$(this).html();
			that.move();
		});
	};
	this.bigBox = null;
	this.loadNumBox = null;
	if(o.loadNumBox){
		this.loadNumBox = $("#"+o.loadNumBox);
	};

	//当前序号设置
	this.allNumBox = null;
	if(o.loadNumBox){
		this.allNumBox = $("#"+o.allNumBox);
		if(o.bBox){
			var cAll = this.l<10?("0"+this.l):this.l;
		}else{
			var cAll = this.maxL<10?("0"+(this.maxL+1)):(this.maxL+1);
		};
		this.allNumBox.html(cAll);
	};

	//大图按钮点击操作
	if(o.bBox){
		this.bigBox = $("#"+o.bBox);
		this.li.each(function(n){
			$(this).attr("num",n);
			var cn = (n+1<10) ? ("0"+(n+1)):n+1;
			$(this).find(".text").html(cn);
		});
		this.loadNum = 0;
		this.li.bind("click",function(){
			if(that.loadNum==$(this).attr("num"))return false;
			var test = null;
			if(that.loadNum>$(this).attr("num")){
				test = "pre";
			};
			that.loadNum = $(this).attr("num");

			that.loadImg(test);
		});
		that.loadImg();
		if(o.bNext){
			that.bNext = $("#"+o.bNext);
			that.bNext.bind("click",function(){
				that.loadNum<that.l-1 ?that.loadNum++:that.loadNum=0;
				that.loadImg();
			});
		};
		if(o.bPre){
			that.bPre = $("#"+o.bPre);
			that.bPre.bind("click",function(){
				that.loadNum> 0? that.loadNum--:that.loadNum=that.l-1 ;
				that.loadImg("pre");
			});
		};
	};

	//滑动点击操作(循环or不循环)
	if(this.loop){
		this.btnP.bind("click",function(){
			if(that.c<=0){
				that.c = that.l-1;
				that.box.css({left:-that.c*that.w});		
			};
			that.c --;
			that.move(1);
		});
		this.btnN.bind("click",function(){
			if(that.c>=(that.l-1)){
				that.box.css({left:0});		
				that.c = 0;
			};
			that.c++;
			that.move(1);
		});
	}else{
		this.btnP.bind("click",function(){
			that.c> 0? that.c--:that.c=that.maxL ;
			that.move(1);
		});
		this.btnN.bind("click",function(){
			that.c<that.maxL ?that.c++:that.c=0;
			that.move(1);
		});
	};
	that.timer = null;
	if(o.auto){
		that.box.bind("mouseover",function(){
			clearInterval(that.timer);
		});
		that.box.bind("mouseleave",function(){
			that.autoPlay();
		});
		that.autoPlay();
		
	};
	this.move();
}

ShowPre.prototype = {
	move:function(test){ //滑动方法
		var that = this;
		var pos = this.c*this.w;
		//document.title = (test&&that.timer);
		if(test&&that.timer){
			clearInterval(that.timer);
		};
		//当前序号图标
		if(that.numIco){ 
			that.numIcoLi.removeClass("on");
			var numC = that.c;
			if(that.loop&&(that.c==(this.l-1))){
				numC= 0;	
			};
			that.numIcoLi.eq(numC).addClass("on");
		};

		this.box.stop();
		this.box.animate({left:-pos},function(){
			if(test&&that.auto){
				that.autoPlay();
			};
			if(that.loop&&that.c==that.maxL){
				that.c = 0;
				that.box.css({left:0})
			};
		});
		if(that.bigBox)return false;
		//设置大图加载序号
		if(that.loadNumBox){
			var loadC = parseInt(that.c)+1;
				loadC = loadC<10?"0"+loadC:loadC;
				that.loadNumBox.html(loadC);
		};

	},
	loadImg:function(test){ //加载大图方法
		var that = this;
		var _src = this.li.eq(that.loadNum).attr("bsrc"),bigTh3=null,bigTh4=null,bigText=null;
		if(that.li.eq(that.loadNum).attr("data-h")){
			//$("#bigT h3").html(that.li.eq(that.loadNum).attr("data-h"));
			var bigTh3 = $("#bigT h3");
			$("#bigT").hide();
			bigTh3.html("");
		};
		if(that.li.eq(that.loadNum).attr("data-m")){
			//$("#bigT h4").html(that.li.eq(that.loadNum).attr("data-m"));
			var bigTh4 = $("#bigT h4");
			$("#bigT").hide();
				bigTh4.html("");
		};
		if(that.li.eq(that.loadNum).attr("data-text")){
			//$("#bigText").html(that.li.eq(that.loadNum).attr("data-text"));
			var bigText = $("#bigText");
				bigText.html("").hide();
		};
		var img = new Image();
			$(img).hide();
			//loading dom操作(分首次加载和后面加载，根据点击操作设置运动方向)
			if(that.deInit){
				var le = 0;
				that.deInit = false;
				that.bigBox.html("<div class='loading'></div><div class='loading'></div>");
			}else{
				if(test!="pre"){
					var le = -1230;
					that.bigBox.append("<div class='loading'></div>");
				}else{
					var le = 1230;
					that.bigBox.find(".loading").before("<div class='loading'></div>");
					that.bigBox.css({"margin-left":-1230});
					le = 0;
				};				
			};
			that.bigBox.animate({"margin-left":le},function(){
				$(img).bind("load",function(){
					//判断出现方向
					if(test!="pre"){
						var n = 1,oldN = 0;
					}else{
						var n = 0,oldN = 1;
					};
					that.bigBox.find(".loading").eq(n).html(img);
					that.bigBox.find(".loading").eq(oldN).remove();
					that.bigBox.css({"margin-left":0});
					$(this).fadeIn(200,function(){
						if(bigTh3){
							$("#bigT").fadeIn()
							bigTh3.html(that.li.eq(that.loadNum).attr("data-h"));
						};
						if(bigTh4){
							$("#bigT").fadeIn()
							bigTh4.html(that.li.eq(that.loadNum).attr("data-m"));
						};
						if(bigText){
							bigText.html(that.li.eq(that.loadNum).attr("data-text")).fadeIn();
						};
					});
				});
				img.src = _src;
			});
			//添加当前加载序号
			that.li.removeClass("on");
			that.li.eq(that.loadNum).addClass("on");
			if(that.loadNumBox){
				var loadC = parseInt(that.loadNum)+1;
					loadC = loadC<10?"0"+loadC:loadC;
					that.loadNumBox.html(loadC);
			};
			
			
	},
	autoPlay:function(){ //自动播放方法
		var that =this;

		that.timer = setInterval(function(){
			that.c<that.maxL?that.c++:that.c=0;
			that.move();
		},4000);
	}
}
