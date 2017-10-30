var ROLETYPE;
var pageMain=function(){
    var currentPage = setCurrentPage(); // current page当前页
    if(currentPage!="index.html"&&(!USER||!USER.userId)){
        window.location.href = "index.html";
        return;
    }
    ROLETYPE=byNumGetName(USER.roleType);
    var homePage=sessionStorage.getItem(ROLETYPE.s+'Home');
    function configHead(ao){
        var str=ao.s||'';
        var obj=$.extend({},USER);
        obj.logo='logo.png';
        obj.brandName='衣布到位';
        obj.parent='衣布到位';
        obj.userRole=ao.n;
        var lsHost=location.host;
        var lsStr=lsHost.substring(0,lsHost.indexOf('.'));
        var onLine=lsStr=='desk';
        if(str=='TRADER'||str=='AUDITOR'||str=='OPERATOR'||str=='PROVIDER'){
            var traderId=str=='TRADER'?USER.userId:USER.traderId;
            if(onLine){

            }else{
                if(traderId=='8159'){
                    obj.logo='sanfu_logo.jpg';
                    obj.brandName='三福';
                    obj.parent='三福';
                }
            }
        }else if(str=="IMPORTER"){
            obj.parent='';
        }
        if(str=="ADMIN"||str=="OPERATION"||str=="FINANCE"||str=="DOCUMENTARY"){
            obj.myInfo='user_edit_info.html';
        }else{
            obj.myInfo='user_edit_'+str.toLowerCase()+'.html';
        }
        return obj;
    }
    var headerView=function(ao){
        var html='';
        html='<div class="navbar-brand">';
        html+='<a href="#" class="brand-logo"><img src="img/'+(ao?ao.logo:'logo.png')+'" alt="Logo" class="img-responsive img-rounded" height="60" width="60"></a>';
        html+='<a href="#" class="brand-info"><span class="brand-name">'+(ao?ao.brandName:'衣布到位')+'</span><span>& EBUDAOWEI</span></a>';
        html+='</div>';
        html+='<ul class="nav navbar-nav pull-right">' +
            //'<li class="dropdown" id="header-notification"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-bell"></i><span class="badge">7</span></a></li>' +
            '<li class="dropdown user" id="header-user">' +
                '<a class="dropdown-toggle" data-toggle="dropdown">' +
                    '<img width="50" alt="" src="img/headportrait.jpg" />' +
                    '<span class="username">'+(ao.userName||'')+'</span>' +
                    '<span >'+(ao?ao.parent:'衣布到位')+(ao?ao.userRole:'')+'</span>' +
                    '<i class="fa fa-angle-down"></i>' +
                '</a>' +
                '<ul class="dropdown-menu">' +
                    '<li><a href="'+(ao.myInfo||'#')+'"><i class="fa fa-user"></i> 我的信息</a></li>' +
                    '<li><a href="user_edit_pwd.html"><i class="fa fa-cog"></i> 密码修改</a></li>' +
                    '<li><a href="index.html"><i class="fa fa-power-off"></i> 退出</a></li>' +
                '</ul>' +
            '</li>' +
            '</ul>';
        $('.container',$('#header')).html(html);
    };
    var footerView=function(){
        var html='';
        html='<p>'+COMPANY.footer+'</p>';
        $('.container',$('#footer')).html(html);
    };
    var bodyView=function(){
        getSideConfig();
        setHomePageBread(homePage);
        /**
        var lsMenu=sessionStorage.getItem(ROLETYPE.s+'sideBar');
        if(!lsMenu){
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
    function getSideConfig(){
        $.get('json/side_config.json',function(res){
            var config=res.config&&res.config[ROLETYPE.s]?res.config[ROLETYPE.s].list||[]:[];
            var list=res.list||[];
            var level=getLevel(config);
            var lxMenu=roleSideConfig(level,list);
            sessionStorage.setItem(ROLETYPE.s+'sideBar',JSON.stringify(lxMenu));
            sideBarView(lxMenu);
        },'json');
    }
    function getLevel(arr,unit,mer,item,n){
        if (unit==null) unit = 2;
        if (mer==null) mer = {};
        if (n==null)   n=0;
        var brecu = false;
        if (n==0) item=mer;
        for (var i=0; i<arr.length; i++){
            var str = arr[i].substring(0,n*unit+unit);
            if (arr[i].substring(n*unit+unit)!=""){
                brecu = true;
            }
            if (item.c==null)  item.c=[];
            var xrr = item.c;
            var bpush = true;
            for (var j=0; j<xrr.length; j++){
                if (xrr[j].id==str || str.length - (item.id||"").length !=unit ){
                    bpush = false;
                    break;
                }
            }
            if (str.substring(0,str.length-unit) == (item.id||"")){
                if (bpush) xrr.push({id:str});
                //bpush&&item.c.push({id:str});
            }
        }
        if (brecu){
            n++;
            for (var i=0; i<item.c.length; i++){
                getLevel(arr,unit,mer,item.c[i],n);
            }
            n--;
        }
        return mer.c;
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
        //handleSidebar();
        findDimensions();
    }
    function createSideBar(ar,ab){
        var items=ar||[];
        var html='';
        html='<ul'+(ab?' class="sub"':'')+'>';
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
        var height=200;
        var $ele=$('a[href="'+currentPage+'"]',$('#sidebar'));
        if($ele.length>0){
            $ele.addClass('current').parents('.sub').css('display','block').parents('.has-sub').addClass('open');
            var offTop=$ele.offset().top;
            if(offTop>height){
                setTimeout(function(){
                    $('.sidebar-menu').scrollTop(offTop-height);
                },100);
            }
        }
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
    /*-----------------------------------------------------------------------------------*/
    /*	Sidebar & Main Content size match
     /*-----------------------------------------------------------------------------------*/
    function handleSidebarHeight() {
        var sidebar = $('#sidebar');
        var body = $('body');
        var height;

        if (body.hasClass('sidebar-fixed')) {
            height = $(window).height() - $('#header').height() + 1;
        } else {
            height = sidebar.height() + 20;
        }
    }

    function findDimensions() { //函数：获取尺寸
        var navTop=80,navBottom=80;
        var winHeight=0;
        //获取窗口高度
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        }else if ((document.body) && (document.body.clientHeight)) {
            winHeight = document.body.clientHeight;
        }

        //通过深入Document内部对body进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight) {
            winHeight=document.documentElement.clientHeight;
        }

        //设置div的具体宽度=窗口的宽度的%
        $('.sidebar-menu').css({"height":winHeight-(navTop+navBottom)+'px'});
    }
    return {
        homePage:homePage,
        init:function(){
            var loHead=configHead(ROLETYPE);
            headerView(loHead);
            bodyView();
            footerView();
        },
        findDimensions:findDimensions
    }
}();
$('document').ready(function () {
        pageMain.init();
    }
);
window.onresize=pageMain.findDimensions;