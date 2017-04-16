/**
 * Created by Exbo on 2017/1/2.
 */

var hyz={};

var hyz_loader={
    loaded:0
};

hyz_loader.init=function(){
    stgPauseSE(null,"BGM");
    stg_in_replay=0;
    if(!this.loaded){
        //初始化环境
        this.loaded=1;
        //stg_refresher_type=1;
        stgLoadKeyMap();//初始化按键表
        bullet00Assignment();//初始化子弹文理绑定
        //载入音效
        stgLoadSE("se_alert","se/se_alert.wav").ready=1;
        stgLoadSE("se_graze","se/se_graze.wav").ready=1;
        stgLoadSE("se_select","se/se_select00.wav").ready=1;
        stgLoadSE("se_dead","se/se_pldead00.wav").ready=1;
        stgLoadSE("se_ok","se/se_ok00.wav").ready=1;
        stgLoadSE("se_cancel","se/se_cancel00.wav").ready=1;
        stgLoadSE("se_extend","se/se_extend.wav").ready=1;

        loadHyzFont();

        //横向场地
        stg_height=480;
        stg_width=640;

        stg_frame_w=288;
        stg_frame_h=448;

        var p=stgLoadData("render_type");
        p=0;
        stgCreateCanvas("frame",608,stg_frame_h,stg_const.TEX_CANVAS3D);
        stgCreateCanvas("frame_bg",stg_frame_w,stg_frame_h,stg_const.TEX_CANVAS3D_TARGET);
        stgCreateCanvas("frame_left",stg_frame_w,stg_frame_h,stg_const.TEX_CANVAS3D_TARGET);
        stgCreateCanvas("frame_full",608,stg_frame_h,stg_const.TEX_CANVAS3D_TARGET);
        stgCreateCanvas("frame_full_bg",608,stg_frame_h,stg_const.TEX_CANVAS3D_TARGET);

        stgCreateCanvas("frame_right",stg_frame_w,stg_frame_h,stg_const.TEX_CANVAS3D_TARGET);
        stg_main_canvas=stgCreateCanvas("ui",stg_width,stg_height,stg_const.TEX_CANVAS2D);
        stgCreateCanvas("back",stg_width,stg_height,stg_const.TEX_CANVAS2D);
        stgCreateCanvas("pause",stg_width,stg_height,stg_const.TEX_CANVAS2D);

        //激活鼠标事件捕捉
        stgEnableMouse();

        //显示canvas
        stgShowCanvas("back", 0, 0, 0, 0, 0);
        stgShowCanvas("frame", 0, 0, 0, 0, 1);
        stgShowCanvas("ui", 0, 0, 0, 0, 20);
        //载入渲染器
        stgAddShader("sprite_shader",hyzSpriteShader);
        stgAddShader("basic_shader",hyzPrimitive2DShader);
        stgAddShader("testShader2", default_2d_misc_shader);
        stgAddShader("3d_shader", default_3d_shader);

        stgCreateImageTexture("3dTex1","bg/grass2.png");
        stgCreateImageTexture("3dTex2","bg/wall.png");
        stgCreateImageTexture("3dTex3","bg/floor.png");

        renderCreate2DTemplateA1("ene_boom","pl_effect",192,176,64,64,64,0,0,1);
        renderCreate2DTemplateA1("bounce_0","pl_effect",192,240,16,16,16,0,0,1);
        renderCreate2DTemplateA1("bounce_1","pl_effect",64,240,16,16,16,0,0,1);


        stgCreateProcedure1("drawBackground","back",0,19,"testShader2","#DDD");
        stgCreateProcedure2("drawLeftFrame","frame_left",20,80,["sprite_shader","basic_shader"],"#000");
        stgCreateProcedure2("drawRightFrame","frame_right",20,80,["sprite_shader","basic_shader"],"#000");
        stgCreateProcedure1("drawFullFrame","frame_full",20,80,"sprite_shader","#000");

        stgCreateProcedure1("drawCombineFrame","frame",201,300,"sprite_shader","#000");
        stgCreateProcedure1("drawBGFrame","frame_bg",101,200,"3d_shader","#FFF");
        stgCreateProcedure1("drawFullBGFrame","frame_full_bg",101,200,"3d_shader","#FFF");

        stgCreateProcedure1("drawUI","ui",81,100,"testShader2");

        //stg_procedures["drawRightFrame"].transparent=1;
       // stg_procedures["drawLeftFrame"].transparent=1;
        stg_procedures["drawRightFrame"].sid=2;
        stg_procedures["drawLeftFrame"].sid=1;
        stg_procedures["drawFullFrame"].sid=3;

        stg_procedures["drawCombineFrame"].transparent=1;

        //创建绘制流程


        //设置只有一个玩家
        stg_players_number=2;
        stg_local_player_pos=0;
        stg_local_player_slot=[0,1];
        //创建输入设备
        stgCreateInput(0)//延迟为0
        //设置随机种子
        stg_rand_seed[0]=new Date().getTime();
        //等待资源下载完成
        stg_wait_for_all_texture=1;

        //初始化菜单
       // ifeGenerateMenu();
        //设置暂停脚本
        stg_pause_script=hyz.pause_script;
        stg_system_script=hyz_system_script;

        stgSetPositionA1(hyz.left_bg_object,0,0);
        hyz.left_bg_object.layer=20;
        hyz.left_bg_object.sid=1;
        ApplyFullTexture(hyz.left_bg_object,"frame_bg");
        stgSetPositionA1(hyz.left_screen_object,0,0);
        hyz.left_screen_object.layer=202;
        ApplyFullTexture(hyz.left_screen_object,"frame_left");
        stgSetPositionA1(hyz.right_bg_object,0,0);
        hyz.right_bg_object.layer=20;
        hyz.right_bg_object.sid=2;
        ApplyFullTexture(hyz.right_bg_object,"frame_bg");
        stgSetPositionA1(hyz.right_screen_object,320,0);
        hyz.right_screen_object.layer=202;
        ApplyFullTexture(hyz.right_screen_object,"frame_right");

        stgSetPositionA1(hyz.full_bg_object,0,0);
        hyz.full_bg_object.layer=20;
        hyz.full_bg_object.sid=3;
        ApplyFullTexture(hyz.full_bg_object,"frame_full_bg");

        stgSetPositionA1(hyz.full_screen_object,0,0);
        hyz.full_screen_object.layer=202;
        ApplyFullTexture(hyz.full_screen_object,"frame_full");



        gLoadMenuSystem();

        hyz.item_start.on_select={
            init:function(){
                stgStartLevel("hyz_level",["remilia","siki"],{});
            }
        }
    }
    stg_display = ["drawBackground","drawUI"];
    stgAddObject(hyz.resolution);
    stgAddObject(hyz.main_menu);
    stgDeleteSelf();
    hyz.main_menu.setColor("#88F","#880");
  //  stgAddObject(hyz.set_up_frame_object);
    if(stg_common_data.menu_state==1){//游戏结束返回的情况
        hyz.item_playreplay.selectable=1;
        hyz.item_savereplay.selectable=1;
        hyz.main_menu.setColor("#88F","#880");
        stgHideCanvas("frame");
    }
    stgClearCanvas("ui");

};

hyz_loader.script=function(){
    //
};

function ApplyFullTexture(obj,name){
    obj.render=new StgRender("sprite_shader");
    renderApplyFullTexture(obj.render,name);
}