$.fn.slide=function(options){
	
	var defaults={cate:'0'};
	var 
	    obj=$.extend(defaults,options),
	    index=0;
	    
    //根据不同的情况安排动画
	if(obj.cate==0){
		index=0;
		In_1();
	}else if(obj.cate==1){
		index=1;
	}else if(obj.cate==2){
		index=2;
	}

	function In_1(){
		console.log("sldkfsj");
		setTimeout(function(){
			$(".li_1_1").css({"opacity": "0"});
			$(".li_1_1").show().stop().animate({"opacity": "1","top":"115px"}, {queue:false,duration:800});
			setTimeout(function(){
				$(".li_1_2").css({"opacity": "0"});
				$(".li_1_2").show().stop().animate({"opacity": "1","top":"53px"}, {queue:false,duration:600});
				setTimeout(function(){
					$(".li_1_3").show().stop().animate({"left":"690px"}, {queue:false,duration:300});
					setTimeout(function(){
						$(".li_1_4").show().animate({"left":"690px"}, {queue:false,duration:600});
					},0);
				},500);
			},300);
		},200);
	}
};