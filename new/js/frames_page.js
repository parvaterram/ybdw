// if (!USER||!USER.userId){
//     window.location.href = "../index.html";
// }
var ROLETYPE=byNumGetName(USER.roleType);
var pageMain=function(){
    //var ROLETYPE=byNumGetName(25);
    var homePage=sessionStorage.getItem(ROLETYPE.s+'Home');
    var currentPage = setCurrentPage(); // current page当前页
    var isIndex=currentPage=='index.html';
    function configBrand(ao){
        var obj=$.extend({},USER);
        obj.logo='logo.png';
        obj.brandName='衣布到位';
        obj.parent='衣布到位';
        obj.userRole=ao.n;
        var lsHost=location.host;
        var lsStr=lsHost.substring(0,lsHost.indexOf('.'));
        var onLine=lsStr=='desk';
        if(ao.s=='TRADER'||ao.s=='AUDITOR'||ao.s=='OPERATOR'||ao.s=='PROVIDER'){
            var traderId=ao.s=='TRADER'?USER.userId:USER.traderId;
            if(onLine){

            }else{
                if(traderId=='8159'){
                    obj.logo='sanfu_logo.jpg';
                    obj.brandName='三福';
                    obj.parent='三福';
                }
            }
        }else if(ao.s=="IMPORTER"){
            obj.parent='';
        }
        return obj;
    }
    var loBrand=configBrand(ROLETYPE);
    var headerView=function(ao){
        var html='';
        html='<div class="navbar-brand">';
        html+='<a href="#" class="brand-logo"><img src="img/'+(ao?ao.logo:'logo.png')+'" alt="Logo" class="img-responsive img-rounded" height="60" width="60"></a>';
        html+='<a href="#" class="brand-info"><span class="brand-name">'+(ao?ao.brandName:'衣布到位')+'</span><span>& EBUDAOWEI</span></a>';
        html+='</div>';
        html+='<ul class="nav navbar-nav pull-right">' +
            //'<li class="dropdown" id="header-notification"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell"></i><span class="badge">7</span></a></li>' +
            '<li class="dropdown user" id="header-user">' +
                '<a class="dropdown-toggle" data-toggle="dropdown" style="cursor: pointer;">' +
                    '<img style="margin-right:10px;" width="30" alt="" src="img/headportrait.jpg" />' +
                    '<span class="username">'+(ao.userName||'')+'</span>' +
                    '<span style="display: block;text-align: right;">'+(ao?ao.parent:'衣布到位')+(ao?ao.userRole:'')+'</span>' +
                    '<i class="fa fa-angle-down"></i>' +
                '</a>' +
                '<ul class="dropdown-menu">' +
                    '<li><a href="#"><i class="fa fa-user"></i> 我的信息</a></li>' +
                    '<li><a href="#"><i class="fa fa-cog"></i> 密码修改</a></li>' +
                    '<li><a href="index.html"><i class="fa fa-power-off"></i> 退出</a></li>' +
                '</ul>' +
            '</li>' +
            '</ul>';
        $('.container',$('#header')).html(html);
    };
    var footerView=function(){

    };
    var bodyView=function(){
        getSideConfig();
        setHomePageBread(homePage);
        /**
        var lsMenu=sessionStorage.getItem(ROLETYPE.s+'sideBar');
        if(isIndex||!lsMenu){
            getSideConfig();
        }else{
            sideBarView(JSON.parse(lsMenu));
        }**/
    };
    function setHomePageBread(as){
        $('.page-header .home-page-bread').attr('href',as);
    }
    function setCurrentPage(){
        var lsPath=location.pathname;
        var index=lsPath.lastIndexOf('/');
        return lsPath.substring(index+1,lsPath.length);
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Sidebar
     /*-----------------------------------------------------------------------------------*/
    function roleSideData(as){
        var arr=[];
        switch (as) {
            case "ADMIN":
                //面料，   属性，  标签，  纽扣，   属性，  标签，  订单，评星，定制，订单审核，用户，新增，供应商,新增
                //arr = [120101,120102,120103,120201,120202,120203,1301,1401,1402,1501,1601,1602,1701,1702];
                arr = [
                    {"id":12,"c":[{"id":1201,"c":[{"id":120101},{"id":120102},{"id":120103}]},{"id":1202,"c":[{"id":120201},{"id":120202},{"id":120203}]}]},
                    {"id":13,"c":[{"id":1301}]},
                    {"id":14,"c":[{"id":1401},{"id":1402}]},
                    {"id":15,"c":[{"id":1501}]},
                    {"id":16,"c":[{"id":1601},{"id":1602}]},
                    {"id":17,"c":[{"id":1701},{"id":1702}]}
                ];
                break;
            case "TRADER":           //贸易商
                arr = [
                    {"id":12,"c":[{"id":1201,"c":[{"id":120101}]}]},
                    {"id":17,"c":[{"id":1701},{"id":1702}]},
                    {"id":16,"c":[{"id":1601},{"id":1602}]}
                ];
                break;
            case "OPERATOR":         //贸易商录入员
                arr=[
                    {"id":17,"c":[{"id":1701},{"id":1702}]},
                    {"id":12,"c":[{"id":1201,"c":[{"id":120101}]}]}
                ];
                break;
            case "AUDITOR":         //贸易商品检员
                arr=[{"id":14,"c":[{"id":1401}]}];
                break;
            case "DOCUMENTARY":      //跟单
                arr=[{"id":13,"c":[{"id":1301}]}];
                break;
            case "FINANCE":          //财务
                arr=[{"id":15,"c":[{"id":1501}]}];
                break;
            case "OPERATION":        //运营
                arr=[{"id":12,"c":[{"id":1201,"c":[{"id":120101}]}]}];
                break;
            case "IMPORTER":          //原材料录入员
                arr=[{"id":12,"c":[{"id":1201,"c":[{"id":120101}]}]}];
                break;
            case "PROVIDER":          //原材料供应商
                arr=[
                    {"id":12,"c":[{"id":1201,"c":[{"id":120101}]}]},
                    {"id":16,"c":[{"id":1601},{"id":1602}]}
                ];
                break;
        }
        return arr;
    }
    function getSideConfig(){
        $.get('json/side_config.json',function(res){
            var arr=roleSideData(ROLETYPE.s);
            var lxMenu=roleSideConfig(arr,res);
            sessionStorage.setItem(ROLETYPE.s+'sideBar',JSON.stringify(lxMenu));
            if(!isIndex){sideBarView(lxMenu)}
        },'json');
    }
    function roleSideConfig(ar1, ar2) {
        var arr = [];
        for (var i = 0; i < ar1.length; i++) {
            for (var j = 0; j < ar2.length; j++) {
                if (ar1[i].id == ar2[j].id) {
                    arr[i] = {};
                    arr[i].id = ar1[i].id;
                    arr[i].name = ar2[j].name;
                    arr[i].path = ar2[j].path || "javascript:;";
                    if (ar1[i].c && ar1[i].c.length > 0) {
                        arr[i].children = roleSideConfig(ar1[i].c, ar2[j].children);
                    }
                    break;
                }
            }
        }
        return arr;
        /***
         for(var i=0,id=0;i<arr.length;i++){
            id=''+arr[i];
            newArr[i]=formatData(id,arr2);
        }
         return newArr;

         function formatData(as,ar){
            var obj={};
            for(var i=0,iid=0;i<ar.length;i++){
                iid=''+ar[i].id;
                if(iid==as.substring(0,iid.length)){
                    obj.name=ar[i].name;
                    obj.path=ar[i].path||"javascript:;";
                    if(ar[i].children&&ar[i].children.length>0){
                        obj.children=formatData(as,ar[i].children);
                    }
                    break;
                }
            }
            return obj;
        }
         ***/
    }
    function sideBarView(ar){
        if(!ar){
            return;
        }
        var html='';
        html='<div class="sidebar-menu nav-collapse">';
        html+=createSideBar(ar);
        html+='</div>';
        $('#sidebar',$('#page')).html(html);
        openSideBar();
        handleSidebar();
    }
    function createSideBar(ar,ab){
        var items=ar||[];
        var html='';
        html='<ul'+(ab?' class="sub" style="display:none;"':'')+'>';
        for(var i=0;i<items.length;i++){
            var item=items[i];
            if(item.children && item.children.length>0){
                html+='<li class="has-sub">';
                html+='<a href="'+item.path+'"><i></i><span>'+item.name+'</span><span class="arrow"></span></a>';
                html+=createSideBar(item.children,1);
                html+='</li>';
            }else{
                html+='<li><a href="'+item.path+'"><i></i><span>'+item.name+'</span><span></span></a></li>';
            }
        }
        html+='</ul>';
        return html;
    }
    function openSideBar(){
        var ele=$('a[href="'+currentPage+'"]',$('#sidebar'));
        ele.css('background','#fff').parents('.sub').css('display','block').parents('.has-sub').addClass('open');
    }
    var handleSidebar = function () {
        jQuery('.sidebar-menu .has-sub > a').click(function () {
            var $this = $(this);
            var last=$this.parent().siblings('.has-sub.open');
            last.removeClass("open");
            jQuery('.arrow', last).removeClass("open");
            jQuery('.sub', last).slideUp(200);

            var slideOffeset = -200;
            var slideSpeed = 200;

            var sub = $this.next();
            if (sub.is(":visible")) {
                jQuery('.arrow', jQuery(this)).removeClass("open");
                jQuery(this).parent().removeClass("open");
                sub.slideUp(slideSpeed, function () {
                    // if ($('#sidebar').hasClass('sidebar-fixed') == false) {
                    //     App.scrollTo(thisElement, slideOffeset);
                    // }
                    //handleSidebarAndContentHeight();
                });
            } else {
                jQuery('.arrow', jQuery(this)).addClass("open");
                jQuery(this).parent().addClass("open");
                sub.slideDown(slideSpeed, function () {
                    // if ($('#sidebar').hasClass('sidebar-fixed') == false) {
                    //     App.scrollTo(thisElement, slideOffeset);
                    // }
                    //handleSidebarAndContentHeight();
                });
            }
        });
    };
    return {
        homePage:homePage,
        init:function(){
            !isIndex&&headerView(loBrand);
            bodyView();
            !isIndex&&footerView();
        }
    }
}();
$('document').ready(function () {
        pageMain.init();
    }
);
