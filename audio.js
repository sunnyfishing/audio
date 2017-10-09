$(function(){
	//创建歌曲列表
	var musList = [
		{
			name:"Centuries",
			singer : "Fall Out Boy",
			src : "music/Centuries - Fall Out Boy.mp3",
			num : 0,
		},
		{
			name:"The Phoenix",
			singer : "Fall Out Boy",
			src : "music/Fall Out Boy - The Phoenix.mp3",
			num : 1,
		},
		{
			name:"Immortals",
			singer : "Fall Out Boy",
			src : "music/Fall Out Boy - Immortals.mp3",
			num : 2,
		}
	];
	//改变当前播放的audio文件
	function curAudio(count){
		for(var i=0; i<musList.length; i++){
			if(i == count){
				sing(musList[i]);
			}
		}
	}
	//点击歌曲，直接开始播放
	var list = document.getElementsByClassName("list")[0]; 
	$(".list").click(function(event){
		if(event.target == list.children[0].children[0] || event.target == list.children[0].children[1]){
			sing(musList[0]);
		}
		if(event.target == list.children[1].children[0] || event.target == list.children[1].children[1]){
			sing(musList[1]);
		}
		if(event.target == list.children[2].children[0] || event.target == list.children[2].children[1]){
			sing(musList[2]);
		}
	})
	//点击上一曲
	$(".cont1 span:nth-child(1)").click(function(){
		//获得当前歌曲的标识，然后对数组进行遍历，当相同时，对下标+1，并再次调用sing（）函数
		var count = $($("audio")[1]).attr("num");
		if(count == 0){
			count = 0;
		}else{
			count--;
		}
		curAudio(count);
	})
	//点击下一曲
	$(".span1").click(function(){
		//获得当前歌曲的标识，然后对数组进行遍历，当相同时，对下标+1，并再次调用sing（）函数
		var count = $($("audio")[1]).attr("num");
		if(count == musList.length){
			count = musList.length;
		}else{
			count++;
		}
		curAudio(count);
	})
	//随机按钮，总数组中随机抽取一首歌并播放
	$(".cont2 span:nth-child(1)").click(function(){
		var ran =  parseInt(Math.random()*10);
		if(ran<3){
			sing(musList[0]);
		}else if(3<=ran && ran<6){
			sing(musList[1]);
		}else{
			sing(musList[2]);
		}
	})
	//播放函数
	var au = document.getElementById("audio1");
	var curtime = 0;
	var curm = 0;
	var curs = 0;
	var leng = 0;
	function sing(mus){
		//改变页面样式
		$(".cont1 span:nth-child(2)").css({display:"none"});
		$(".cont1 span:nth-child(3)").css({display:"inline"});
		$(".cir").css({animation : "cir 8s linear infinite"});
		$(".cont").css({animation : "cont 2s linear"});
		$(".cont").css({transform : "rotate(-30deg)"});
		//向页面添加播放信息
		$(".title").children()[0].innerText = mus.name;
		$(".title").children()[1].innerText = mus.singer
		au.src = mus.src;
		//$(au).attr({controls:"controls"});
		$(au).attr({num : mus.num});
		//控制播放
		au.play();			
		//添加播放监听
		au.addEventListener("canplay", function(){
			//获取总时长
			var m = parseInt(parseInt(au.duration)/60);
			var s = parseInt(au.duration)%60;
			if(s < 10){
				s = "0"+s;
			}
			$(".time").children()[2].innerText = m+":"+s;
			//获取每100毫秒的时长，并完成进度条
			var si = setInterval(function(){
				curtime = au.currentTime;
				curm = parseInt(curtime/60);
				curs = parseInt(curtime%60);
				length = curtime/parseInt(au.duration)*250;
				$(".progress").css({width : length+"px"});
				if(curs < 10){
					curs = "0"+curs;
				}
				$(".time").children()[0].innerHTML = curm+":"+curs;
				if(au.currentTime == au.duration){
					var count = $($("audio")[1]).attr("num");
					if(count != musList.length){
						count++;
						curAudio(count);
					}else{
						close();
					}
				}
			},100);
		})
		//重置按钮，重头开始播放
		$(".cont2 span:nth-child(2)").click(function(){
			au.currentTime = 0;
		})
		//点击开启按钮
		$(".cont1 span:nth-child(2)").on("click",function(){
			au.play();		
			open();
		})
		//点击暂停按钮
		$(".cont1 span:nth-child(3)").on("click",function(){
			au.pause();
			close();
		})
		
		
	}
	//播放时改变状态
	function open(){
		$(".cont1 span:nth-child(2)").css({display:"none"});
		$(".cont1 span:nth-child(3)").css({display:"inline"});
		$(".cir").css({animation : "cir 8s linear infinite"});
		$(".cont").css({animation : "cont 2s linear"});
		$(".cont").css({transform : "rotate(-30deg)"});
	}
	//暂停时改变状态
	function close(){
		$(".cont1 span:nth-child(3)").css({display:"none"});
		$(".cont1 span:nth-child(2)").css({display:"inline"});
		$(".cir").css({animation : ""});
		$(".cont").css({transform : "rotate(-65deg)"});
		$(".cont").css({animation : ""});		
	}
	//拖动音量条改变声音
	var divOut = document.getElementsByClassName("outBar")[0];
	var divIner = document.getElementsByClassName("innBar")[0];
	console.log(divOut);
	console.log(divIner);
	divOut.addEventListener("mousedown",function(){			//对鼠标按下与松开和移动的监听
		divOut.addEventListener("mousemove",movefunc);				
	})
	function movefunc(event){
		var h = event.offsetY;
		if(h>0 && h<100){
			divIner.style.height = h+"px";
			au.volume = (event.offsetY)/100;					
		}
	}
	document.addEventListener("mouseup",function(){
		divOut.removeEventListener("mousemove",movefunc);
	})
})
