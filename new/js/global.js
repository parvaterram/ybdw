var COMPANY = {
	title:"衣布到位 - 面料、纺织品采购平台",
	name:"衣布到位",<!--<img src='/img/name.png'>-->
	summary:"找布买布 一步到位",
	footer:"Copyright&copy;2016-2017 广州衣布到位信息科技有限公司 粤ICP备15050983号-1",
	appName:3,
	copyright:"Copyright&copy;2016-2017",
	company:"广州衣布到位信息科技有限公司",
	record:"粤ICP备15050983号-1"
};
document.title=COMPANY.title;

var USER = getUser();
var TOUSER=getToUser();
var MOPG = getRequest();

var SERVER_URL = "http://" + window.location.host;
var OPEN_API = "/api";
var SUBJOIN_PARA = "&appName=" + COMPANY.appName + "&userId=" + (USER&&USER.userId);

var USER_ROLE_TYPE = [
	{t: 23, n: "贸易商", s: "TRADER"},
	{t: 24, n: "贸易商品检员", s: "AUDITOR"},
	{t: 25, n: "贸易商录入员", s: "OPERATOR"},
	{t: 20, n: "原材料采购商", s: "BUYER"},
	{t: 21, n: "原材料录入员", s: "IMPORTER"},
	{t: 22, n: "原材料供应商", s: "PROVIDER"},
	{t: 3,  n: "超级管理员", s: "ADMIN"},
	{t: 17, n: "运营管理员", s: "OPERATION"},
	{t: 18, n: "财务管理员", s: "FINANCE"},
	{t: 19, n: "跟单管理员", s: "DOCUMENTARY"}
];

var ORDER_STATUS = [
	{t:0,n:"待付款",s:"ARREARAGE"},
	{t:6,n:"待审核",s:"COMFIRM"},			//用户选择线下支付，用户订单改为待确认的 状态
	{t:1,n:"待配货",s:"ALLOCATION"},			//用户已付款，等待管理员去跟进
	{t:5,n:"待发货",s:"HANDLED"},			//管理员跟进中。
	{t:2,n:"已发货",s:"DELIVERED"}, 			//管理员已发货
	{t:3,n:"已收货",s:"RECEIVED"},  			//用户已收货
	{t:4,n:"已取消",s:"CANCELED"}			//本订单被取消（用户本人或管理员操作）
];

var BILL_TYPES = [
    {t:0,n:"全部",s:"ALL"},
    {t:1,n:"充值",s:"PAY"},
    {t:2,n:"消费",s:"CONSUME"},
    {t:3,n:"退费",s:"REFUND"},
    {t:4,n:"赠送",s:"PRESENT"},
    {t:5,n:"冻结",s:"FREEZE"},
    {t:6,n:"解冻",s:"UNFREEZE"},
    {t:7,n:"扣款",s:"DEDUCT"}
];

var INCOME_TYPES = [
	{t:1,n:"收入",s:"INCOME"},
	{t:2,n:"结算",s:"BILLING"},
	{t:3,n:"扣除",s:"DEDUCT"},
	{t:4,n:"赠送",s:"PRESENT"}
];
var COUPON_STATUS = [
	{t:0,n:"可用",s:"AVAILABLE"},
	{t:1,n:"绑定未支付",s:"NON"},
	{t:3,n:"已用",s:"USED"},
	{t:2,n:"过期",s:"OVER"}
];

var PRODUCT_STATUS=[
	{t:0,n:"待审核",s:'COMFIRM'},
	{t:1,n:"出售中",s:'SALE'},
	{t:2,n:"下架",s:'SOLD'},
	{t:3,n:"不通过",s:'NOPASS'}
];

//产品类别，0，生产，1，现货，2，定制'
var PRODUCT_TYPES=[
	{t:0,n:"生产"},
	{t:1,n:"现货"},
	{t:2,n:"定制"}
];
var PRODUCT_TYPE=[
	{t:6,n:"面料",p:1},
	// {t:2,n:"纽扣",p:2},
	// {t:3,n:"拉链",p:3}
];
var PRICE_TYPES=[
	{t:1,n:"大货",s:'LARGE'},
	{t:2,n:"米样",s:'SAMPLE'},
	{t:3,n:"色卡",s:'CARD'}
];
var PRICE_UNIT=[
	{t:1,n:"米",s:''},
	{t:2,n:"公斤",s:''},
	{t:3,n:"码",s:''}
];
var PROVIDER_MAJORS=[
	{t:31,n:"面料",s:'CLOTH'},
	{t:321,n:"纽扣",s:'BUTTON'},
	{t:322,n:"拉链",s:'ZIPPER'}
];
var byNumGetName=function(t,ts){
    ts = ts||USER_ROLE_TYPE;
	for (var i=0; i<ts.length; i++){
		if (t==ts[i].t){
			return ts[i];
		}
	}
	return null;
}
												//v: 0-原图   1-小图   2-中图   3-大图
var getPicUrlForCode =  function(url,v,t){		//t: 0-款式图; 1-设计师图; 2-头像图; 3-名片图;
	var ptype = t||0;
	var psize = "";
	if (t==0){
		psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/100/h/100/q!/85":(v==2)?"?imageView2/1/w/200/h/200/q!/85":"?imageView2/1/w/800/h/800/q!/85";
	}else if (t==1){
		psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/200/h/150/q!/85":(v==2)?"?imageView2/1/w/800/h/400/q!/85":"?imageView2/1/w/1600/h/800/q!/85";
	}
	else if (t==2){
		psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/50/h/50/q!/85":(v==2)?"?imageView2/1/w/200/h/200/q!/85":"?imageView2/1/w/600/h/600/q!/85";
	}else if (t==3){
		psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/60/h/90/q!/85":(v==2)?"?imageView2/1/w/200/h/300/q!/85":"?imageView2/1/w/600/h/900/q!/85";
	}
	var picUrl = url + psize; 
	return picUrl;
};

try {
	template.helper("getPicUrl", function(url,v,t){
		var ptype = t||0;
		var psize = "";
		if (t==0){
			psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/200/h/300/q!/85":(v==2)?"?imageView2/1/w/500/h/750/q!/85":"?imageView2/1/w/1200/h/1800/q!/85";
		}else if (t==1){
			psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/200/h/150/q!/85":(v==2)?"?imageView2/1/w/800/h/400/q!/85":"?imageView2/1/w/1600/h/800/q!/85";
		}else if (t==2){
			psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/50/h/50/q!/85":(v==2)?"?imageView2/1/w/200/h/200/q!/85":"?imageView2/1/w/600/h/600/q!/85";
		}else if (t==3){
			psize = (v==null||v==0)?"":(v==1)?"?imageView2/1/w/60/h/90/q!/85":(v==2)?"?imageView2/1/w/200/h/300/q!/85":"?imageView2/1/w/600/h/900/q!/85";
		}
		var picUrl = url + psize; 
		return picUrl;
	});
} catch(e) {}

// 获取url参数
var getQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
};

//拼接url传参字符串
var perapara = function(objvalues, isencode) {
    var parastring = "";
    for (var key in objvalues) {
        isencode = isencode || false;
        if (isencode) {
            parastring += (key + "=" + encodeURIComponent(objvalues[key]) + "&");
        }
        else {
            parastring += (key + "=" + objvalues[key] + "&");
        }
    }
    parastring = parastring.substr(0, parastring.length - 1);
    return parastring;
};

//获取所有url参数并返回obj
function getRequest() {
	var lshref = document.location.href;
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
		  var str = url.substr(1);
		  var strs = str.split("&");
		  for(var i = 0; i < strs.length; i ++) {
			 theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		  }
	}
	return theRequest;
}

var Cookie = {
	set : function(c_name, value, expiredays){
 　　　 var exdate=new Date();
　　　　exdate.setDate(exdate.getDate() + expiredays);
　　　　document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
 　 },
	get : function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))     return unescape(arr[2]);
		else  return null;
	},
    del : function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=Cookie.get(name);
		if(cval!=null)
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	},
	clear : function(){ 
		var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
		if (keys) { 
			for (var i = keys.length; i--;) 
			document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString() 
		} 
	} 	
}

//格式化日期
var dateFormat = function(date, format) {
	date = new Date(date);
	var map = {
		"M": date.getMonth() + 1, //月份
		"d": date.getDate(), //日
		"h": date.getHours(), //小时
		"m": date.getMinutes(), //分
		"s": date.getSeconds(), //秒
		"q": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if (format==null) format = "yyyy-MM-dd hh:mm:ss";
	format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
		var v = map[t];
		if (v != undefined) {
			if (all.length > 1) {
				v = '0' + v;
				v = v.substr(v.length - 2);
			}
			return v;
		} else if (t == 'y') {
			return (date.getFullYear() + '').substr(4 - all.length);
		}
		return all;
	});
	return format;
};

var showElTip = function(asEL,asInfo,aspl){
	$(asEL).tooltip('destroy');
	if (!aspl) aspl="top";
	$(asEL).attr({"title":asInfo,"data-toggle":"tooltip","data-placement":aspl});
	$(asEL).tooltip({html:true});
	$(asEL).tooltip('show');
	setTimeout(function(){
		$(asEL).tooltip('destroy');
	},2000);
}

var formatMoney = function(ai) {
	var number = ai,
		negative = number < 0 ? "-" : "",
		i = parseInt(number = Math.abs(+number || 0).toFixed(2), 10) + "";
	return negative + i + "." + Math.abs(number - i).toFixed(2).slice(2);
};

var replaceAll = function(s0, s1, s2) {
	return s0.replace(new RegExp(s1, "gm"), s2);
};

function getUser(){
	return JSON.parse(sessionStorage.getItem("User"));
}
function getToUser(){
	return JSON.parse(sessionStorage.getItem('toUser'));
}
//--------获取更新用户信息-------//

var updateUser = function (id,rt,cb) {
	var port = "/auth.do?cmd=getUserDetail&toUserId=";
	if (rt == 2) {
		port = "/show.do?cmd=queryDesignerDetail&designerId=";
	}
	$.getJSON(SERVER_URL + OPEN_API + port + id ,{appName:COMPANY.appName,userId:id}, function (res) {
		if (res.exDesc != null) {
			alert(res.exDesc);
		} else {
			USER = res;
			sessionStorage.setItem("User", JSON.stringify(USER));
			cb && cb();
		}
	});
};

//--------标签组选择器-------//
var labelGroup={
	init:function(){
		var lxEle=$('.ui-labelGroup');
		for (var i=0; i<lxEle.length; i++){
			$(lxEle[i]).find(".label:not('.click')").on('click',function(){
				if (!$(this).hasClass('label-warning')){
					var isMultiple = parseInt($(this).parent().attr('isMultiple'))||0;
					if(isMultiple){
						$(this).toggleClass('label-danger active');
						$(this).toggleClass('label-default');
					}else{
						$(this).parent().find(".label:not(.label-warning)").attr("class",'label label-default');
						$(this).attr("class",'label label-danger active');
					}
				}
			})
			$(lxEle[i]).find(".label:not('.click')").addClass('click');
		}
	}
}
//--------页码自动控制-------//
var pageChange ={
	spaceCount:12,
	isInit:false,
	init:function(){
		var lEle=$('.ui-pageChange');
		if (lEle.length<=0) return false;
		if (this.isInit) return false;
		var liMaxPage=Math.ceil(lEle.attr('maxPage'))||1;
		var liCurPage=parseInt(MOPG["P"]||lEle.attr('currentPage'))||0;
		if (parseInt(lEle.attr('currentPage'))!=liCurPage){
			lEle.attr('currentPage',liCurPage);
		}
		var liTotalpage=parseInt(lEle.attr('totalLeaf'))||0;
		var li1 = parseInt((liCurPage-5)/(this.spaceCount-2));
		var li2 = parseInt((liMaxPage-liCurPage+2)/(this.spaceCount-2));
		var lxS = [];
		lxS[lxS.length] = '<li class="pageInfo"><a>共'+liTotalpage+'条记录</a></li>';
		var loPer = $.extend({},MOPG);
		for (var i=0; i<liMaxPage; i++){
			loPer.P = i;
			if (liCurPage == i){
				lxS[lxS.length] = '<li class="active"><a title="第'+(i+1)+'页" href="?' + perapara(loPer) + '">'+(i+1)+'</a></li>';
			}else if (i<=2){
				lxS[lxS.length] = '<li><a title="第'+(i+1)+'页" href="?' + perapara(loPer) + '">'+(i+1)+'</a></li>';
			}else if(i>=liMaxPage-2){
				lxS[lxS.length] = '<li><a title="第'+(i+1)+'页" href="?' + perapara(loPer) + '">'+(i+1)+'</a></li>';
			}else if (i==parseInt(liCurPage)-1||i==parseInt(liCurPage)+1){
				lxS[lxS.length] = '<li><a title="第'+(i+1)+'页" href="?' + perapara(loPer) + '">'+(i+1)+'</a></li>';
			}else{
				var lb1=(i==3||i==liCurPage+2)?true:false;
				var lb2=false;
				if (i<=liCurPage){
					lb2 = (i==3)||(i==liCurPage-2)||(i%li1==0);
					if (liCurPage<this.spaceCount) lb2 = (i<this.spaceCount);
				}else{
					lb2 = (i==liCurPage+2)||(i==liMaxPage-3)||(i%li2==0);
				}
				var lb3=(i==liCurPage-2||i==liMaxPage-3)?true:false;
				if (lb1) lxS[lxS.length] = '<li class="small-p"><a>';
				if (lb2) lxS[lxS.length] = '<span onclick="pageChange.toPage('+i+')"; title="第'+(i+1)+'页">.</span>';
				if (lb3) lxS[lxS.length] = '</a></li>';
			}
		}
		if(liMaxPage>5){
			lxS[lxS.length] = '<li><input type="text" class="in-page-num" style="width:50px;height:34px;margin:0 5px;border-radius: 3px;" value="'+(liCurPage+1)+'"><button class="btn btn-default jump-page-btn" style="height:34px;margin-top:-3px;">跳转</button></></li>';
		}
		lEle.html(lxS.join(""));
		var _this=this;
		$('.jump-page-btn').on('click',function(){
			var pageNum=parseInt($('.in-page-num').val());
			pageNum=pageNum>liMaxPage?liMaxPage:pageNum<=0?1:pageNum;
			_this.toPage(pageNum-1);
		})
	},
	toPage:function(aip){
		var loPer = MOPG;	loPer.P = aip||0;
		location.href='?' + perapara(loPer)
	}
}
var uploadIMG = {										//-----图片上传组件-----//
	imgEl:null,
	isInit:false,
	isSingle:true,
	singleClass:"ui-upload",
	multipleClass:"ui-upload-group",
	isFormData:new FormData()||null,
	init : function(){
		var $single   = $("."+this.singleClass);
		var $multiple = $("."+this.multipleClass);

		if (!this.isInit) {
			$('body').append('<form method="post" enctype="multipart/form-data" class="upload-form" target="UploadFrame" hidden><input type="file" name="files[]" class="upload-file-btn"></form>');

			if (!this.isFormData) {
				$('body').append('<iframe class="UploadFrame" onload="if (typeof uploadIMG.checkupFile!= \'undefined\'){ uploadIMG.checkupFile()}" name="UploadFrame" style="display:none"></iframe>');
			}
			if ($multiple.length > 0) {
				for (var i = 0; i < $multiple.length; i++) {
					var lxImgs = eval($($multiple[i]).attr("imgList") || '') || [];
					var liuploadtype = $($multiple[i]).attr("imageType") || 0;
					var liuploadsize = $($multiple[i]).attr("imageSize") || 0;
					var lsH = "";
					for (var j = 0; j < lxImgs.length; j++) {
						lsH += '<div>';
						lsH += '<img class="' + this.singleClass + '" imageSrc="' + lxImgs[j].image + '" imageType="' + (lxImgs[j].imgType || 0) + '" imageSize="' + liuploadsize + '" imageId="' + (lxImgs[j].imageId || 0) + '" src="' + getPicUrlForCode(lxImgs[j].image, liuploadsize, liuploadtype) + '">';
						lsH += '<span class="glyphicon glyphicon-remove-circle" onclick="uploadIMG.removeImg(this)"></span>';
						lsH += '</div>';
					}
					lsH += '<div class="btn multiple-upload-btn" imageType="' + liuploadtype + '" imageSize="' + liuploadsize + '"><i class="glyphicon glyphicon-cloud-upload"></i>图片上传</div>';
					$($multiple[i]).append(lsH);
				}
			}
			var _this = this;
			$('body').on('click', "." + this.singleClass, function () {
				_this.imgEl = $(this);
				_this.isSingle = true;
				var liuploadtype = $(this).attr("imageType") || 0;
				$('.upload-file-btn').removeAttr('multiple').attr('imageType',liuploadtype).click();
			}).on('click', ".multiple-upload-btn", function () {
				_this.imgEl = $(this);
				_this.isSingle = false;
				var liuploadtype = $(this).attr("imageType") || 0;
				$('.upload-file-btn').attr({'multiple': 'multiple','imageType':liuploadtype}).click();
			});
			$('.upload-file-btn').on('change', function () {
				waitLoading.show();
				var liuploadtype = $(this).attr("imageType") || 0;
				if ($(this).val() == "") return;
				var $form = $(this).parents('.upload-form');
				//_this.uploading();
				if (_this.isFormData) {
					_this.toUpload($form, liuploadtype);
				} else {
					$form.attr('action', SERVER_URL + OPEN_API + "/upload?userId=" + USER.userId + "&type=" + liuploadtype);
					$form.submit();
				}
				$form[0].reset();
			});
		}
		this.isInit = true;
	},
	uploading : function (){
		waitLoading.show();
	},
	removeImg:function(ae){
		if (confirm("确实要删除这张图片?")){
			if($(ae).hasClass('show')){
				$(ae).prev('img').attr({
					'src':'../img/add-default.png',
					'imageSrc':'',
					'imageId':0,
					'imageKey':''
				});
				$(ae).removeClass('show').addClass('hide');
			}else{
				$(ae).parent().remove();
			}
		}
	},
	checkupFile:function(ar){
		waitLoading.hide();
		var lxImgs=ar||[];
		if(!this.isFormData){
			var lsText = $(".UploadFrame")[0].contentWindow.document.body.innerText||$(".UploadFrame")[0].contentWindow.document.body.textContent;
			if (lsText!=""&&lsText!=null) {
				lxImgs = JSON.parse(lsText).urls||[];
			}else{
				return;
			}
		}
		if(lxImgs.length>0){
			var le = $(this.imgEl);
			var liuploadtype = $(this.imgEl).attr("imageType")||0;
			var liuploadsize = $(this.imgEl).attr("imageSize")||0;
			if (this.isSingle){
				le.attr({
					'src':getPicUrlForCode(lxImgs[0].image,liuploadsize,liuploadtype),
					'imageSrc':lxImgs[0].image,
					'imageType':liuploadtype,
					'imageSize':liuploadsize,
					'imageId':lxImgs[0].imageId||0,
				});
				if(le.next('span').hasClass('hide'))le.next('span').removeClass('hide').addClass('show');
			}else{
				var lsH = '';
				for (var i=0; i<lxImgs.length; i++){
					lsH += '<div>';
					lsH += '<img class="'+this.singleClass+'" imageSrc="'+lxImgs[i].image+'" imageType="'+liuploadtype+'" imageSize="'+liuploadsize+'" imageId="'+(lxImgs[i].imageId||0)+'" src="'+ getPicUrlForCode(lxImgs[i].image,liuploadsize,liuploadtype) +'">';
					lsH += '<span class="glyphicon glyphicon-remove-circle" onclick="uploadIMG.removeImg(this)"></span>';
					lsH += '</div>';
				}
				le.before(lsH);
			}
		}else{
			alert('图片上传失败了!');
		}
	},
	getGroupList : function(ae){
		if (ae==null) ae = $("."+this.multipleClass)[0];
		var lxImgs = $(ae).find('img');
		var lxData = [];
		for (var i=0; i<lxImgs.length; i++){
			var leImg = $(lxImgs[i]);
			lxData[lxData.length] = {"image":leImg.attr("imageSrc"), imageId:leImg.attr("imageId"),sn:i};
		}
		return lxData;
	},
	toUpload:function(ad,at){
		var dom=ad||null;
		if(!dom){
			return false;
		}
		var formData = new FormData($(dom)[0]);
		var _this=this;
		$.ajax({
			url: SERVER_URL + OPEN_API + "/upload?userId=" + USER.userId+ "&type=" + at,
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			dataType:'json',
			success: function (res) {
				waitLoading.hide();
				if (res.exDesc!=null) {
					alert(res.exDesc);
				}else{
					_this.checkupFile(res.urls);
				}
			},
			error: function (res) {
				waitLoading.hide();
				alert(res);
			}
		});
	}
}
var waitLoading = {
	time : null,
	isInit : false,
	init: function () {
		if(!this.isInit){
			var html = '';
			html = '<div class="wait-loading-mask col-md-12" style="height:100%;background:rgba(0,0,0,.7);position:fixed;top:0;z-index:999;display:none;">';
			html += '<div class="col-md-1 col-md-offset-6" style="margin-top:300px">';
			html += '<img class="img-responsive" src="img/loading.gif"></div></div>';
			$('body').append(html);
			this.isInit=true;
		}
	},
	show: function () {
		var me=this;
		$('.wait-loading-mask').css('display','block');
		this.time=setTimeout(function(){
			me.hide();
		},10000)
	},
	hide: function () {
		setTimeout(function(){
			$('.wait-loading-mask').css('display','none');
		},200);
		clearTimeout(this.time);
	}
}
$(document).ready(function() {
	waitLoading.init();
});